import React from 'react';
import { Sparkles, Zap, ShieldCheck, FileDown, ArrowRight, CheckCircle2, Sun, Moon } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, onToggleTheme }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
          <Sparkles className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
          <span>ResumeAI</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={onStart}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50"
          >
            Create Free Resume
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-indigo-100 dark:border-indigo-800">
              <Zap size={16} /> Powered by Gemini 2.5 Flash
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
              Land your dream job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">AI precision.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
              The only AI-powered resume builder that optimizes for ATS, crafts perfect bullet points, and generates professional summaries in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
              >
                Build My Resume <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-4 py-2">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                 </div>
                 <div className="text-sm">
                    <div className="font-bold text-slate-900 dark:text-slate-100">5,000+ Users</div>
                    <div className="text-slate-500 dark:text-slate-400">hired at top tech firms</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Resume Preview Animation */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>
             
             <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                   <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-1/3"></div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-32 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-4">
                      <div className="h-3 bg-indigo-200 dark:bg-indigo-800 rounded w-1/4 mb-4"></div>
                      <div className="space-y-2">
                         <div className="h-2 bg-indigo-100 dark:bg-indigo-900/40 rounded w-full"></div>
                         <div className="h-2 bg-indigo-100 dark:bg-indigo-900/40 rounded w-full"></div>
                         <div className="h-2 bg-indigo-100 dark:bg-indigo-900/40 rounded w-3/4"></div>
                      </div>
                   </div>
                   <div className="h-24 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                      <div className="space-y-2">
                         <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                         <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                      </div>
                   </div>
                </div>
                <div className="mt-6 flex justify-between items-center px-2">
                   <div className="flex gap-2">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                   </div>
                   <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">ATS SCORE: 98%</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 dark:bg-slate-900 py-24 px-6 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Everything you need to get hired.</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Built by career experts and powered by state-of-the-art AI to give you an unfair advantage.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="AI Content Engine"
              description="Automatically generate professional summaries and action-oriented bullet points that capture recruiter attention."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="ATS Compatibility"
              description="Real-time analysis against job descriptions. Identify missing keywords and boost your match score instantly."
            />
            <FeatureCard 
              icon={<FileDown className="text-indigo-500" />}
              title="Multi-Format Export"
              description="Download your resume in pixel-perfect PDF, fully editable Word (DOCX), or self-contained HTML formats."
            />
          </div>
        </div>
      </section>

      {/* Quick Checklist */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-900 dark:bg-indigo-950/40 rounded-[32px] p-8 md:p-16 text-white relative overflow-hidden border dark:border-indigo-900/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">Why use ResumeAI?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "100% ATS-Friendly Templates",
                "Instant AI Feedback",
                "Clean Single-Page PDF Export",
                "Multiple Design Styles",
                "No Registration Required",
                "Real-time Editor Preview"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-indigo-400 shrink-0" size={20} />
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={onStart}
              className="mt-12 bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl"
            >
              Start Building Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 px-6 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
          <Sparkles className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
          <span>ResumeAI</span>
        </div>
        <p>&copy; 2024 ResumeAI. All professional rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-950/50 hover:-translate-y-1 transition-all duration-300">
    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;