"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, AlertCircle } from "lucide-react";

interface SemanticMatcherProps {
  resumeData: any;
}

export default function SemanticMatcher({ resumeData }: SemanticMatcherProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;

    setMatching(true);
    
    // Simulate semantic matching
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setMatchResults({
      overall_match: 78,
      semantic_score: 82,
      literal_score: 74,
      matched_skills: [
        { skill: "React", confidence: 0.95, found: true },
        { skill: "TypeScript", confidence: 0.92, found: true },
        { skill: "Node.js", confidence: 0.88, found: true },
        { skill: "AWS", confidence: 0.45, found: false },
      ],
      missing_capabilities: [
        "Cloud infrastructure experience",
        "Kubernetes deployment",
      ],
      recommendations: [
        "Add specific AWS services you've worked with",
        "Highlight container orchestration experience",
        "Quantify project impact with metrics",
      ],
    });

    setMatching(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Semantic Job Matching</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Compare your resume against a job description using AI-powered semantic analysis
        </p>
      </div>

      {/* Job Description Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <button
          onClick={handleMatch}
          disabled={!jobDescription.trim() || matching}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {matching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Analyze Match
            </>
          )}
        </button>
      </div>

      {/* Match Results */}
      {matchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Scores */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Match</p>
              <p className="text-3xl font-bold text-blue-600">{matchResults.overall_match}%</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Semantic Score</p>
              <p className="text-3xl font-bold text-green-600">{matchResults.semantic_score}%</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Literal Score</p>
              <p className="text-3xl font-bold text-purple-600">{matchResults.literal_score}%</p>
            </div>
          </div>

          {/* Matched Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Skill Matching
            </h3>
            <div className="space-y-3">
              {matchResults.matched_skills.map((skill: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        skill.found ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${skill.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[50px] text-right">
                      {(skill.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Capabilities */}
          {matchResults.missing_capabilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Missing Capabilities
              </h3>
              <div className="space-y-2">
                {matchResults.missing_capabilities.map((capability: string, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm"
                  >
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-2">
              {matchResults.recommendations.map((rec: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
