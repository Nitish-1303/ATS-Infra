from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import fitz  # PyMuPDF
import pdfplumber
import io
import re
from datetime import datetime

app = FastAPI(
    title="ATSInfra Parser Service",
    description="Resume parsing and ATS simulation engine",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseResult(BaseModel):
    success: bool
    parser: str
    sections: Dict[str, Any]
    raw_text: str
    metadata: Dict[str, Any]
    confidence_scores: Dict[str, float]
    issues: List[Dict[str, str]]

class ATSSimulation(BaseModel):
    ats_name: str
    parse_score: float
    sections_detected: List[str]
    issues: List[Dict[str, str]]
    recommendations: List[str]

# ATS Parser Simulators
class WorkdayParser:
    """Simulates Workday ATS parsing behavior"""
    
    @staticmethod
    def parse(text: str, metadata: dict) -> Dict[str, Any]:
        sections = WorkdayParser._extract_sections(text)
        issues = WorkdayParser._detect_issues(text, metadata)
        
        return {
            "ats_name": "Workday",
            "parse_score": WorkdayParser._calculate_score(sections, issues),
            "sections": sections,
            "issues": issues,
            "confidence": WorkdayParser._calculate_confidence(sections)
        }
    
    @staticmethod
    def _extract_sections(text: str) -> Dict[str, Any]:
        sections = {
            "contact": WorkdayParser._extract_contact(text),
            "experience": WorkdayParser._extract_experience(text),
            "education": WorkdayParser._extract_education(text),
            "skills": WorkdayParser._extract_skills(text)
        }
        return sections
    
    @staticmethod
    def _extract_contact(text: str) -> Dict[str, Any]:
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        
        emails = re.findall(email_pattern, text)
        phones = re.findall(phone_pattern, text)
        
        return {
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
            "parsed": bool(emails or phones),
            "confidence": 0.95 if emails and phones else 0.7
        }
    
    @staticmethod
    def _extract_experience(text: str) -> Dict[str, Any]:
        # Simple heuristic: look for common experience keywords
        experience_keywords = ["experience", "work history", "employment", "professional"]
        has_experience = any(keyword in text.lower() for keyword in experience_keywords)
        
        return {
            "found": has_experience,
            "parsed": has_experience,
            "confidence": 0.85 if has_experience else 0.3
        }
    
    @staticmethod
    def _extract_education(text: str) -> Dict[str, Any]:
        education_keywords = ["education", "university", "college", "degree", "bachelor", "master"]
        has_education = any(keyword in text.lower() for keyword in education_keywords)
        
        return {
            "found": has_education,
            "parsed": has_education,
            "confidence": 0.90 if has_education else 0.4
        }
    
    @staticmethod
    def _extract_skills(text: str) -> Dict[str, Any]:
        skills_keywords = ["skills", "technologies", "technical skills", "competencies"]
        has_skills = any(keyword in text.lower() for keyword in skills_keywords)
        
        return {
            "found": has_skills,
            "parsed": has_skills,
            "confidence": 0.80 if has_skills else 0.5
        }
    
    @staticmethod
    def _detect_issues(text: str, metadata: dict) -> List[Dict[str, str]]:
        issues = []
        
        # Check for multi-column layout
        if metadata.get("has_multiple_columns"):
            issues.append({
                "type": "warning",
                "message": "Multi-column layout may cause parsing issues in Workday"
            })
        
        # Check for images
        if metadata.get("has_images"):
            issues.append({
                "type": "warning",
                "message": "Images detected - text may not be extractable"
            })
        
        return issues
    
    @staticmethod
    def _calculate_score(sections: dict, issues: list) -> float:
        base_score = 100.0
        
        # Deduct for missing sections
        for section, data in sections.items():
            if not data.get("parsed"):
                base_score -= 15
        
        # Deduct for issues
        base_score -= len(issues) * 5
        
        return max(0, min(100, base_score))
    
    @staticmethod
    def _calculate_confidence(sections: dict) -> Dict[str, float]:
        return {
            section: data.get("confidence", 0.0)
            for section, data in sections.items()
        }

# Similar parsers for other ATS systems
class GreenhouseParser(WorkdayParser):
    """Simulates Greenhouse ATS parsing behavior"""
    pass

class LeverParser(WorkdayParser):
    """Simulates Lever ATS parsing behavior"""
    pass

@app.get("/")
async def root():
    return {
        "service": "ATSInfra Parser Service",
        "version": "0.1.0",
        "status": "operational"
    }

@app.post("/parse", response_model=ParseResult)
async def parse_resume(file: UploadFile = File(...)):
    """Parse resume and extract structured data"""
    
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        
        # Extract text and metadata
        if file.filename.endswith('.pdf'):
            text, metadata = extract_pdf_content(content)
        else:
            text, metadata = extract_docx_content(content)
        
        # Parse with primary parser
        parser_result = WorkdayParser.parse(text, metadata)
        
        return ParseResult(
            success=True,
            parser="pymupdf",
            sections=parser_result["sections"],
            raw_text=text[:1000],  # Truncate for response
            metadata=metadata,
            confidence_scores=parser_result["confidence"],
            issues=parser_result["issues"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")

@app.post("/simulate")
async def simulate_ats(
    file: UploadFile = File(...),
    ats: str = "workday"
):
    """Simulate how specific ATS systems parse the resume"""
    
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        
        # Extract text and metadata
        if file.filename.endswith('.pdf'):
            text, metadata = extract_pdf_content(content)
        else:
            text, metadata = extract_docx_content(content)
        
        # Select parser based on ATS
        parsers = {
            "workday": WorkdayParser,
            "greenhouse": GreenhouseParser,
            "lever": LeverParser,
        }
        
        parser_class = parsers.get(ats.lower(), WorkdayParser)
        result = parser_class.parse(text, metadata)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/simulate-all")
async def simulate_all_ats(file: UploadFile = File(...)):
    """Simulate parsing across all major ATS systems"""
    
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        
        # Extract text and metadata
        if file.filename.endswith('.pdf'):
            text, metadata = extract_pdf_content(content)
        else:
            text, metadata = extract_docx_content(content)
        
        # Run all parsers
        results = []
        parsers = {
            "workday": WorkdayParser,
            "greenhouse": GreenhouseParser,
            "lever": LeverParser,
        }
        
        for ats_name, parser_class in parsers.items():
            result = parser_class.parse(text, metadata)
            results.append(result)
        
        return {
            "results": results,
            "overall_score": sum(r["parse_score"] for r in results) / len(results)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

def extract_pdf_content(content: bytes) -> tuple[str, dict]:
    """Extract text and metadata from PDF"""
    
    # Use PyMuPDF for text extraction
    doc = fitz.open(stream=content, filetype="pdf")
    text = ""
    metadata = {
        "pages": len(doc),
        "has_images": False,
        "has_multiple_columns": False,
        "created": datetime.now().isoformat()
    }
    
    for page in doc:
        text += page.get_text()
        
        # Check for images
        if page.get_images():
            metadata["has_images"] = True
    
    doc.close()
    
    # Use pdfplumber for layout analysis
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        if pdf.pages:
            page = pdf.pages[0]
            # Simple heuristic for multi-column detection
            if page.width > 500:  # Typical letter size
                metadata["has_multiple_columns"] = True
    
    return text, metadata

def extract_docx_content(content: bytes) -> tuple[str, dict]:
    """Extract text and metadata from DOCX"""
    from docx import Document
    
    doc = Document(io.BytesIO(content))
    text = "\n".join([para.text for para in doc.paragraphs])
    
    metadata = {
        "paragraphs": len(doc.paragraphs),
        "has_images": len(doc.inline_shapes) > 0,
        "has_multiple_columns": False,
        "created": datetime.now().isoformat()
    }
    
    return text, metadata

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
