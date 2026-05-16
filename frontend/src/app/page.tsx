"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertCircle, CheckCircle, Zap, Github, Star } from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import ATSSimulator from "@/components/ATSSimulator";
import ParserComparison from "@/components/ParserComparison";
import SemanticMatcher from "@/components/SemanticMatcher";
import VisualDebugger from "@/components/VisualDebugger";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* GitHub Star Button */}
          <motion.a
            href="https://github.com/atsinfra/atsinfra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full mb-6 hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-4 h-4" />
            <span className="text-sm font-medium">Star on GitHub</span>
            <Star className="w-4 h-4 fill-current" />
          </motion.a>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Open Source • Self-Hosted • Developer-First
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent leading-tight">
            Your Resume Looks Perfect.
            <br />
            Here's How ATS Actually Sees It.
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Infrastructure-grade ATS debugger. Simulate parsing from Workday, Greenhouse, Lever.
            Detect formatting issues. Repair broken PDFs. Export ATS-safe resumes.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Multi-Parser Simulation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Visual Debugger</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">PDF Repair Engine</span>
            </div>
          </div>
        </motion.div>

        {/* Main Demo Section */}
        <div className="max-w-7xl mx-auto">
          {!uploadedFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResumeUploader onUpload={setUploadedFile} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* File Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{uploadedFile.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    Upload Different File
                  </button>
                </div>
              </div>

              {/* ATS Simulator */}
              <ATSSimulator file={uploadedFile} onAnalysis={setAnalysisData} />

              {/* Visual Debugger */}
              {analysisData && (
                <>
                  <VisualDebugger resumeData={analysisData} />
                  <ParserComparison data={analysisData} />
                  <BeforeAfterComparison beforeData={analysisData} afterData={analysisData} />
                  <SemanticMatcher resumeData={analysisData} />
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">ATS Parser Simulation</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Simulate how Workday, Greenhouse, Lever, and other ATS platforms parse your resume.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">PDF Repair Engine</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Automatically fix Canva/Figma exports, multi-column layouts, and corrupted PDFs.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Semantic Matching</h3>
            <p className="text-slate-600 dark:text-slate-400">
              AI-powered job matching using embeddings and contextual skill understanding.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
