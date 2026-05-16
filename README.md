# ATSInfra

<div align="center">

# Your resume looks perfect.
# Here's how ATS systems actually see it.

Open-source ATS debugger and PDF repair infrastructure.

Upload a resume → detect parsing failures → repair ATS issues → export ATS-safe PDFs.

<br/>

![License](https://img.shields.io/badge/license-AGPL%20v3-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

[Live Demo](https://atsinfra.dev) • [Documentation](./docs) • [Discord](https://discord.gg/atsinfra)

</div>

---

## Why ATSInfra Exists

Most resumes look correct to humans but fail inside ATS systems.

ATSInfra exposes:
- broken parsing
- corrupted text
- unreadable layouts
- multi-column failures
- image-based PDF issues
- ATS compatibility problems

Instead of fake “ATS scores,” ATSInfra shows what actually breaks.

---

## Demo

![ATSInfra Demo](./assets/demo.gif)

### Upload Resume → Debug Parsing → Repair PDF

ATSInfra visualizes:
- extracted ATS text
- parsing confidence
- broken sections
- corrupted characters
- missing skills
- repair suggestions

---

# Features

## ATS Parser Simulation

Simulate how major ATS systems interpret resumes.

Supported parsers:
- Workday
- Greenhouse
- Lever
- BambooHR
- Taleo
- Ashby

See side-by-side parser differences and extraction quality.

---

## Visual ATS Debugger

DevTools-style resume inspection.

Features:
- parsing heatmaps
- confidence overlays
- section hierarchy analysis
- extracted text viewer
- parser risk diagnostics

---

## PDF Repair Engine

Automatically repair ATS-hostile resumes.

Fix:
- multi-column layouts
- inaccessible text layers
- image-only resumes
- corrupted unicode
- broken font embedding
- Canva/Figma export issues

Export ATS-safe PDFs instantly.

---

## Developer APIs

Production-ready APIs and SDKs.

Includes:
- REST API
- CLI tooling
- JavaScript SDK
- Python SDK
- self-hosted deployment

---

# Quick Start

## Docker

```bash
git clone https://github.com/atsinfra/atsinfra.git

cd atsinfra

docker compose up
```

Open:

```text
http://localhost:3000
```

---

## CLI

Install:

```bash
npm install -g @atsinfra/cli
```

Parse a resume:

```bash
atsinfra parse resume.pdf
```

Simulate ATS parsing:

```bash
atsinfra simulate resume.pdf
```

Repair a broken PDF:

```bash
atsinfra repair resume.pdf -o fixed.pdf
```

---

# Example Output

## Broken ATS Parsing

```text
J���hn D�e
S�ft��re E�g�n��r

[PARSING ERROR]
- Multi-column layout detected
- Corrupted unicode
- Hidden text layer
```

---

## ATS Repair Result

```text
John Doe
Software Engineer

✓ Clean text extraction
✓ ATS-safe structure
✓ Semantic section recovery
```

---

# Architecture

```text
Frontend (Next.js)
        ↓
API Gateway (Node.js)
        ↓
Parser Engine (FastAPI)
        ↓
ATS Simulation Layer
        ↓
PDF Repair Engine
        ↓
PostgreSQL + Redis
```

---

# Tech Stack

## Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend
- FastAPI
- Node.js
- Python microservices

## PDF + OCR
- PyMuPDF
- pdfplumber
- Apache Tika
- OCRmyPDF
- Tesseract

## AI + NLP
- SentenceTransformers
- spaCy
- pgvector

## Infrastructure
- PostgreSQL
- Redis
- Kafka
- Docker
- Kubernetes

---

# API Example

## Parse Resume

```bash
curl -X POST http://localhost:4000/api/v1/parse \
  -F "file=@resume.pdf"
```

---

## Simulate ATS

```bash
curl -X POST http://localhost:4000/api/v1/simulate \
  -F "file=@resume.pdf" \
  -F "ats=workday"
```

---

# Monorepo Structure

```text
atsinfra/
├── apps/
│   ├── dashboard
│   ├── docs
│   └── api-gateway
│
├── services/
│   ├── parser-engine
│   ├── ats-simulator
│   ├── pdf-repair
│   └── semantic-engine
│
├── packages/
│   ├── sdk-js
│   ├── sdk-python
│   ├── ui
│   └── shared-types
│
└── infrastructure/
```

---

# Roadmap

## Core Platform
- [x] ATS parser simulation
- [x] Visual parsing debugger
- [x] PDF repair engine
- [x] Resume extraction pipeline
- [x] CLI tooling

## Next
- [ ] Additional ATS parsers
- [ ] Browser extension
- [ ] Resume diffing
- [ ] Parsing regression testing
- [ ] Resume observability dashboard

---

# Self Hosting

## Docker Compose

```bash
docker compose up -d
```

## Kubernetes

```bash
kubectl apply -f infrastructure/kubernetes
```

---

# Contributing

We welcome contributions.

Areas to contribute:
- ATS parser improvements
- PDF repair heuristics
- UI/UX improvements
- OCR optimization
- documentation
- SDKs
- testing

See:
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

# Philosophy

ATSInfra exists to make hiring infrastructure transparent.

We believe:
- candidates should understand parser failures
- ATS systems should be observable
- resume infrastructure should be open
- parsing should not be a black box

---

# License

AGPL v3

---

<div align="center">

Built for developers, recruiters, and job seekers.

If ATSInfra helps you:
⭐ Star the repo
🐛 Report issues
🔧 Contribute improvements

</div>
