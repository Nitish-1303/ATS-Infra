"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  Code2, 
  Layers, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ZoomIn,
  ZoomOut,
  Download,
  RefreshCw
} from "lucide-react";

interface SplitViewDebuggerProps {
  originalPdf: string;
  parsedData: any;
  issues: any[];
}

export default function SplitViewDebugger({ originalPdf, parsedData, issues }: SplitViewDebuggerProps) {
  const [zoom, setZoom] = useState(100);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Visual ATS Debugger
          </h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">Live Analysis</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-slate-300" />
            </button>
            <span className="text-sm text-slate-300 min-w-[50px] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Overlay Toggle */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showOverlay
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            {showOverlay ? "Hide" : "Show"} Overlay
          </button>

          {/* Export */}
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Original PDF */}
        <div className="flex-1 border-r border-slate-800 bg-slate-900 overflow-auto">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                Original Resume
              </h3>
              <span className="text-xs text-slate-500">Human View</span>
            </div>
            
            <div 
              className="bg-white rounded-lg shadow-2xl relative"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
            >
              {/* PDF Preview */}
              <div className="aspect-[8.5/11] p-12 relative">
                {/* Simulated Resume Content */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold">John Doe</h1>
                    <p className="text-gray-600">Software Engineer</p>
                    <p className="text-sm text-gray-500">john@example.com • (555) 123-4567</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
                      Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700">
                      Experienced software engineer with 5+ years building scalable web applications...
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
                        Experience
                      </h2>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold">Senior Engineer</h3>
                          <p className="text-sm text-gray-600">Tech Corp • 2020-2024</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
                        Education
                      </h2>
                      <div>
                        <h3 className="font-semibold">BS Computer Science</h3>
                        <p className="text-sm text-gray-600">University • 2016-2020</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Overlays */}
                {showOverlay && issues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute border-2 rounded cursor-pointer ${
                      issue.severity === "error"
                        ? "border-red-500 bg-red-500/10"
                        : issue.severity === "warning"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-blue-500 bg-blue-500/10"
                    }`}
                    style={{
                      left: `${issue.bbox[0]}%`,
                      top: `${issue.bbox[1]}%`,
                      width: `${issue.bbox[2] - issue.bbox[0]}%`,
                      height: `${issue.bbox[3] - issue.bbox[1]}%`,
                    }}
                    onClick={() => setSelectedIssue(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute -top-6 left-0 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap">
                      {issue.message}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: ATS Parser View */}
        <div className="flex-1 bg-slate-950 overflow-auto">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                ATS Parser View
              </h3>
              <span className="text-xs text-slate-500">What ATS Systems See</span>
            </div>

            <div className="bg-slate-900 rounded-lg p-8 font-mono text-sm">
              {/* Simulated ATS Output */}
              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400">John Doe</p>
                    <p className="text-slate-500 text-xs">Parsed: Contact Name</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400">Software Engineer</p>
                    <p className="text-slate-500 text-xs">Parsed: Job Title</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400">john@example.com • (555) 123-4567</p>
                    <p className="text-slate-500 text-xs">Warning: Multiple contact fields in one line</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400">Professional Summary</p>
                    <p className="text-slate-500 text-xs">Parsed: Section Header</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-400">Experience | Education</p>
                    <p className="text-slate-500 text-xs">Error: Multi-column layout detected</p>
                    <p className="text-red-300 text-xs mt-1">
                      ATS systems may fail to parse columns correctly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-400">���������</p>
                    <p className="text-slate-500 text-xs">Error: Corrupted text encoding</p>
                  </div>
                </div>
              </div>

              {/* Parser Stats */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Parsed Successfully</p>
                    <p className="text-2xl font-bold text-green-400">67%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-400">2</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Errors</p>
                    <p className="text-2xl font-bold text-red-400">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Issues List */}
      <div className="h-48 border-t border-slate-800 bg-slate-900 overflow-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Detected Issues ({issues.length})
          </h3>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedIssue(index)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedIssue === index
                    ? "bg-slate-800 border-2 border-blue-500"
                    : "bg-slate-800/50 border-2 border-transparent hover:bg-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {issue.severity === "error" ? (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : issue.severity === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{issue.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500">
                        Location: Page {issue.page}, Section: {issue.section}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        issue.severity === "error"
                          ? "bg-red-500/20 text-red-400"
                          : issue.severity === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
