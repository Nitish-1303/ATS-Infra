# ATSInfra Architecture

## Overview

ATSInfra is built as a microservices architecture with clear separation of concerns, enabling scalability, maintainability, and independent deployment of components.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   Web Client   │  │     CLI     │  │      SDKs       │
│   (Next.js)    │  │  (Node.js)  │  │  (Py/JS/Go)     │
└────────────────┘  └─────────────┘  └─────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Node.js)                    │
│  • Authentication • Rate Limiting • Request Routing          │
│  • Caching • Load Balancing • WebSocket Support             │
└─────────────────────────────────────────────────────────────┘
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

## Components

### Frontend (Next.js 15)

**Responsibilities:**
- User interface for resume upload and analysis
- Real-time visualization of ATS parsing results
- Interactive debugging interface
- Responsive design with dark mode support

**Key Features:**
- Server-side rendering for SEO
- Client-side state management with Zustand
- Real-time updates via WebSocket
- Framer Motion animations

**Tech Stack:**
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion

### API Gateway (Node.js)

**Responsibilities:**
- Single entry point for all client requests
- Authentication and authorization
- Rate limiting and throttling
- Request routing to microservices
- Response caching
- WebSocket management

**Key Features:**
- JWT-based authentication
- Redis-backed rate limiting
- Service discovery
- Circuit breaker pattern
- Request/response logging
- Metrics collection

**Tech Stack:**
- Express.js
- Redis for caching
- JWT for auth
- Prometheus client

### Parser Service (FastAPI)

**Responsibilities:**
- Resume text extraction
- ATS parser simulation
- Section detection and classification
- Confidence scoring
- Issue detection

**Parsers Implemented:**
- Workday
- Greenhouse
- Lever
- BambooHR
- Taleo
- Ashby
- SAP SuccessFactors
- iCIMS

**Tech Stack:**
- FastAPI
- PyMuPDF (text extraction)
- pdfplumber (layout analysis)
- Apache Tika (format detection)
- spaCy (NLP)

### PDF Service (FastAPI)

**Responsibilities:**
- PDF structural analysis
- ATS-hostile PDF detection
- PDF repair and optimization
- Format conversion
- OCR for image-based PDFs

**Repair Capabilities:**
- Multi-column to single-column conversion
- Font embedding and normalization
- Image-to-text conversion via OCR
- Metadata cleanup
- Accessibility improvements

**Tech Stack:**
- FastAPI
- OCRmyPDF
- Tesseract OCR
- Ghostscript
- PyMuPDF

### Semantic Service (FastAPI)

**Responsibilities:**
- Resume embedding generation
- Job description analysis
- Semantic similarity matching
- Skill extraction and matching
- Recommendation generation

**Features:**
- Vector similarity search
- Contextual understanding
- Skill graph matching
- Missing capability detection

**Tech Stack:**
- FastAPI
- SentenceTransformers
- spaCy
- pgvector
- scikit-learn

### Database Layer

**PostgreSQL:**
- User accounts and authentication
- Resume metadata
- Parse results
- ATS simulations
- Semantic matches
- Analytics events

**pgvector Extension:**
- Resume embeddings
- Job description embeddings
- Vector similarity search

**Redis:**
- Session management
- Response caching
- Rate limiting counters
- Real-time data

**Kafka:**
- Event streaming
- Async job processing
- Service communication
- Analytics pipeline

## Data Flow

### Resume Upload Flow

```
1. User uploads resume → Frontend
2. Frontend → API Gateway (with auth)
3. API Gateway → Parser Service
4. Parser Service:
   - Extracts text
   - Detects sections
   - Calculates confidence
   - Stores in PostgreSQL
5. Parser Service → API Gateway
6. API Gateway → Frontend (with results)
```

### ATS Simulation Flow

```
1. User requests simulation → Frontend
2. Frontend → API Gateway
3. API Gateway → Parser Service
4. Parser Service:
   - Loads resume data
   - Runs ATS-specific parsers
   - Detects issues
   - Calculates scores
5. Parser Service → API Gateway
6. API Gateway → Frontend (with simulation results)
```

### Semantic Matching Flow

```
1. User provides job description → Frontend
2. Frontend → API Gateway
3. API Gateway → Semantic Service
4. Semantic Service:
   - Generates resume embedding
   - Generates JD embedding
   - Calculates similarity
   - Extracts skills
   - Generates recommendations
5. Semantic Service → API Gateway
6. API Gateway → Frontend (with match results)
```

## Scalability

### Horizontal Scaling

- **Frontend**: Multiple Next.js instances behind load balancer
- **API Gateway**: Stateless, scales horizontally
- **Microservices**: Independent scaling based on load
- **Database**: Read replicas for query scaling

### Caching Strategy

- **L1 Cache**: In-memory caching in services
- **L2 Cache**: Redis for shared caching
- **CDN**: Static assets and public pages

### Async Processing

- **Kafka**: Event-driven architecture
- **Background Jobs**: Long-running tasks
- **Webhooks**: Async notifications

## Security

### Authentication

- JWT-based authentication
- API key support for programmatic access
- OAuth2 for third-party integrations

### Authorization

- Role-based access control (RBAC)
- Resource-level permissions
- API rate limiting per user

### Data Protection

- Encryption at rest (database)
- Encryption in transit (TLS)
- Secure file storage (S3)
- PII handling compliance

## Monitoring

### Metrics

- **Application**: Request rate, latency, errors
- **Infrastructure**: CPU, memory, disk, network
- **Business**: Uploads, parses, simulations

### Logging

- Structured JSON logging
- Centralized log aggregation
- Log levels: DEBUG, INFO, WARN, ERROR

### Tracing

- OpenTelemetry instrumentation
- Distributed tracing
- Service dependency mapping

### Alerting

- Prometheus alerts
- Grafana dashboards
- PagerDuty integration

## Deployment

### Development

```bash
docker-compose up
```

### Staging

```bash
kubectl apply -f k8s/ --namespace=staging
```

### Production

```bash
kubectl apply -f k8s/ --namespace=production
```

## Performance

### Targets

- **API Response Time**: < 200ms (p95)
- **Parse Time**: < 5s for typical resume
- **Simulation Time**: < 10s for all ATS systems
- **Uptime**: 99.9%

### Optimization

- Response caching
- Database query optimization
- Connection pooling
- Async processing
- CDN for static assets

## Future Enhancements

- GraphQL API
- Real-time collaboration
- Browser extension
- Mobile apps
- Plugin system
- Custom parser SDK
