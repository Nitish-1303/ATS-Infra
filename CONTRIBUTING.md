# Contributing to ATSInfra

Thank you for your interest in contributing to ATSInfra! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional. We're building tools to help people, not to gatekeep.

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/atsinfra/atsinfra.git
cd atsinfra
```

2. **Start infrastructure services**
```bash
docker-compose up -d postgres redis kafka minio
```

3. **Frontend development**
```bash
cd frontend
npm install
npm run dev
```

4. **Backend services**
```bash
cd services/parser
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

5. **API Gateway**
```bash
cd api-gateway
npm install
npm run dev
```

## Project Structure

```
atsinfra/
├── frontend/           # Next.js frontend
├── api-gateway/        # Node.js API gateway
├── services/
│   ├── parser/        # Resume parsing service
│   ├── pdf/           # PDF repair service
│   └── semantic/      # Semantic matching service
├── cli/               # Command-line interface
├── sdks/
│   ├── python/        # Python SDK
│   ├── javascript/    # JavaScript/TypeScript SDK
│   └── go/            # Go SDK
├── k8s/               # Kubernetes manifests
├── scripts/           # Utility scripts
└── monitoring/        # Prometheus & Grafana configs
```

## How to Contribute

### Reporting Bugs

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, versions, etc.)
- Screenshots if applicable

### Suggesting Features

Open an issue with:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Examples of similar features elsewhere

### Pull Requests

1. **Fork the repository**

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test your changes**
```bash
# Frontend
cd frontend && npm test

# Backend
cd services/parser && pytest

# CLI
cd cli && npm test
```

5. **Commit with clear messages**
```bash
git commit -m "feat: add workday parser simulation"
git commit -m "fix: resolve multi-column detection issue"
git commit -m "docs: update API documentation"
```

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `chore:` Maintenance

6. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

Then open a pull request on GitHub.

### PR Guidelines

- Keep PRs focused and atomic
- Write clear PR descriptions
- Link related issues
- Ensure CI passes
- Request reviews from maintainers
- Be responsive to feedback

## Development Guidelines

### Code Style

**TypeScript/JavaScript:**
- Use TypeScript for type safety
- Follow ESLint configuration
- Use async/await over promises
- Prefer functional patterns

**Python:**
- Follow PEP 8
- Use type hints
- Write docstrings
- Use Black for formatting

### Testing

- Write unit tests for new features
- Maintain test coverage above 80%
- Test edge cases and error handling
- Use meaningful test names

### Documentation

- Update README for user-facing changes
- Add JSDoc/docstrings for functions
- Update API documentation
- Include code examples

### Performance

- Profile before optimizing
- Cache expensive operations
- Use async operations
- Monitor resource usage

### Security

- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Follow OWASP guidelines

## Adding New ATS Parsers

To add support for a new ATS system:

1. **Create parser class** in `services/parser/main.py`:
```python
class NewATSParser(WorkdayParser):
    """Simulates NewATS parsing behavior"""
    
    @staticmethod
    def parse(text: str, metadata: dict) -> Dict[str, Any]:
        # Implement parsing logic
        pass
```

2. **Register parser** in the parsers dictionary

3. **Add tests** for the new parser

4. **Update documentation**

## Adding New Features

1. **Discuss first** - Open an issue to discuss major features
2. **Design** - Document the design and get feedback
3. **Implement** - Build the feature incrementally
4. **Test** - Write comprehensive tests
5. **Document** - Update all relevant documentation
6. **Submit PR** - Follow PR guidelines

## Release Process

Maintainers handle releases:

1. Update version numbers
2. Update CHANGELOG
3. Create release tag
4. Build and publish packages
5. Deploy to production

## Community

- **GitHub Discussions**: Ask questions, share ideas
- **Discord**: Real-time chat with contributors
- **Twitter**: Follow [@atsinfra](https://twitter.com/atsinfra)

## License

By contributing, you agree that your contributions will be licensed under the AGPL v3 license.

## Questions?

Open an issue or reach out on Discord. We're here to help!

---

Thank you for contributing to ATSInfra! 🚀
