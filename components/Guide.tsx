import React from 'react';
import { 
  Sparkles, Zap, ShieldCheck, FileDown, 
  Layout, BookOpen, Wand2, Search, CheckCircle2,
  Keyboard, Lightbulb, Target, Info
} from 'lucide-react';
import { generateGuideDocx } from '../services/docxExport';

const Guide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 bg-slate-100 dark:bg-slate-950 transition-colors pb-32">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-200 dark:border-indigo-800">
          <BookOpen size={16} /> Interactive User Guide
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How to Build a <span className="text-indigo-600 dark:text-indigo-400">Winning Resume</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          From zero to "Hired" with AI-powered precision. Follow this roadmap to optimize every section.
        </p>
        <div className="flex justify-center pt-4">
           <button 
            onClick={generateGuideDocx}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
           >
              <FileDown size={20} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
              Download Guide as Word (DOCX)
           </button>
        </div>
      </div>

      {/* Quick Start Tracker */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target size={14} /> Resume Roadmap
        </h3>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          {["Details", "AI Summary", "Experience", "ATS Check", "Export"].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 min-w-[80px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                {i + 1}
              </div>
              <span className={`text-[10px] md:text-xs font-bold ${i === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step by Step Sections */}
      <div className="space-y-6">
        <GuideStep 
          number="1"
          title="Foundation: Personal Branding"
          description="Your header is your business card. Ensure your LinkedIn and Portfolio links are clickable. Professional titles should match the job you are targeting, not necessarily your current title."
          icon={<Zap className="text-amber-500" />}
          tips={["Use a clean, professional email.", "LinkedIn link should be customized.", "Location is optional for remote roles."]}
        />

        <GuideStep 
          number="2"
          title="The Hook: AI Professional Summary"
          description="Use the 'Auto-Generate' feature. Our AI analyzes your skills and top experience to write a hook that grabs a recruiter's attention in the first 6 seconds."
          icon={<Wand2 className="text-indigo-500" />}
          isAI={true}
          tips={["Regenerate if you want a different tone.", "Edit the AI output to add your unique voice.", "Focus on years of experience and core value."] }
        />

        <GuideStep 
          number="3"
          title="The Proof: AI-Enhanced Experience"
          description="List your duties then click 'Enhance Bullets'. The system transforms 'Worked on X' into 'Engineered high-performance X, resulting in 20% growth'. This is where STAR method magic happens."
          icon={<Sparkles className="text-purple-500" />}
          isAI={true}
          tips={["Aim for 3-5 bullets per recent role.", "Quantify with %, $, or headcount.", "Use the keywords identified in the ATS Check."] }
        />

        <GuideStep 
          number="4"
          title="The Gatekeeper: ATS Optimization"
          description="Most companies use software to filter resumes. Paste the target Job Description in the ATS tab. The AI identifies 'Critical Missing Keywords' that you must include to pass the filters."
          icon={<Search className="text-emerald-500" />}
          tips={["Aim for a score above 85%.", "Missing keywords are usually hard skills.", "Match the Job Title exactly if possible."] }
        />

        <GuideStep 
          number="5"
          title="The Finish Line: Export & Apply"
          description="Choose a template that matches your industry. PDF is the standard. If you're working with a headhunter, they might request the DOCX version for their own adjustments."
          icon={<FileDown className="text-rose-500" />}
          tips={["Save as 'FullName_Resume_Date.pdf'", "Double check formatting after export.", "Test links in the PDF."] }
        />
      </div>

      {/* Power User Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 dark:bg-indigo-900/40 p-8 rounded-3xl text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Keyboard size={20} /> Pro Shortcuts
          </h3>
          <ul className="space-y-2 text-indigo-100">
            <li className="flex justify-between text-sm"><span>Add Skill</span> <kbd className="bg-indigo-500 px-1.5 rounded text-xs uppercase font-mono">Enter</kbd></li>
            <li className="flex justify-between text-sm"><span>Toggle Section</span> <kbd className="bg-indigo-500 px-1.5 rounded text-xs uppercase font-mono">Click</kbd></li>
            <li className="flex justify-between text-sm"><span>Live Preview</span> <kbd className="bg-indigo-500 px-1.5 rounded text-xs uppercase font-mono">Always On</kbd></li>
            <li className="flex justify-between text-sm"><span>Print Preview</span> <kbd className="bg-indigo-500 px-1.5 rounded text-xs uppercase font-mono">Ctrl+P</kbd></li>
          </ul>
        </div>
        <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-400" /> Career Hack
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed italic">
            "Your resume is not a history of your past; it is a marketing document for your future. Only include things that help you get the next job, not everything you've ever done."
          </p>
        </div>
      </div>

      {/* Footer Support */}
      <div className="text-center py-10 text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-2 text-sm">
          <Info size={14} /> Stuck? Try resetting your data or switching templates to refresh the layout.
        </p>
      </div>
    </div>
  );
};

const GuideStep = ({ number, title, description, icon, isAI, tips }: { 
  number: string, 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  isAI?: boolean,
  tips: string[] 
}) => (
  <div className="flex gap-4 md:gap-8 group">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-2"></div>
    </div>
    <div className="flex-1 space-y-4">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          {isAI && (
            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
              <Sparkles size={12} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI Powered</span>
            </div>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {description}
        </p>
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Expert Tips
          </h4>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Guide;
