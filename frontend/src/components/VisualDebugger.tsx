"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Code, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Layers,
  FileText,
  Zap
} from "lucide-react";

interface VisualDebuggerProps {
  resumeData: any;
}

export default function VisualDebugger({ resumeData }: VisualDebuggerProps) {
  const [activeView, setActiveView] = useState<"visual" | "json" | "heatmap">("visual");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections = [
    { id: "contact", label: "Contact Info", confidence: 0.98, issues: 0 },
    { id: "summary", label: "Summary", confidence: 0.85, issues: 1 },
    { id: "experience", label: "Experience", confidence: 0.92, issues: 0 },
    { id: "education", label: "Education", confidence: 0.95, issues: 0 },
    { id: "skills", label: "Skills", confidence: 0.88, issues: 2 },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return "Excellent";
    if (confidence >= 0.7) return "Good";
    return "Poor";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              Visual ATS Debugger
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              See exactly how ATS systems parse your resume
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("visual")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === "visual"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Visual
            </button>
            <button
              onClick={() => setActiveView("heatmap")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === "heatmap"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Heatmap
            </button>
            <button
              onClick={() => setActiveView("json")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === "json"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeView === "visual" && (
            <motion.div
              key="visual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSection(section.id)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedSection === section.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(section.confidence)}`} />
                      <h3 className="font-semibold text-lg">{section.label}</h3>
                      {section.issues > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded">
                          {section.issues} issue{section.issues !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Confidence</p>
                        <p className="font-bold text-lg">{(section.confidence * 100).toFixed(0)}%</p>
                      </div>
                      {section.confidence >= 0.9 ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : section.confidence >= 0.7 ? (
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-3">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${section.confidence * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full ${getConfidenceColor(section.confidence)}`}
                      />
                    </div>
                  </div>

                  {/* Section Preview */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded p-4 font-mono text-sm">
                    <p className="text-slate-600 dark:text-slate-400">
                      {section.id === "contact" && "John Doe • john@example.com • (555) 123-4567"}
                      {section.id === "summary" && "Experienced software engineer with 5+ years..."}
                      {section.id === "experience" && "Senior Software Engineer at Tech Corp (2020-2024)"}
                      {section.id === "education" && "BS Computer Science, University (2016-2020)"}
                      {section.id === "skills" && "Python, JavaScript, React, Node.js, AWS, Docker"}
                    </p>
                  </div>

                  {/* Issues */}
                  {section.issues > 0 && selectedSection === section.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"
                    >
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Some ATS systems may have difficulty parsing this section
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeView === "heatmap" && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-8">
                <h3 className="text-lg font-semibold mb-4">Parsing Confidence Heatmap</h3>
                
                {/* Heatmap Grid */}
                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: 100 }).map((_, i) => {
                    const confidence = Math.random();
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`aspect-square rounded ${
                          confidence >= 0.9
                            ? "bg-green-500"
                            : confidence >= 0.7
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ opacity: confidence }}
                      />
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span className="text-sm">High Confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded" />
                    <span className="text-sm">Medium Confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded" />
                    <span className="text-sm">Low Confidence</span>
                  </div>
                </div>
              </div>

              {/* ATS Comparison */}
              <div className="grid md:grid-cols-3 gap-4">
                {["Workday", "Greenhouse", "Lever"].map((ats, index) => (
                  <motion.div
                    key={ats}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <h4 className="font-semibold mb-4">{ats}</h4>
                    <div className="space-y-2">
                      {sections.map((section) => (
                        <div key={section.id} className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={getConfidenceColor(section.confidence)}
                              style={{ width: `${section.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium min-w-[40px] text-right">
                            {(section.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === "json" && (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 rounded-lg p-6 overflow-auto max-h-[600px]"
            >
              <pre className="text-green-400 font-mono text-sm">
                {JSON.stringify(
                  {
                    resume_id: "uuid-1234-5678",
                    parsed_at: new Date().toISOString(),
                    overall_confidence: 0.92,
                    sections: {
                      contact: {
                        name: "John Doe",
                        email: "john@example.com",
                        phone: "(555) 123-4567",
                        confidence: 0.98,
                      },
                      experience: [
                        {
                          title: "Senior Software Engineer",
                          company: "Tech Corp",
                          duration: "2020-2024",
                          confidence: 0.92,
                        },
                      ],
                      education: [
                        {
                          degree: "BS Computer Science",
                          institution: "University",
                          year: "2020",
                          confidence: 0.95,
                        },
                      ],
                      skills: [
                        "Python",
                        "JavaScript",
                        "React",
                        "Node.js",
                        "AWS",
                        "Docker",
                      ],
                    },
                    ats_compatibility: {
                      workday: 0.89,
                      greenhouse: 0.93,
                      lever: 0.87,
                    },
                    issues: [
                      {
                        type: "warning",
                        section: "summary",
                        message: "Multi-column layout detected",
                      },
                    ],
                  },
                  null,
                  2
                )}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
