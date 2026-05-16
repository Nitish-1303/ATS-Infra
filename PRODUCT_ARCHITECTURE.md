# ATSInfra Product Architecture

## Core Product Thesis

**Hiring systems are black boxes. ATSInfra makes them transparent.**

Candidates don't know:
- Why resumes fail ATS parsing
- What formatting breaks extraction
- Why keywords are ignored
- Why sections disappear
- Why PDFs become unreadable

**ATSInfra exposes and debugs these invisible failures visually.**

---

## Product Positioning

### What ATSInfra IS:
- **BrowserStack for ATS systems** - Test across multiple parsers
- **Chrome DevTools for resumes** - Visual debugging interface
- **Datadog for hiring infrastructure** - Observability and monitoring
- **Cloudflare for ATS compatibility** - Repair and optimization

### What ATSInfra is NOT:
- ❌ Generic AI resume builder
- ❌ Fake ATS score generator
- ❌ Keyword stuffing tool
- ❌ ChatGPT wrapper
- ❌ Enterprise CRM
- ❌ Interview coaching platform

---

## Core User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    1. Upload Resume                          │
│                   (PDF/DOCX/Image)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              2. Extract Document Structure                   │
│        • Text extraction • Layout analysis • OCR             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              3. Simulate ATS Parsing Behavior                │
│    • Workday • Greenhouse • Lever • Taleo • BambooHR        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              4. Visualize Parser Failures                    │
│  • Heatmaps • Overlays • Missing sections • Broken text     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              5. Detect ATS-Breaking Issues                   │
│  • Multi-column • Corrupted unicode • Hidden text • OCR     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              6. Generate Repair Suggestions                  │
│    • Layout fixes • Font repairs • Text extraction          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              7. Repair Resume Automatically                  │
│  • Fix layouts • Embed fonts • Extract images • Normalize   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              8. Export ATS-Safe Version                      │
│        • Repaired PDF • Semantic HTML • JSON schema         │
└─────────────────────────────────────────────────────────────┘
```

---

## Visual Debugging Experience

### The Most Important Feature: **Visual ATS Debugger**

The experience must feel like:
- ✅ Chrome DevTools (familiar, powerful)
- ✅ BrowserStack (cross-platform testing)
- ✅ Datadog (observability, metrics)
- ✅ Sentry (error tracking, debugging)
- ✅ Vercel (deployment observability)

NOT like:
- ❌ Generic AI SaaS dashboards
- ❌ Shallow resume builders
- ❌ Fake score generators

### Visual Components Required

#### 1. **Split-View Debugger**
```
┌──────────────────────┬──────────────────────┐
│   Original PDF       │   ATS Parser View    │
│                      │                      │
│   [Beautiful Resume] │   [Garbled Text]     │
│                      │                      │
│   John Doe           │   J���n D�e          │
│   Software Engineer  │   [PARSE ERROR]      │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

#### 2. **Parsing Heatmap**
```
┌─────────────────────────────────────────────┐
│  Resume Parsing Confidence Heatmap          │
│                                             │
│  ████████████ Contact Info (98%)            │
│  ██████████░░ Summary (85%)                 │
│  ████████████ Experience (92%)              │
│  ███████████░ Education (90%)               │
│  ████████░░░░ Skills (75%)                  │
│                                             │
│  Legend: █ High  ░ Low                      │
└─────────────────────────────────────────────┘
```

#### 3. **Parser Overlay**
```
┌─────────────────────────────────────────────┐
│  [Resume with visual overlays]              │
│                                             │
│  ┌─────────────────┐ ← Parsed correctly    │
│  │ John Doe        │                        │
│  └─────────────────┘                        │
│                                             │
│  ┌─────────────────┐ ← ⚠️ Multi-column     │
│  │ Experience │ Ed │   detected             │
│  └─────────────────┘                        │
│                                             │
│  ┌─────────────────┐ ← ❌ Corrupted text   │
│  │ ���������       │                        │
│  └─────────────────┘                        │
└─────────────────────────────────────────────┘
```

