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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Search className="text-indigo-600" /> ATS Optimizer
      </h2>
      
      {!analysis ? (
        <div className="flex-1 flex flex-col">
          <p className="text-slate-600 mb-4 text-sm">
            Paste the job description below to see how well your resume matches. AI will score your resume and suggest missing keywords.
          </p>
          <textarea
            className="flex-1 w-full p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm mb-4"
            placeholder="Paste Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !jobDescription.trim()}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
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
            <h3 className="font-bold text-lg">Match Score</h3>
            <div className={`text-2xl font-black ${analysis.score >= 75 ? 'text-green-500' : analysis.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {analysis.score}/100
            </div>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${analysis.score >= 75 ? 'bg-green-500' : analysis.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${analysis.score}%` }}
            ></div>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
            <div>
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-amber-500" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.length > 0 ? (
                  analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-100">
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-green-600">Great job! No critical keywords missing.</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-indigo-500" /> AI Suggestions
              </h4>
              <ul className="space-y-3">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-indigo-50/50 p-3 rounded border-l-4 border-indigo-400">
                    {sug}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => setAnalysis(null)}
              className="w-full text-sm text-slate-500 hover:text-slate-900 underline mt-4"
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
