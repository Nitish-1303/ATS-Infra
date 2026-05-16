/**
 * ATSInfra JavaScript/TypeScript SDK
 * Infrastructure-grade ATS Resume Debugger
 */

import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export interface ParseResult {
  success: boolean;
  parser: string;
  sections: Record<string, any>;
  raw_text: string;
  metadata: Record<string, any>;
  confidence_scores: Record<string, number>;
  issues: Array<{ type: string; message: string }>;
}

export interface SimulationResult {
  ats_name: string;
  parse_score: number;
  sections: Record<string, any>;
  issues: Array<{ type: string; message: string }>;
  confidence: Record<string, number>;
}

export interface SemanticMatch {
  overall_match: number;
  semantic_score: number;
  literal_score: number;
  matched_skills: Array<{
    skill: string;
    confidence: number;
    found: boolean;
  }>;
  missing_capabilities: string[];
  recommendations: string[];
}

export interface ATSInfraConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export class ATSInfra {
  private client: AxiosInstance;
  private apiKey?: string;
  private baseUrl: string;

  constructor(config: ATSInfraConfig = {}) {
    this.apiKey = config.apiKey || process.env.ATSINFRA_API_KEY;
    this.baseUrl = config.baseUrl || process.env.ATSINFRA_API_URL || 'http://localhost:4000/api/v1';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 30000,
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    });
  }

  /**
   * Parse resume and extract structured data
   */
  async parse(filePath: string): Promise<ParseResult> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await this.client.post<ParseResult>('/parse', formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  /**
   * Simulate ATS parsing behavior
   */
  async simulate(
    filePath: string,
    options: { ats?: string; all?: boolean } = {}
  ): Promise<SimulationResult> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const endpoint = options.all ? '/simulate-all' : `/simulate?ats=${options.ats || 'workday'}`;

    const response = await this.client.post<SimulationResult>(endpoint, formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  /**
   * Repair ATS-hostile PDF
   */
  async repair(filePath: string, outputPath?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await this.client.post('/repair', formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer',
    });

    const output = outputPath || filePath.replace(/\.pdf$/, '_repaired.pdf');
    fs.writeFileSync(output, response.data);

    return output;
  }

  /**
   * Perform semantic matching between resume and job description
   */
  async semanticMatch(resumePath: string, jobDescription: string): Promise<SemanticMatch> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(resumePath));
    
    // Check if jobDescription is a file path
    if (fs.existsSync(jobDescription)) {
      jobDescription = fs.readFileSync(jobDescription, 'utf-8');
    }
    
    formData.append('job_description', jobDescription);

    const response = await this.client.post<SemanticMatch>('/semantic-match', formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  /**
   * Check API health status
   */
  async healthCheck(): Promise<Record<string, any>> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export default ATSInfra;