#### 4. **ATS Comparison Panel**
```
┌──────────┬──────────┬──────────┬──────────┐
│ Workday  │Greenhouse│  Lever   │  Taleo   │
│   89%    │   92%    │   85%    │   78%    │
│          │          │          │          │
│ ✓ Contact│ ✓ Contact│ ✓ Contact│ ✓ Contact│
│ ✓ Summary│ ✓ Summary│ ⚠ Summary│ ✗ Summary│
│ ✓ Exp    │ ✓ Exp    │ ✓ Exp    │ ⚠ Exp    │
│ ✓ Edu    │ ✓ Edu    │ ✓ Edu    │ ✓ Edu    │
│ ⚠ Skills │ ✓ Skills │ ⚠ Skills │ ✗ Skills │
└──────────┴──────────┴──────────┴──────────┘
```

#### 5. **JSON Inspector**
```json
{
  "resume_id": "uuid-1234",
  "parsing_confidence": 0.89,
  "ats_compatibility": {
    "workday": 0.89,
    "greenhouse": 0.92,
    "lever": 0.85
  },
  "sections": {
    "contact": {
      "parsed": true,
      "confidence": 0.98,
      "data": {...}
    },
    "experience": {
      "parsed": true,
      "confidence": 0.92,
      "issues": ["multi-column-layout"]
    }
  },
  "issues": [
    {
      "type": "layout",
      "severity": "warning",
      "message": "Multi-column layout detected",
      "location": {"page": 1, "bbox": [100, 200, 400, 600]}
    }
  ]
}
```

#### 6. **Before/After Repair**
```
┌──────────────────────┬──────────────────────┐
│   Before Repair      │   After Repair       │
│                      │                      │
│   ATS Score: 72%     │   ATS Score: 94%     │
│   Issues: 8          │   Issues: 0          │
│                      │                      │
│   ❌ Multi-column    │   ✅ Single column   │
│   ❌ Corrupted fonts │   ✅ Clean fonts     │
│   ❌ Image text      │   ✅ Extracted text  │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
│              (Web • CLI • API • SDKs)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Node.js)                     │
│  • Authentication • Rate Limiting • Load Balancing           │
│  • Request Routing • WebSocket • Caching                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Parser Engine  │  │ ATS Simulator│  │  PDF Repair    │
│   (FastAPI)    │  │  (FastAPI)   │  │   (FastAPI)    │
│                │  │              │  │                │
│ • PyMuPDF      │  │ • Workday    │  │ • OCRmyPDF     │
│ • pdfplumber   │  │ • Greenhouse │  │ • Tesseract    │
│ • Apache Tika  │  │ • Lever      │  │ • Ghostscript  │
│ • Tesseract    │  │ • Taleo      │  │ • Font repair  │
└────────────────┘  └──────────────┘  └─────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   PostgreSQL   │  │    Redis    │  │      Kafka      │
│  + pgvector    │  │   (Cache)   │  │   (Events)      │
└────────────────┘  └─────────────┘  └─────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
│  Prometheus • Grafana • OpenTelemetry • Jaeger              │
└─────────────────────────────────────────────────────────────┘
```

### Parsing Pipeline

```
Upload
  ↓
File Validation (size, type, malware)
  ↓
PDF Extraction (PyMuPDF, pdfplumber)
  ↓
OCR Fallback (Tesseract, if needed)
  ↓
Layout Analysis (detect columns, tables, sections)
  ↓
Section Reconstruction (identify contact, experience, etc.)
  ↓
ATS Simulation (run multiple parsers)
  ↓
Failure Detection (find parsing issues)
  ↓
Repair Engine (fix detected issues)
  ↓
JSON Normalization (structured output)
  ↓
Export (PDF, HTML, JSON)
```

---

## ATS Simulation Engine

### Simulated ATS Systems

1. **Workday**
   - Multi-column handling: Poor
   - Unicode support: Good
   - Table parsing: Fair
   - Image text: No

2. **Greenhouse**
   - Multi-column handling: Good
   - Unicode support: Excellent
   - Table parsing: Good
   - Image text: No

