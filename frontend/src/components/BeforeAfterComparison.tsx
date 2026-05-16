"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Eye, EyeOff } from "lucide-react";

interface BeforeAfterComparisonProps {
  beforeData: any;
  afterData: any;
}

export default function BeforeAfterComparison({ beforeData, afterData }: BeforeAfterComparisonProps) {
  const [showOverlay, setShowOverlay] = useState(true);

  const improvements = [
    { label: "ATS Compatibility", before: 72, after: 94, unit: "%" },
    { label: "Parse Confidence", before: 68, after: 96, unit: "%" },
    { label: "Issues Detected", before: 8, after: 0, unit: "" },
    { label: "Sections Parsed", before: 3, after: 5, unit: "/5" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Before & After Repair</h2>
        <p className="text-slate-600 dark:text-slate-400">
          See how PDF repair improves ATS compatibility
        </p>
      </div>

      {/* Metrics Comparison */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {improvements.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{metric.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                {metric.before}{metric.unit}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <span className="text-2xl font-bold text-green-600">
                {metric.after}{metric.unit}
              </span>
            </div>
            <div className="mt-2 text-xs text-green-600 font-medium">
              +{metric.after - metric.before}{metric.unit} improvement
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Before */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-red-600">Before Repair</h3>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded">
              8 Issues
            </span>
          </div>
          
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10 relative overflow-hidden">
            {/* Simulated Resume Preview */}
            <div className="space-y-4 opacity-70">
              <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
              <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/2" />
              <div className="h-20 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-slate-300 dark:bg-slate-600 rounded" />
                <div className="h-16 bg-slate-300 dark:bg-slate-600 rounded" />
              </div>
            </div>

            {/* Issue Overlays */}
            {showOverlay && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-6 left-6 right-6 h-4 border-2 border-red-500 bg-red-500/20 rounded"
                >
                  <span className="absolute -top-6 left-0 text-xs text-red-600 font-medium">
                    Unreadable text
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-24 left-6 right-6 h-20 border-2 border-red-500 bg-red-500/20 rounded"
                >
                  <span className="absolute -top-6 left-0 text-xs text-red-600 font-medium">
                    Multi-column layout
                  </span>
                </motion.div>
              </>
            )}
          </div>

          {/* Issues List */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Multi-column layout detected</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Corrupted font encoding</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Image-based text detected</span>
            </div>
          </div>
        </div>

        {/* After */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-600">After Repair</h3>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded">
              0 Issues
            </span>
          </div>
          
          <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-6 bg-green-50 dark:bg-green-900/10">
            {/* Simulated Resume Preview */}
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 dark:bg-slate-300 rounded w-3/4" />
              <div className="h-4 bg-slate-700 dark:bg-slate-300 rounded w-1/2" />
              <div className="h-20 bg-slate-700 dark:bg-slate-300 rounded" />
              <div className="space-y-2">
                <div className="h-16 bg-slate-700 dark:bg-slate-300 rounded" />
                <div className="h-16 bg-slate-700 dark:bg-slate-300 rounded" />
              </div>
            </div>
          </div>

          {/* Success List */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <span>Single-column layout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <span>Clean text encoding</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <span>Machine-readable text</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        >
          {showOverlay ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Issues
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Issues
            </>
          )}
        </button>

        <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Download Repaired PDF
        </button>
      </div>
    </div>
  );
}
