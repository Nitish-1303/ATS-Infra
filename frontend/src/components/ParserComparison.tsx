"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ParserComparisonProps {
  data: any;
}

export default function ParserComparison({ data }: ParserComparisonProps) {
  const sections = [
    { key: "contact", label: "Contact Information" },
    { key: "experience", label: "Work Experience" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-6">Parser Analysis</h2>

      {/* Overall Score */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall ATS Score</p>
            <p className="text-4xl font-bold">{data.overall_score}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600">Good</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Section Parsing Confidence</h3>
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionData = data.sections[section.key];
            const confidence = sectionData?.confidence || 0;

            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 min-w-[200px]">
                    {sectionData?.parsed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{section.label}</span>
                  </div>

                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          confidence >= 0.9
                            ? "bg-green-600"
                            : confidence >= 0.7
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <span className={`font-semibold min-w-[60px] text-right ${getConfidenceColor(confidence)}`}>
                    {(confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Issues */}
      {data.issues && data.issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Detected Issues</h3>
          <div className="space-y-3">
            {data.issues.map((issue: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                {getIssueIcon(issue.type)}
                <div className="flex-1">
                  <p className="text-sm">{issue.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