3. **Lever**
   - Multi-column handling: Fair
   - Unicode support: Good
   - Table parsing: Fair
   - Image text: No

4. **Taleo**
   - Multi-column handling: Poor
   - Unicode support: Fair
   - Table parsing: Poor
   - Image text: No

5. **BambooHR**
   - Multi-column handling: Fair
   - Unicode support: Good
   - Table parsing: Good
   - Image text: No

6. **Ashby**
   - Multi-column handling: Good
   - Unicode support: Excellent
   - Table parsing: Excellent
   - Image text: Limited

### Detection Capabilities

The engine detects:
- ✅ Multi-column layout failures
- ✅ Corrupted unicode characters
- ✅ Broken glyph rendering
- ✅ Inaccessible text layers
- ✅ Image-only resumes
- ✅ Table parsing failures
- ✅ ATS-hostile formatting
- ✅ Hidden text manipulation
- ✅ Font embedding issues
- ✅ Malformed PDF structure

### Output Metrics

For each ATS system:
```json
{
  "ats_name": "Workday",
  "compatibility_score": 0.89,
  "parser_confidence": 0.92,
  "sections_detected": ["contact", "experience", "education"],
  "sections_failed": ["skills"],
  "issues": [
    {
      "type": "layout",
      "severity": "warning",
      "message": "Multi-column layout may cause parsing issues",
      "affected_sections": ["experience"]
    }
  ],
  "recommendations": [
    "Convert to single-column layout",
    "Simplify table structures"
  ]
}
```

---

## PDF Repair Engine

### Repair Capabilities

The engine automatically fixes:

1. **Layout Issues**
   - Multi-column → Single column
   - Complex tables → Simple lists
   - Overlapping text → Separated text

2. **Font Issues**
   - Missing fonts → Embedded fonts
   - Corrupted glyphs → Clean characters
   - Custom fonts → Standard fonts

3. **Text Extraction**
   - Image text → OCR extraction
   - Scanned PDFs → Searchable PDFs
   - Hidden text → Visible text

4. **Structure Issues**
   - Malformed PDF → Valid PDF
   - Broken metadata → Clean metadata
   - Inaccessible → Accessible (PDF/A)

### Repair Algorithm

```python
def repair_resume(pdf_path):
    # 1. Analyze PDF structure
    issues = analyze_pdf(pdf_path)
    
    # 2. Extract text with fallbacks
    text = extract_text_with_ocr(pdf_path)
    
    # 3. Detect layout
    layout = detect_layout(pdf_path)
    
    # 4. Reconstruct sections
    sections = reconstruct_sections(text, layout)
    
    # 5. Generate clean PDF
    clean_pdf = generate_ats_safe_pdf(sections)
    
    # 6. Validate repair
    validation = validate_repair(clean_pdf)
    
    return {
        "repaired_pdf": clean_pdf,
        "issues_fixed": issues,
        "validation": validation
    }
```

---

## API Specifications

### Core Endpoints

#### 1. Parse Resume
```
POST /api/v1/parse
Content-Type: multipart/form-data

Request:
- file: PDF/DOCX file

Response:
{
  "resume_id": "uuid",
  "sections": {...},
  "metadata": {...},
  "confidence": 0.92
}
```

#### 2. Simulate ATS
```
POST /api/v1/simulate
Content-Type: multipart/form-data

Request:
- file: PDF/DOCX file
- ats: "workday" | "greenhouse" | "all"

Response:
{
  "results": [
    {
      "ats_name": "Workday",
      "score": 0.89,
      "issues": [...]
    }
  ]
}
```

#### 3. Repair PDF
```
POST /api/v1/repair
Content-Type: multipart/form-data

Request:
- file: PDF file

Response:
- Content-Type: application/pdf
- Binary PDF data
```

#### 4. Extract JSON
```
POST /api/v1/extract
Content-Type: multipart/form-data

Request:
- file: PDF/DOCX file

Response:
{
  "contact": {...},
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

#### 5. Analyze PDF
```
POST /api/v1/analyze-pdf
Content-Type: multipart/form-data

