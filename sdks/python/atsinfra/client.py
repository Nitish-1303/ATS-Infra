"""ATSInfra Python Client"""

import os
from typing import Optional, Dict, Any, List
import requests
from pathlib import Path

from .models import ParseResult, SimulationResult, SemanticMatch


class ATSInfra:
    """ATSInfra API Client"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: int = 30
    ):
        """
        Initialize ATSInfra client
        
        Args:
            api_key: API key for authentication (optional for self-hosted)
            base_url: Base URL of ATSInfra API
            timeout: Request timeout in seconds
        """
        self.api_key = api_key or os.getenv("ATSINFRA_API_KEY")
        self.base_url = base_url or os.getenv("ATSINFRA_API_URL", "http://localhost:4000/api/v1")
        self.timeout = timeout
        
        self.session = requests.Session()
        if self.api_key:
            self.session.headers.update({"Authorization": f"Bearer {self.api_key}"})
    
    def parse(self, file_path: str) -> ParseResult:
        """
        Parse resume and extract structured data
        
        Args:
            file_path: Path to resume file (PDF or DOCX)
            
        Returns:
            ParseResult object with extracted data
        """
        if not Path(file_path).exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        with open(file_path, "rb") as f:
            files = {"file": (Path(file_path).name, f)}
            response = self.session.post(
                f"{self.base_url}/parse",
                files=files,
                timeout=self.timeout
            )
            response.raise_for_status()
            
        return ParseResult(**response.json())
    
    def simulate(
        self,
        file_path: str,
        ats: str = "workday",
        all_systems: bool = False
    ) -> SimulationResult:
        """
        Simulate ATS parsing behavior
        
        Args:
            file_path: Path to resume file
            ats: ATS system to simulate (workday, greenhouse, lever, etc.)
            all_systems: Simulate all ATS systems
            
        Returns:
            SimulationResult object
        """
        if not Path(file_path).exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        endpoint = "/simulate-all" if all_systems else f"/simulate?ats={ats}"
        
        with open(file_path, "rb") as f:
            files = {"file": (Path(file_path).name, f)}
            response = self.session.post(
                f"{self.base_url}{endpoint}",
                files=files,
                timeout=self.timeout
            )
            response.raise_for_status()
            
        return SimulationResult(**response.json())
    
    def repair(self, file_path: str, output_path: Optional[str] = None) -> str:
        """
        Repair ATS-hostile PDF
        
        Args:
            file_path: Path to PDF file
            output_path: Path for repaired PDF (optional)
            
        Returns:
            Path to repaired PDF
        """
        if not Path(file_path).exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if output_path is None:
            output_path = str(Path(file_path).with_stem(f"{Path(file_path).stem}_repaired"))
        
        with open(file_path, "rb") as f:
            files = {"file": (Path(file_path).name, f)}
            response = self.session.post(
                f"{self.base_url}/repair",
                files=files,
                timeout=self.timeout
            )
            response.raise_for_status()
        
        with open(output_path, "wb") as f:
            f.write(response.content)
        
        return output_path
    
    def semantic_match(
        self,
        resume_path: str,
        job_description: str
    ) -> SemanticMatch:
        """
        Perform semantic matching between resume and job description
        
        Args:
            resume_path: Path to resume file
            job_description: Job description text or file path
            
        Returns:
            SemanticMatch object with match results
        """
        if not Path(resume_path).exists():
            raise FileNotFoundError(f"Resume file not found: {resume_path}")
        
        # Check if job_description is a file path
        if Path(job_description).exists():
            with open(job_description, "r") as f:
                job_description = f.read()
        
        with open(resume_path, "rb") as f:
            files = {"file": (Path(resume_path).name, f)}
            data = {"job_description": job_description}
            
            response = self.session.post(
                f"{self.base_url}/semantic-match",
                files=files,
                data=data,
                timeout=self.timeout
            )
            response.raise_for_status()
            
        return SemanticMatch(**response.json())
    
    def health_check(self) -> Dict[str, Any]:
        """Check API health status"""
        response = self.session.get(f"{self.base_url.rsplit('/api', 1)[0]}/health")
        response.raise_for_status()
        return response.json()
