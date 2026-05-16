# Getting Started with ATSInfra

Welcome! This guide will help you get ATSInfra running locally in under 10 minutes.

## Prerequisites

- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Node.js** 20+ (for local development)
- **Python** 3.11+ (for local development)
- **Git**

## Quick Start (Recommended)

The fastest way to get started is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/atsinfra/atsinfra.git
cd atsinfra

# 2. Start all services
docker-compose up -d

# 3. Wait for services to start (30-60 seconds)
docker-compose ps

# 4. Open your browser
open http://localhost:3000
```

That's it! You now have:
- Frontend at `http://localhost:3000`
- API Gateway at `http://localhost:4000`
- Parser Service at `http://localhost:8001`
- Grafana at `http://localhost:3001`
- MinIO Console at `http://localhost:9001`

## Local Development Setup

For active development, you'll want to run services locally:

### 1. Start Infrastructure Services

```bash
# Start only databases and supporting services
docker-compose up -d postgres redis kafka minio
```

### 2. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3. API Gateway Development

```bash
cd api-gateway
npm install
npm run dev
```

API Gateway will be available at `http://localhost:4000`

### 4. Parser Service Development

```bash
cd services/parser
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Parser Service will be available at `http://localhost:8001`

## Testing the Platform

### Upload a Resume

1. Go to `http://localhost:3000`
2. Drag and drop a PDF resume
3. Watch the ATS simulation run
4. Explore the visual debugger
5. Try semantic job matching

### Use the CLI

```bash
# Install CLI globally
cd cli
npm install -g .

# Parse a resume
atsinfra parse path/to/resume.pdf

# Simulate ATS parsing
atsinfra simulate path/to/resume.pdf --all

# Get help
atsinfra --help
```

### Use the Python SDK

```bash
# Install SDK
cd sdks/python
pip install -e .

# Test it
python examples/python_example.py
```

### Use the JavaScript SDK

```bash
# Install SDK
cd sdks/javascript
npm install
npm run build

# Test it
node examples/javascript_example.js
```

## Project Structure

```
atsinfra/
├── frontend/           # Next.js web app
├── api-gateway/        # Node.js API gateway
├── services/
│   ├── parser/        # Resume parsing service
│   ├── pdf/           # PDF repair service
│   └── semantic/      # Semantic matching service
├── cli/               # Command-line tool
├── sdks/
│   ├── python/        # Python SDK
│   └── javascript/    # JavaScript SDK
├── k8s/               # Kubernetes manifests
├── scripts/           # Utility scripts
├── monitoring/        # Prometheus & Grafana
└── examples/          # Usage examples
```

## Common Tasks

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f parser-service
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart frontend
```

### Stop Services

```bash
# Stop all
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U atsinfra -d atsinfra

# Run migrations
docker-compose exec postgres psql -U atsinfra -d atsinfra -f /docker-entrypoint-initdb.d/init.sql
```

### Redis Access

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check keys
docker-compose exec redis redis-cli KEYS '*'
```

## Development Workflow

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit code
   - Add tests
   - Update documentation

3. **Test locally**
   ```bash
   # Frontend
   cd frontend && npm test
   
   # Backend
   cd services/parser && pytest
   ```

4. **Commit with clear message**
   ```bash
   git commit -m "feat: add new ATS parser for Ashby"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

**TypeScript/JavaScript:**
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting

**Python:**
- Follow PEP 8
- Use type hints
- Write docstrings
- Format with Black

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd services/parser
pytest

# CLI tests
cd cli
npm test
```

## Troubleshooting

### Services Won't Start

```bash
# Check Docker status
docker ps

# Check logs for errors
docker-compose logs

# Restart Docker
# On Mac: Docker Desktop → Restart
# On Linux: sudo systemctl restart docker
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or :4000, :8001, etc.

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend Build Errors

```bash
# Clear cache
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Python Import Errors

```bash
# Reinstall dependencies
cd services/parser
pip install -r requirements.txt --force-reinstall
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key (optional)

## Next Steps

### For Users
- Upload your resume and explore features
- Try the CLI tool
- Read the [API documentation](docs/API.md)

### For Contributors
- Check [open issues](https://github.com/atsinfra/atsinfra/issues)
- Read [CONTRIBUTING.md](CONTRIBUTING.md)
- Join our [Discord](https://discord.gg/atsinfra)

### For Developers
- Explore the [Architecture](docs/ARCHITECTURE.md)
- Read the [API docs](docs/API.md)
- Check out [examples](examples/)

## Getting Help

- **Documentation**: Check `docs/` folder
- **GitHub Issues**: Report bugs or request features
- **Discord**: Join our community
- **Email**: support@atsinfra.dev

## Resources

- [README.md](README.md) - Main documentation
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [API.md](docs/API.md) - API reference
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide

## Quick Commands Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart <service-name>

# Rebuild service
docker-compose up -d --build <service-name>

# Run tests
make test

# Build all
make build

# Clean up
make clean
```

## Tips for Success

1. **Start with Docker Compose** - Easiest way to get running
2. **Read the logs** - Most issues are visible in logs
3. **Check the docs** - We have comprehensive documentation
4. **Ask for help** - Community is friendly and responsive
5. **Contribute back** - Share your improvements!

## Welcome to ATSInfra! 🚀

We're excited to have you here. Whether you're:
- A job seeker debugging your resume
- A developer exploring the code
- A contributor adding features
- A recruiter understanding ATS systems

You're in the right place. Let's build something amazing together!

---

**Questions?** Open an issue or join our Discord!