Request:
- file: PDF file

Response:
{
  "structure": {...},
  "issues": [...],
  "recommendations": [...]
}
```

---

## Database Schema

### Core Tables

```sql
-- Resumes
CREATE TABLE resumes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    filename VARCHAR(255),
    file_size INTEGER,
    file_hash VARCHAR(64),
    uploaded_at TIMESTAMP,
    processed_at TIMESTAMP
);

-- Parse Results
CREATE TABLE parse_results (
    id UUID PRIMARY KEY,
    resume_id UUID REFERENCES resumes(id),
    parser_version VARCHAR(50),
    sections JSONB,
    metadata JSONB,
    confidence FLOAT,
    created_at TIMESTAMP
);

-- ATS Simulations
CREATE TABLE ats_simulations (
    id UUID PRIMARY KEY,
    resume_id UUID REFERENCES resumes(id),
    ats_name VARCHAR(50),
    compatibility_score FLOAT,
    issues JSONB,
    recommendations JSONB,
    created_at TIMESTAMP
);

-- PDF Repairs
CREATE TABLE pdf_repairs (
    id UUID PRIMARY KEY,
    resume_id UUID REFERENCES resumes(id),
    original_hash VARCHAR(64),
    repaired_hash VARCHAR(64),
    issues_fixed JSONB,
    created_at TIMESTAMP
);

-- Resume Embeddings (pgvector)
CREATE TABLE resume_embeddings (
    id UUID PRIMARY KEY,
    resume_id UUID REFERENCES resumes(id),
    section VARCHAR(50),
    content TEXT,
    embedding vector(384),
    created_at TIMESTAMP
);

CREATE INDEX ON resume_embeddings USING ivfflat (embedding vector_cosine_ops);
```

---

## Monitoring & Observability

### Metrics to Track

1. **Performance Metrics**
   - Parse time (p50, p95, p99)
   - Repair time
   - API response time
   - Queue depth

2. **Quality Metrics**
   - Parser confidence scores
   - ATS compatibility scores
   - Repair success rate
   - False positive rate

3. **Business Metrics**
   - Resumes processed
   - Active users
   - API calls
   - Error rate

### Dashboards

1. **System Health Dashboard**
   - Service uptime
   - Error rates
   - Response times
   - Queue depths

2. **Parsing Quality Dashboard**
   - Average confidence scores
   - ATS compatibility trends
   - Common issues detected
   - Repair success rates

3. **User Analytics Dashboard**
   - Daily active users
   - Resumes processed
   - Popular ATS systems
   - Geographic distribution

---

## Open-Source Strategy

### Repository Structure

```
atsinfra/
├── README.md (viral-optimized)
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── LICENSE (AGPL v3)
├── docker-compose.yml
├── apps/
│   ├── dashboard/
│   ├── docs/
│   └── api-gateway/
├── services/
│   ├── parser-engine/
│   ├── ats-simulator/
│   ├── pdf-repair/
│   └── semantic-engine/
├── packages/
│   ├── ui/
│   ├── sdk-js/
│   ├── sdk-python/
│   └── shared-types/
└── infrastructure/
    ├── docker/
    ├── kubernetes/
    └── monitoring/
```

### GitHub Optimization

**README must instantly communicate:**
> "This exposes how ATS systems actually parse resumes."

**Visual assets required:**
- Demo GIF (parsing visualization)
- Architecture diagram
- Before/after screenshots
- Heatmap examples
- Parser comparison

**Key messaging:**
- "BrowserStack for ATS systems"
- "Chrome DevTools for resumes"
- "Infrastructure-grade observability"
- "Open-source transparency"

---

## Success Metrics

### Week 1
- 500+ GitHub stars
- Front page of Hacker News
- 10+ contributors

### Month 1
- 2,000+ GitHub stars
- 50+ contributors
- Featured in tech newsletters

### Month 3
- 5,000+ GitHub stars
- 100+ contributors
- Industry adoption

---

**This is the infrastructure layer for ATS observability and resume debugging.**
