"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ATSSimulatorProps {
  file: File;
  onAnalysis: (data: any) => void;
}

const ATS_SYSTEMS = [
  { id: "workday", name: "Workday", color: "blue" },
  { id: "greenhouse", name: "Greenhouse", color: "green" },
  { id: "lever", name: "Lever", color: "purple" },
  { id: "bamboohr", name: "BambooHR", color: "orange" },
  { id: "taleo", name: "Oracle Taleo", color: "red" },
  { id: "ashby", name: "Ashby", color: "indigo" },
];

export default function ATSSimulator({ file, onAnalysis }: ATSSimulatorProps) {
  const [analyzing, setAnalyzing] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    simulateAnalysis();
  }, [file]);

  const simulateAnalysis = async () => {
    setAnalyzing(true);
    setProgress(0);

    // Simulate progressive analysis
    for (let i = 0; i < ATS_SYSTEMS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const score = Math.floor(Math.random() * 30) + 70;
      const issues = Math.floor(Math.random() * 5);
      
      setResults((prev) => [
        ...prev,
        {
          ...ATS_SYSTEMS[i],
          score,
          issues,
          status: score >= 85 ? "success" : score >= 70 ? "warning" : "error",
        },
      ]);
      
      setProgress(((i + 1) / ATS_SYSTEMS.length) * 100);
    }

    setAnalyzing(false);
    
    // Mock analysis data
    onAnalysis({
      overall_score: 82,
      parsers: results,
      sections: {
        contact: { parsed: true, confidence: 0.98 },
        experience: { parsed: true, confidence: 0.92 },
        education: { parsed: true, confidence: 0.95 },
        skills: { parsed: true, confidence: 0.88 },
      },
      issues: [
        { type: "warning", message: "Multi-column layout detected in experience section" },
        { type: "info", message: "Some ATS systems may struggle with custom fonts" },
      ],
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">ATS Parser Simulation</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Simulating how different ATS systems parse your resume
        </p>
      </div>

      {/* Progress Bar */}
      {analyzing && (
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">Analyzing...</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ATS_SYSTEMS.map((system, index) => {
          const result = results.find((r) => r.id === system.id);
          
          return (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{system.name}</h3>
                {result ? (
                  getStatusIcon(result.status)
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                )}
              </div>

              {result ? (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Parse Score</span>
                      <span className="font-bold">{result.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          result.status === "success"
                            ? "bg-green-600"
                            : result.status === "warning"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {result.issues} issue{result.issues !== 1 ? "s" : ""} detected
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
