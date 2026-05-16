import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import axios from 'axios';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Redis client
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.connect().catch(console.error);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Service URLs
const PARSER_SERVICE = process.env.PARSER_SERVICE_URL || 'http://localhost:8001';
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8002';
const SEMANTIC_SERVICE = process.env.SEMANTIC_SERVICE_URL || 'http://localhost:8003';

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'ATSInfra API Gateway',
    version: '0.1.0',
    status: 'operational',
    endpoints: {
      parse: 'POST /api/v1/parse',
      simulate: 'POST /api/v1/simulate',
      repair: 'POST /api/v1/repair',
      semantic: 'POST /api/v1/semantic-match'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      parser: 'operational',
      pdf: 'operational',
      semantic: 'operational'
    }
  });
});

// Parse resume
app.post('/api/v1/parse', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check cache
    const cacheKey = `parse:${req.file.originalname}:${req.file.size}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Forward to parser service
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    const response = await axios.post(`${PARSER_SERVICE}/parse`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Cache result
    await redis.setEx(cacheKey, 3600, JSON.stringify(response.data));

    res.json(response.data);
  } catch (error: any) {
    console.error('Parse error:', error);
    res.status(500).json({
      error: 'Failed to parse resume',
      message: error.message
    });
  }
});

// Simulate ATS parsing
app.post('/api/v1/simulate', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ats = req.body.ats || 'workday';

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    const response = await axios.post(
      `${PARSER_SERVICE}/simulate?ats=${ats}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Simulate error:', error);
    res.status(500).json({
      error: 'Failed to simulate ATS parsing',
      message: error.message
    });
  }
});

// Repair PDF
app.post('/api/v1/repair', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    const response = await axios.post(`${PDF_SERVICE}/repair`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="repaired_${req.file.originalname}"`);
    res.send(Buffer.from(response.data));
  } catch (error: any) {
    console.error('Repair error:', error);
    res.status(500).json({
      error: 'Failed to repair PDF',
      message: error.message
    });
  }
});

// Semantic matching
app.post('/api/v1/semantic-match', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobDescription = req.body.job_description;
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);
    formData.append('job_description', jobDescription);

    const response = await axios.post(`${SEMANTIC_SERVICE}/match`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Semantic match error:', error);
    res.status(500).json({
      error: 'Failed to perform semantic matching',
      message: error.message
    });
  }
});

// Metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('# ATSInfra Metrics\n');
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ATSInfra API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});
