# ATSInfra API Documentation

## Base URL

```
Production: https://api.atsinfra.dev/v1
Development: http://localhost:4000/api/v1
```

## Authentication

### API Key (Recommended)

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.atsinfra.dev/v1/parse
```

### JWT Token

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.atsinfra.dev/v1/parse
```

## Endpoints

### Parse Resume

Extract structured data from resume.

**Endpoint:** `POST /parse`

**Request:**
```bash
curl -X POST https://api.atsinfra.dev/v1/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "parser": "pymupdf",
  "sections": {
    "contact": {
      "email": "john@example.com",
      "phone": "555-0123",
      "parsed": true,
      "confidence": 0.95
    },
    "experience": {
      "found": true,
      "parsed": true,
      "confidence": 0.92
    },
    "education": {
      "found": true,
      "parsed": true,
      "confidence": 0.90
    },
    "skills": {
      "found": true,
      "parsed": true,
      "confidence": 0.88
    }
  },
  "raw_text": "John Doe\nSoftware Engineer...",
  "metadata": {
    "pages": 2,
    "has_images": false,
    "has_multiple_columns": false
  },
  "confidence_scores": {
    "contact": 0.95,
    "experience": 0.92,
    "education": 0.90,
    "skills": 0.88
  },
  "issues": [
    {
      "type": "warning",
      "message": "Multi-column layout detected"
    }
  ]
}
```

### Simulate ATS

Simulate how specific ATS systems parse the resume.

**Endpoint:** `POST /simulate`

**Parameters:**
- `ats` (query): ATS system name (workday, greenhouse, lever, etc.)

**Request:**
```bash
curl -X POST "https://api.atsinfra.dev/v1/simulate?ats=workday" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "ats_name": "Workday",
  "parse_score": 85.5,
  "sections": {
    "contact": { "parsed": true, "confidence": 0.98 },
    "experience": { "parsed": true, "confidence": 0.92 },
    "education": { "parsed": true, "confidence": 0.95 },
    "skills": { "parsed": true, "confidence": 0.88 }
  },
  "issues": [
    {
      "type": "warning",
      "message": "Multi-column layout may cause parsing issues"
    }
  ],
  "confidence": {
    "contact": 0.98,
    "experience": 0.92,
    "education": 0.95,
    "skills": 0.88
  }
}
```

### Simulate All ATS

Simulate parsing across all major ATS systems.

**Endpoint:** `POST /simulate-all`

**Request:**
```bash
curl -X POST https://api.atsinfra.dev/v1/simulate-all \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "results": [
    {
      "ats_name": "Workday",
      "parse_score": 85.5,
      "issues": [...]
    },
    {
      "ats_name": "Greenhouse",
      "parse_score": 88.2,
      "issues": [...]
    },
    {
      "ats_name": "Lever",
      "parse_score": 82.7,
      "issues": [...]
    }
  ],
  "overall_score": 85.5
}
```

### Repair PDF

Repair ATS-hostile PDF and return ATS-safe version.

**Endpoint:** `POST /repair`

**Request:**
```bash
curl -X POST https://api.atsinfra.dev/v1/repair \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf" \
  --output repaired.pdf
```

**Response:** Binary PDF file

### Semantic Match

Perform semantic matching between resume and job description.

**Endpoint:** `POST /semantic-match`

**Request:**
```bash
curl -X POST https://api.atsinfra.dev/v1/semantic-match \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf" \
  -F "job_description=We are looking for..."
```

**Response:**
```json
{
  "overall_match": 78,
  "semantic_score": 82,
  "literal_score": 74,
  "matched_skills": [
    {
      "skill": "Python",
      "confidence": 0.95,
      "found": true
    },
    {
      "skill": "AWS",
      "confidence": 0.45,
      "found": false
    }
  ],
  "missing_capabilities": [
    "Cloud infrastructure experience",
    "Kubernetes deployment"
  ],
  "recommendations": [
    "Add specific AWS services you've worked with",
    "Highlight container orchestration experience"
  ]
}
```

### Health Check

Check API health status.

**Endpoint:** `GET /health`

**Request:**
```bash
curl https://api.atsinfra.dev/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "parser": "operational",
    "pdf": "operational",
    "semantic": "operational"
  }
}
```

## Rate Limits

- **Free Tier**: 100 requests per 15 minutes
- **Pro Tier**: 1000 requests per 15 minutes
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid file format",
  "message": "Only PDF and DOCX files are supported"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Webhooks

Subscribe to events via webhooks.

**Events:**
- `parse.completed`
- `simulation.completed`
- `repair.completed`
- `semantic_match.completed`

**Webhook Payload:**
```json
{
  "event": "parse.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "resume_id": "uuid",
    "result": {...}
  }
}
```

## SDKs

### Python

```python
from atsinfra import ATSInfra

client = ATSInfra(api_key="YOUR_API_KEY")
result = client.parse("resume.pdf")
```

### JavaScript

```javascript
import { ATSInfra } from '@atsinfra/sdk';

const client = new ATSInfra({ apiKey: 'YOUR_API_KEY' });
const result = await client.parse('resume.pdf');
```

### CLI

```bash
atsinfra parse resume.pdf
atsinfra simulate resume.pdf --ats workday
atsinfra repair resume.pdf -o fixed.pdf
```

## Support

- **Documentation**: https://docs.atsinfra.dev
- **GitHub**: https://github.com/atsinfra/atsinfra
- **Discord**: https://discord.gg/atsinfra
- **Email**: support@atsinfra.dev
