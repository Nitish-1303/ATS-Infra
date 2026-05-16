# ATSInfra Quick Start Guide

Get ATSInfra running in 5 minutes.

## Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/atsinfra/atsinfra.git
cd atsinfra

# Start services
docker-compose up -d

# Visit http://localhost:3000
```

That's it! The platform is now running.

## Option 2: CLI

```bash
# Install CLI
npm install -g @atsinfra/cli

# Parse resume
atsinfra parse resume.pdf

# Simulate ATS
atsinfra simulate resume.pdf --all

# Repair PDF
atsinfra repair resume.pdf -o fixed.pdf
```

## Option 3: Python SDK

```bash
pip install atsinfra
```

```python
from atsinfra import ATSInfra

client = ATSInfra()
result = client.parse("resume.pdf")
print(result.sections)
```

## Option 4: JavaScript SDK

```bash
npm install @atsinfra/sdk
```

```javascript
const { ATSInfra } = require('@atsinfra/sdk');

const client = new ATSInfra();
const result = await client.parse('resume.pdf');
console.log(result.sections);
```

## Next Steps

- Read the [Architecture Guide](docs/ARCHITECTURE.md)
- Check the [API Documentation](docs/API.md)
- See [Deployment Guide](docs/DEPLOYMENT.md)
- Join our [Discord](https://discord.gg/atsinfra)
