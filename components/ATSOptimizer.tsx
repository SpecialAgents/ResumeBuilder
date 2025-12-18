import React, { useState } from 'react';
import { ResumeData, ATSAnalysis } from '../types';
import { analyzeATS } from '../services/geminiService';
import { Search, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface ATSProps {
  resumeData: ResumeData;
}

const ATSOptimizer: React.FC<ATSProps> = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    const result = await analyzeATS(resumeData, jobDescription);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col transition-colors">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Search className="text-indigo-600 dark:text-indigo-400" /> ATS Optimizer
      </h2>
      
      {!analysis ? (
        <div className="flex-1 flex flex-col">
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Paste the job description below to see how well your resume matches. AI will score your resume and suggest missing keywords.
          </p>
          <textarea
            className="flex-1 w-full p-4 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm mb-4 outline-none transition-colors"
            placeholder="Paste Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !jobDescription.trim()}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Analyze Match <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg dark:text-white">Match Score</h3>
            <div className={`text-2xl font-black ${analysis.score >= 75 ? 'text-green-500' : analysis.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {analysis.score}/100
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-6 transition-colors">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${analysis.score >= 75 ? 'bg-green-500' : analysis.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${analysis.score}%` }}
            ></div>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-amber-500" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.length > 0 ? (
                  analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs border border-red-100 dark:border-red-900/50">
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-green-600 dark:text-green-400">Great job! No critical keywords missing.</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-indigo-500 dark:text-indigo-400" /> AI Suggestions
              </h4>
              <ul className="space-y-3">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded border-l-4 border-indigo-400 dark:border-indigo-600">
                    {sug}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => setAnalysis(null)}
              className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline mt-4 transition-colors"
            >
              Analyze another job description
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSOptimizer;