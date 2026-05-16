# ATSInfra

<div align="center">

![ATSInfra Logo](https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=ATSInfra)

**Your resume looks perfect. Here's how ATS systems actually see it.**

Infrastructure-grade ATS Resume Debugger + PDF Repair Platform

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/atsinfra/atsinfra?style=social)](https://github.com/atsinfra/atsinfra)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://hub.docker.com/r/atsinfra/atsinfra)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Demo](https://atsinfra.dev) • [Documentation](docs/) • [Discord](https://discord.gg/atsinfra) • [Twitter](https://twitter.com/atsinfra)

</div>

---

## 🎯 The Problem

Your resume looks perfect in PDF viewers. But ATS systems see this:

```
J���hn D�e
S�ft��re E�g�n��r
[PARSING ERROR: Multi-column layout detected]
[PARSING ERROR: Unreadable font encoding]
[PARSING ERROR: Image-based text]
```

**Result:** Your resume never reaches human recruiters.

## 💡 The Solution

ATSInfra is like **BrowserStack for ATS systems** — see exactly how Workday, Greenhouse, Lever, and other platforms parse your resume.

## 🚀 Demo

![ATSInfra Demo](https://via.placeholder.com/1200x600/1E293B/FFFFFF?text=Interactive+Demo+GIF)

*Upload your resume → See ATS parsing in real-time → Fix issues → Export ATS-safe PDF*

## ✨ What Makes This Different?

**Not another AI resume builder.** This is infrastructure for ATS debugging.

| Traditional Resume Tools | ATSInfra |
|-------------------------|----------|
| ❌ Fake "95% ATS score" | ✅ Real parser simulation |
| ❌ Generic templates | ✅ Visual debugging interface |
| ❌ Black box analysis | ✅ Open-source transparency |
| ❌ Shallow tips | ✅ Technical deep-dive |
| ❌ SaaS lock-in | ✅ Self-hostable |

## 🎨 Features

### 1. **ATS Parser Simulation**
Simulate parsing behavior from 6+ major ATS platforms:
- Workday, Greenhouse, Lever, BambooHR, Taleo, Ashby

See side-by-side comparisons of how each system interprets your resume.

### 2. **Visual Debugger**
Chrome DevTools-style interface showing:
- Parsing confidence heatmaps
- Section-by-section analysis
- Text extraction visualization
- Issue highlighting

### 3. **PDF Repair Engine**
Automatically fix ATS-hostile resumes:
- Multi-column → Single column
- Image PDFs → Text-based PDFs
- Corrupted fonts → Clean typography
- Canva/Figma exports → ATS-safe PDFs

### 4. **Semantic Job Matching**
AI-powered analysis using embeddings:
- Skill matching with confidence scores
- Missing capability detection
- Contextual understanding (e.g., "managed projects" = "project leadership")
- Actionable recommendations

### 5. **Developer APIs**
Production-ready APIs and SDKs:
- REST + GraphQL APIs
- Python, JavaScript, Go SDKs
- CLI tools
- Self-hosted deployment

## Core Features

### 🔍 ATS Parser Simulation
Simulate parsing behavior from major ATS platforms:
- Workday, Greenhouse, Lever, BambooHR
- Taleo, Ashby, SAP SuccessFactors, iCIMS

### 🛠️ PDF Repair Engine
Automatically fix ATS-hostile resumes:
- Multi-column layouts → Single column
- Image-based PDFs → Text-based PDFs
- Corrupted fonts → Clean typography
- Canva/Figma exports → ATS-safe PDFs

### 🎯 Semantic Job Matching
AI-powered semantic analysis:
- Vector similarity matching
- Contextual skill understanding
- Missing capability detection
- Recruiter readability scoring

### 📊 Interactive Debugger
Visual debugging interface:
- Parsing heatmaps
- Section hierarchy visualization
- Text extraction confidence scores
- Side-by-side parser comparison

### 🚀 Developer APIs
Production-ready APIs and SDKs:
- REST + GraphQL APIs
- Python, JavaScript, Go SDKs
- CLI tools
- Self-hosted deployment

## Quick Start

### Using Docker

```bash
git clone https://github.com/atsinfra/atsinfra.git
cd atsinfra
docker-compose up
```

Visit `http://localhost:3000`

### Using CLI

```bash
npm install -g @atsinfra/cli

# Parse resume
atsinfra parse resume.pdf

# Simulate ATS parsing
atsinfra simulate resume.pdf

# Repair PDF
atsinfra repair resume.pdf -o fixed.pdf

# Semantic matching
atsinfra semantic-match resume.pdf job-description.txt
```

## How to Use

### 1. Web Interface (Easiest)

**Step 1: Start the Platform**
```bash
docker-compose up -d
```

**Step 2: Open Your Browser**
Navigate to `http://localhost:3000`

**Step 3: Upload Your Resume**
- Drag and drop your PDF or DOCX resume
- Or click to browse and select your file
- Supports files up to 10MB

**Step 4: View ATS Analysis**
The platform automatically:
- Parses your resume across 6+ ATS systems
- Shows confidence scores for each section
- Highlights parsing issues
- Displays side-by-side comparisons

**Step 5: Get Semantic Matching (Optional)**
- Paste a job description
- Click "Analyze Match"
- See skill matching, missing capabilities, and recommendations

**Step 6: Repair Your Resume (If Needed)**
- Click "Repair PDF" if issues are detected
- Download the ATS-safe version
- Use it for your job applications

### 2. Command Line Interface

**Installation**
```bash
npm install -g @atsinfra/cli
```

**Basic Commands**

**Parse a Resume**
```bash
# Basic parsing
atsinfra parse resume.pdf

# Save output to JSON
atsinfra parse resume.pdf --output result.json
```

**Simulate ATS Systems**
```bash
# Simulate specific ATS
atsinfra simulate resume.pdf --ats workday
atsinfra simulate resume.pdf --ats greenhouse

# Simulate all ATS systems
atsinfra simulate resume.pdf --all
```

**Repair PDF**
```bash
# Repair and save
atsinfra repair resume.pdf --output resume_fixed.pdf

# Quick repair (overwrites original)
atsinfra repair resume.pdf
```

**Semantic Job Matching**
```bash
# Match against job description file
atsinfra semantic-match resume.pdf job_description.txt

# Match against inline text
atsinfra semantic-match resume.pdf "Looking for Senior Engineer with Python..."
```

**Complete Workflow**
```bash
# Parse, simulate, and repair in one go
atsinfra parse resume.pdf --output analysis.json && \
atsinfra simulate resume.pdf --all && \
atsinfra repair resume.pdf --output resume_ats_safe.pdf
```

### 3. Python SDK

**Installation**
```bash
pip install atsinfra
```

**Basic Usage**

```python
from atsinfra import ATSInfra

# Initialize client
client = ATSInfra(
    api_key="your_api_key",  # Optional for self-hosted
    base_url="http://localhost:4000/api/v1"
)

# Parse resume
result = client.parse("resume.pdf")
print(f"Success: {result.success}")
print(f"Sections: {result.sections}")

# Check for issues
if result.issues:
    for issue in result.issues:
        print(f"[{issue['type']}] {issue['message']}")
```

**ATS Simulation**

```python
# Simulate specific ATS
simulation = client.simulate("resume.pdf", ats="workday")
print(f"Parse Score: {simulation.parse_score}%")

# Simulate all ATS systems
all_sims = client.simulate("resume.pdf", all_systems=True)
for sim in all_sims['results']:
    print(f"{sim['ats_name']}: {sim['parse_score']}%")
```

**PDF Repair**

```python
# Repair PDF
repaired_path = client.repair(
    "resume.pdf",
    output_path="resume_repaired.pdf"
)
print(f"Repaired PDF saved to: {repaired_path}")
```

**Semantic Matching**

```python
# Match against job description
job_desc = """
We're looking for a Senior Software Engineer with:
- 5+ years Python experience
- AWS and Kubernetes expertise
- Strong communication skills
"""

match = client.semantic_match("resume.pdf", job_desc)
print(f"Overall Match: {match.overall_match}%")
print(f"Semantic Score: {match.semantic_score}%")

# View matched skills
for skill in match.matched_skills:
    status = "✓" if skill.found else "✗"
    print(f"{status} {skill.skill} ({skill.confidence*100:.0f}%)")

# Get recommendations
for rec in match.recommendations:
    print(f"• {rec}")
```

### 4. JavaScript/TypeScript SDK

**Installation**
```bash
npm install @atsinfra/sdk
```

**Basic Usage**

```javascript
const { ATSInfra } = require('@atsinfra/sdk');

// Initialize client
const client = new ATSInfra({
  apiKey: 'your_api_key',  // Optional for self-hosted
  baseUrl: 'http://localhost:4000/api/v1'
});

// Parse resume
const result = await client.parse('resume.pdf');
console.log(`Success: ${result.success}`);
console.log('Sections:', result.sections);

// Check for issues
if (result.issues.length > 0) {
  result.issues.forEach(issue => {
    console.log(`[${issue.type}] ${issue.message}`);
  });
}
```

**ATS Simulation**

```javascript
// Simulate specific ATS
const simulation = await client.simulate('resume.pdf', { ats: 'greenhouse' });
console.log(`Parse Score: ${simulation.parse_score}%`);

// Simulate all ATS systems
const allSims = await client.simulate('resume.pdf', { all: true });
allSims.results.forEach(sim => {
  console.log(`${sim.ats_name}: ${sim.parse_score}%`);
});
```

**PDF Repair**

```javascript
// Repair PDF
const repairedPath = await client.repair('resume.pdf', 'resume_repaired.pdf');
console.log(`Repaired PDF saved to: ${repairedPath}`);
```

**Semantic Matching**

```javascript
const jobDesc = `
We're looking for a Senior Software Engineer with:
- 5+ years Python experience
- AWS and Kubernetes expertise
`;

const match = await client.semanticMatch('resume.pdf', jobDesc);
console.log(`Overall Match: ${match.overall_match}%`);

// View matched skills
match.matched_skills.forEach(skill => {
  const status = skill.found ? '✓' : '✗';
  console.log(`${status} ${skill.skill} (${skill.confidence * 100}%)`);
});
```

### 5. REST API

**Authentication**
```bash
# Using API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:4000/api/v1/parse
```

**Parse Resume**
```bash
curl -X POST http://localhost:4000/api/v1/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf"
```

**Simulate ATS**
```bash
# Specific ATS
curl -X POST "http://localhost:4000/api/v1/simulate?ats=workday" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf"

# All ATS systems
curl -X POST http://localhost:4000/api/v1/simulate-all \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf"
```

**Repair PDF**
```bash
curl -X POST http://localhost:4000/api/v1/repair \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf" \
  --output repaired.pdf
```

**Semantic Match**
```bash
curl -X POST http://localhost:4000/api/v1/semantic-match \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@resume.pdf" \
  -F "job_description=Looking for Senior Engineer..."
```

### Common Use Cases

**Use Case 1: Debug Why Your Resume Isn't Getting Responses**
```bash
# 1. Upload and analyze
atsinfra simulate resume.pdf --all

# 2. Check which ATS systems struggle
# Look for low scores (<80%)

# 3. Repair issues
atsinfra repair resume.pdf -o resume_fixed.pdf

# 4. Re-test
atsinfra simulate resume_fixed.pdf --all
```

**Use Case 2: Optimize Resume for Specific Job**
```python
from atsinfra import ATSInfra

client = ATSInfra()

# 1. Get job description
job_desc = open("job_posting.txt").read()

# 2. Analyze match
match = client.semantic_match("resume.pdf", job_desc)

# 3. Review missing capabilities
print("Missing:", match.missing_capabilities)

# 4. Follow recommendations
for rec in match.recommendations:
    print(f"TODO: {rec}")
```

**Use Case 3: Batch Process Multiple Resumes**
```bash
#!/bin/bash
for resume in resumes/*.pdf; do
  echo "Processing $resume..."
  atsinfra parse "$resume" --output "results/$(basename $resume .pdf).json"
  atsinfra repair "$resume" -o "fixed/$(basename $resume)"
done
```

**Use Case 4: Integrate into Your Application**
```javascript
const { ATSInfra } = require('@atsinfra/sdk');
const client = new ATSInfra();

// In your upload handler
app.post('/upload-resume', async (req, res) => {
  const file = req.file;
  
  // Parse resume
  const result = await client.parse(file.path);
  
  // Check ATS compatibility
  const simulation = await client.simulate(file.path, { all: true });
  
  // Return analysis
  res.json({
    parsed: result,
    ats_scores: simulation.results,
    overall_score: simulation.overall_score
  });
});
```

### Troubleshooting

**Issue: Services won't start**
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

**Issue: API returns 401 Unauthorized**
```bash
# For self-hosted, API key is optional
# Remove Authorization header or set in .env
```

**Issue: Parsing fails**
```bash
# Check file format
file resume.pdf

# Ensure file is valid PDF/DOCX
# Try repairing first
atsinfra repair resume.pdf -o fixed.pdf
```

**Issue: Low confidence scores**
- Resume may have complex layouts
- Try the repair function
- Use single-column format
- Avoid images and graphics
- Use standard fonts

### Getting Help

- **Documentation**: Full docs at `docs/`
- **Examples**: See `examples/` directory
- **API Reference**: `docs/API.md`
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community for support

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  Interactive Debugger • Visual Diff • Heatmaps          │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                  API Gateway (Node.js)                   │
│         REST • GraphQL • WebSocket • Rate Limiting       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Parser Service │  │ PDF Service │  │ Semantic Engine │
│   (FastAPI)    │  │  (FastAPI)  │  │   (FastAPI)     │
│                │  │             │  │                 │
│ • PyMuPDF      │  │ • OCRmyPDF  │  │ • Transformers  │
│ • pdfplumber   │  │ • Tesseract │  │ • spaCy         │
│ • Apache Tika  │  │ • Ghostscript│ │ • pgvector      │
└────────────────┘  └─────────────┘  └─────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   PostgreSQL   │  │    Redis    │  │      Kafka      │
│  (Structured)  │  │   (Cache)   │  │   (Events)      │
└────────────────┘  └─────────────┘  └─────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: FastAPI, Node.js, Python microservices
- **PDF Processing**: PyMuPDF, pdfplumber, Apache Tika, OCRmyPDF, Tesseract
- **AI/NLP**: SentenceTransformers, spaCy, pgvector
- **Infrastructure**: PostgreSQL, Redis, Kafka, Docker, Kubernetes
- **Monitoring**: OpenTelemetry, Grafana, Prometheus

## Use Cases

### For Job Seekers
- Debug why your resume isn't getting responses
- Fix ATS-breaking formatting issues
- Optimize for specific job descriptions
- Export ATS-safe versions

### For Developers
- Build resume parsing into your app
- Integrate ATS simulation APIs
- Self-host for privacy
- Extend with custom parsers

### For Recruiters
- Understand parsing failures
- Debug candidate resume issues
- Improve ATS data quality
- Analyze parsing accuracy

## API Examples

### Python SDK

```python
from atsinfra import ATSInfra

client = ATSInfra(api_key="your_key")

# Parse resume
result = client.parse("resume.pdf")
print(result.sections)

# Simulate ATS
simulation = client.simulate("resume.pdf", ats="workday")
print(simulation.confidence_score)

# Repair PDF
repaired = client.repair("resume.pdf")
repaired.save("fixed.pdf")

# Semantic match
match = client.semantic_match("resume.pdf", "job_description.txt")
print(f"Match score: {match.score}")
```

### JavaScript SDK

```javascript
import { ATSInfra } from '@atsinfra/sdk';

const client = new ATSInfra({ apiKey: 'your_key' });

// Parse resume
const result = await client.parse('resume.pdf');
console.log(result.sections);

// Simulate ATS
const simulation = await client.simulate('resume.pdf', { ats: 'greenhouse' });
console.log(simulation.confidenceScore);
```

### REST API

```bash
# Upload and parse
curl -X POST https://api.atsinfra.dev/v1/parse \
  -H "Authorization: Bearer YOUR_KEY" \
  -F "file=@resume.pdf"

# Simulate ATS
curl -X POST https://api.atsinfra.dev/v1/simulate \
  -H "Authorization: Bearer YOUR_KEY" \
  -F "file=@resume.pdf" \
  -F "ats=workday"
```

## Self-Hosting

### Docker Compose

```bash
docker-compose up -d
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/atsinfra
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
S3_BUCKET=atsinfra-uploads
OPENAI_API_KEY=sk-...
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone repo
git clone https://github.com/atsinfra/atsinfra.git
cd atsinfra

# Install dependencies
npm install
pip install -r requirements.txt

# Start services
docker-compose up -d postgres redis kafka

# Run frontend
cd frontend
npm run dev

# Run backend
cd backend
uvicorn main:app --reload
```

## Roadmap

- [x] Core parsing engine
- [x] ATS simulation
- [x] PDF repair
- [x] Semantic matching
- [ ] Multi-language support
- [ ] Resume builder integration
- [ ] Browser extension
- [ ] Mobile app
- [ ] Enterprise SSO
- [ ] Custom parser plugins

## License

AGPL v3 - See [LICENSE](LICENSE) for details.

## Community

- [Discord](https://discord.gg/atsinfra)
- [GitHub Discussions](https://github.com/atsinfra/atsinfra/discussions)
- [Twitter](https://twitter.com/atsinfra)

## 📚 Documentation

- **[Getting Started](GETTING_STARTED.md)** - Complete setup guide
- **[Quick Start](QUICKSTART.md)** - 5-minute setup
- **[Architecture](docs/ARCHITECTURE.md)** - System design deep-dive
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Docker, K8s, AWS, GCP, Azure
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Launch Strategy](VIRAL_POSITIONING.md)** - Marketing & positioning
- **[Launch Checklist](LAUNCH_CHECKLIST.md)** - Pre-launch tasks

## 🎯 Project Status

- ✅ Core parsing engine
- ✅ ATS simulation (6+ systems)
- ✅ Visual debugger
- ✅ PDF repair engine
- ✅ Semantic matching
- ✅ CLI tool
- ✅ Python SDK
- ✅ JavaScript SDK
- ✅ Docker deployment
- ✅ Kubernetes manifests
- 🚧 Browser extension (planned)
- 🚧 Mobile app (planned)
- 🚧 Additional ATS parsers (ongoing)

## 🌟 Why ATSInfra?

### The Problem
73% of resumes never reach human recruiters due to ATS parsing failures. Job seekers spend hours perfecting resumes that ATS systems can't read.

### The Solution
ATSInfra shows you exactly what ATS systems see, detects issues, and repairs them automatically.

### The Difference
- **Not another AI resume builder** - We're infrastructure for ATS debugging
- **Not fake scores** - Real parser simulation from actual ATS systems
- **Not a black box** - Open-source, transparent, self-hostable
- **Not just for job seekers** - Built for developers, by developers

## 🚀 Built With

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion  
**Backend:** FastAPI, Node.js, Python microservices  
**PDF Processing:** PyMuPDF, pdfplumber, Apache Tika, OCRmyPDF, Tesseract  
**AI/NLP:** SentenceTransformers, spaCy, pgvector  
**Infrastructure:** PostgreSQL, Redis, Kafka, Docker, Kubernetes  
**Monitoring:** OpenTelemetry, Grafana, Prometheus

## 📊 Metrics

We're tracking:
- GitHub stars (help us reach 1,000!)
- Active users
- API calls
- Community contributions
- ATS parsers supported

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Good First Issues:**
- Add new ATS parser
- Improve UI/UX
- Write documentation
- Add tests
- Fix bugs

**Ways to Contribute:**
- 🌟 Star the repo
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve docs
- 🔧 Submit PRs
- 💬 Join discussions

## 📣 Spread the Word

If ATSInfra helped you, please:
- ⭐ Star the repo
- 🐦 Tweet about it
- 📝 Write a blog post
- 💬 Tell your friends
- 🎥 Make a video

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=atsinfra/atsinfra&type=Date)](https://star-history.com/#atsinfra/atsinfra&Date)

## 🙏 Acknowledgments

Built with inspiration from:
- **BrowserStack** - Cross-browser testing
- **Chrome DevTools** - Developer debugging
- **Vercel** - Developer experience
- **Linear** - Beautiful UI
- **Stripe** - API design

Special thanks to the open-source community for making this possible.

## 📜 License

AGPL v3 - See [LICENSE](LICENSE) for details.

This ensures the project stays open-source while allowing commercial use with proper attribution.

## 🔗 Links

- **Website:** https://atsinfra.dev
- **GitHub:** https://github.com/atsinfra/atsinfra
- **Discord:** https://discord.gg/atsinfra
- **Twitter:** https://twitter.com/atsinfra
- **Documentation:** https://docs.atsinfra.dev

---

<div align="center">

**Built with ❤️ by the open-source community**

*Your resume deserves to be seen. Let's make it happen.*

[⭐ Star on GitHub](https://github.com/atsinfra/atsinfra) • [🚀 Get Started](GETTING_STARTED.md) • [💬 Join Discord](https://discord.gg/atsinfra)

</div>
