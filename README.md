# ATSInfra
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-pink?logo=github)](https://github.com/sponsors/Nitish-1303)
[![Buy Me A Chai](https://buymeachai.ezee.li/assets/images/buymeachai-button.png)](https://buymeachai.ezee.li/yelurunitish)
<div align="center">
# ATSInfra

[English](#) | [Español](#) | [Português (Brasil)](#) | [한국어](#) | [日本語](#) | [Русский](#) | [简体中文](#) | [繁體中文](#)

![ATSInfra — Open-Source ATS Resume Debugger](https://github.com/Nitish-1303/ATS-Infra/raw/main/docs/hero-banner.jpg)

*I watched great engineers get ghosted. Their resumes looked perfect.*  
*The ATS system saw something completely different.*  
**So I built the tool that shows exactly what breaks — and fixes it.**  
*Now it's open source.*

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)](https://hub.docker.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)](#)

[Live Demo](#) • [Documentation](#) • [Discord](#)

---

![ATSInfra Demo](https://github.com/Nitish-1303/ATS-Infra/raw/main/docs/demo.gif)

**6 ATS parsers simulated · PDF repair in seconds · Zero fake "ATS scores"**

[![Discord](https://img.shields.io/badge/Join_the_community-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](#)

---

## What Is This

Most resumes look correct to humans but fail silently inside ATS systems. Hiring managers never see them. Candidates never know why.

ATSInfra is an open-source infrastructure layer that exposes what actually breaks:

- **Simulates** how real ATS parsers (Workday, Greenhouse, Lever, Taleo, BambooHR, Ashby) interpret your resume
- **Visualizes** parsing failures with a DevTools-style debugger — heatmaps, confidence overlays, broken section detection
- **Repairs** ATS-hostile PDFs automatically — multi-column layouts, corrupted unicode, image-only layers, Canva/Figma exports
- **Exports** clean, ATS-safe PDFs instantly

> **This is NOT an "ATS score" tool.** ATSInfra shows *what actually breaks* — not a meaningless percentage. Real parsers, real extraction, real failures.

Upload a resume → see how each ATS reads it → repair what breaks → export a clean PDF.

---

## Features

| Feature | Description |
|---|---|
| **ATS Parser Simulation** | Side-by-side comparison across Workday, Greenhouse, Lever, BambooHR, Taleo, Ashby |
| **Visual Debugger** | DevTools-style inspection: parsing heatmaps, confidence overlays, section hierarchy, extracted text viewer |
| **PDF Repair Engine** | Auto-fixes multi-column layouts, corrupted unicode, hidden text layers, broken font embedding, Canva/Figma exports |
| **Resume Extraction Pipeline** | Full text extraction with section mapping, skill detection, and parser risk diagnostics |
| **REST API** | Production-ready endpoints for parse, simulate, and repair — integrate into any workflow |
| **CLI Tooling** | `atsinfra parse`, `atsinfra simulate`, `atsinfra repair` — runs locally, no upload required |
| **JavaScript + Python SDKs** | Drop-in libraries for both ecosystems |
| **Self-Hosted** | Docker Compose or Kubernetes — your data never leaves your machine |

---

## Quick Start

### Docker

```bash
git clone https://github.com/Nitish-1303/ATS-Infra.git
cd ATS-Infra
docker compose up
```

Open: [http://localhost:3000](http://localhost:3000)

### CLI

```bash
# Install
npm install -g @atsinfra/cli

# Parse a resume
atsinfra parse resume.pdf

# Simulate how Workday reads it
atsinfra simulate resume.pdf --ats workday

# Repair and export a clean PDF
atsinfra repair resume.pdf -o fixed.pdf
```

---

## How It Works

```
You upload a resume (PDF)
        │
        ▼
┌──────────────────────┐
│   PDF Parser         │  Extracts text, fonts, layout, text layer
│   + OCR Fallback     │  Tesseract for image-only resumes
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│   ATS Simulation     │  Runs parser logic for each ATS system
│   Layer              │  Workday / Greenhouse / Lever / Taleo / Ashby
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
Debugger      Repair Engine
(heatmap)     (fixes layout,
              unicode, layers)
    │             │
    └──────┬──────┘
           ▼
    ATS-Safe PDF Export
```

### What ATSInfra Detects

**Broken** (before repair):
```
J���hn D�e
S�ft��re E�g�n��r

[PARSING ERROR]
- Multi-column layout detected
- Corrupted unicode characters
- Hidden/inaccessible text layer
- Image-only section (no extractable text)
```

**Clean** (after repair):
```
John Doe
Software Engineer

✓ Clean text extraction
✓ ATS-safe single-column structure
✓ Semantic section recovery
✓ Font embedding fixed
```

---

## API

### Parse a Resume

```bash
curl -X POST http://localhost:4000/api/v1/parse \
  -F "file=@resume.pdf"
```

### Simulate ATS Parsing

```bash
curl -X POST http://localhost:4000/api/v1/simulate \
  -F "file=@resume.pdf" \
  -F "ats=workday"
```

### Repair a Broken PDF

```bash
curl -X POST http://localhost:4000/api/v1/repair \
  -F "file=@resume.pdf"
```

---

## Architecture

```
Frontend (Next.js 15)
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

## Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | FastAPI, Node.js, Python microservices |
| **PDF + OCR** | PyMuPDF, pdfplumber, Apache Tika, OCRmyPDF, Tesseract |
| **AI + NLP** | SentenceTransformers, spaCy, pgvector |
| **Infrastructure** | PostgreSQL, Redis, Kafka, Docker, Kubernetes |

---

## Project Structure

```
atsinfra/
├── apps/
│   ├── dashboard          # Next.js visual debugger
│   ├── docs               # Documentation site
│   └── api-gateway        # Node.js gateway
│
├── services/
│   ├── parser-engine      # PDF parsing + text extraction
│   ├── ats-simulator      # Per-ATS parsing logic
│   ├── pdf-repair         # Repair heuristics engine
│   └── semantic-engine    # NLP + skill detection
│
├── packages/
│   ├── sdk-js             # JavaScript SDK
│   ├── sdk-python         # Python SDK
│   ├── ui                 # Shared UI components
│   └── shared-types       # TypeScript types
│
└── infrastructure/        # Docker + Kubernetes configs
```

---

## Roadmap

### Core Platform
- [x] ATS parser simulation (6 parsers)
- [x] Visual parsing debugger
- [x] PDF repair engine
- [x] Resume extraction pipeline
- [x] CLI tooling

### Next
- [ ] Additional ATS parsers (Workable, iCIMS, SmartRecruiters)
- [ ] Browser extension for inline resume checking
- [ ] Resume diffing (before vs after repair)
- [ ] Parsing regression testing suite
- [ ] Resume observability dashboard

---

## Self Hosting

### Docker Compose

```bash
docker compose up -d
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

---

## Contributing

We welcome contributions. Areas where you can help:

- ATS parser improvements and new parser integrations
- PDF repair heuristics
- UI/UX improvements to the visual debugger
- OCR optimization
- Documentation
- SDKs and client libraries
- Testing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Philosophy

ATSInfra exists to make hiring infrastructure transparent.

We believe:

- Candidates deserve to understand why their resume fails parsing
- ATS systems should be observable, not black boxes
- Resume infrastructure should be open source
- Parsing failures are an engineering problem, not a candidate problem

---

## Disclaimer

**ATSInfra is a local, open-source tool — NOT a hosted service.** By using this software, you acknowledge:

1. **You control your data.** Your resume and personal information stay on your machine. We do not collect, store, or have access to any of your data.
2. **No guarantees.** Parser simulations are approximations of real ATS behavior. Real ATS systems are proprietary and may behave differently. The authors are not liable for hiring outcomes.
3. **AI outputs require review.** Repair suggestions are automated — always review the output before submitting to employers.

See [LICENSE](LICENSE) for full details. Software provided under AGPL v3 "as is", without warranty.

---

## Contributors

[![contrib.rocks](https://contrib.rocks/image?repo=Nitish-1303/ATS-Infra)](https://github.com/Nitish-1303/ATS-Infra/graphs/contributors)

Fixed a parsing bug? Improved a repair heuristic? [Open a PR](https://github.com/Nitish-1303/ATS-Infra/pulls) — contributions are what make this useful.

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Nitish-1303/ATS-Infra&type=timeline)](https://star-history.com/#Nitish-1303/ATS-Infra&timeline)

---

## License

Code is licensed under [AGPL v3](LICENSE). The "ATSInfra" name is reserved — see [CONTRIBUTING.md](CONTRIBUTING.md) for usage terms.

---

## Let's Connect

[![GitHub](https://img.shields.io/badge/GitHub-Nitish--1303-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nitish-1303)

Built for developers, recruiters, and job seekers who believe the hiring process should be transparent.

If ATSInfra helps you: ⭐ Star the repo · 🐛 Report issues · 🔧 Contribute improvements
