import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateType } from './types';
import Editor from './components/Editor';
import ResumeTemplates from './components/ResumeTemplates';
import ATSOptimizer from './components/ATSOptimizer';
import LandingPage from './components/LandingPage';
import { generateDocx } from './services/docxExport';
import { 
  Printer, Download, Layout, FileText, Search, Sparkles, 
  FileCode, Eye, Menu, X, ArrowLeft, Sun, Moon 
} from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "alexmorgan.dev",
  linkedin: "linkedin.com/in/alexmorgan",
  summary: "Results-driven Software Engineer with 5+ years of experience in full-stack development. Proven track record of improving system performance and leading cross-functional teams.",
  experience: [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Senior Developer",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Led a team of 5 engineers to migrate legacy monolith to microservices.\nImproved API response time by 40% through caching strategies."
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of California",
      degree: "B.S. Computer Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "2018"
    }
  ],
  skills: [
    { id: "1", name: "React", level: "Expert" },
    { id: "2", name: "TypeScript", level: "Expert" },
    { id: "3", name: "Node.js", level: "Intermediate" }
  ],
  projects: []
};

type ActiveTab = 'editor' | 'ats' | 'preview';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.MODERN);
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [isClient, setIsClient] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Persistence
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('resumeData');
    const hasStarted = localStorage.getItem('appStarted');
    const savedTheme = localStorage.getItem('theme');
    
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
    
    if (hasStarted === 'true') setIsStarted(true);
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  }, [resumeData, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode, isClient]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleStart = () => {
    setIsStarted(true);
    if (isClient) {
      localStorage.setItem('appStarted', 'true');
    }
  };

  const handleBackToLanding = () => {
    setIsStarted(false);
    if (isClient) {
      localStorage.removeItem('appStarted');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;
    setIsDownloading(true);

    const opt = {
      margin: 0, 
      filename: `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
      }).catch((err: any) => {
        console.error("PDF generation failed", err);
        setIsDownloading(false);
        window.print();
      });
    } else {
      window.print();
      setIsDownloading(false);
    }
  };

  const handleDownloadHTML = () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    const content = resumeElement.outerHTML;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.fullName} - Resume</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 40px; background: #f3f4f6; min-height: 100vh; display: flex; justify-content: center; }
        .resume-wrapper { 
            width: 210mm; 
            min-height: 297mm; 
            background: white; 
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            overflow: hidden;
        }
        @media print {
            body { padding: 0; background: white; }
            .resume-wrapper { box-shadow: none; width: 100%; margin: 0; }
        }
    </style>
</head>
<body>
    <div class="resume-wrapper">
        ${content}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = () => {
    generateDocx(resumeData);
  };

  if (!isClient) return null;

  return (
    <div className={`${darkMode ? 'dark' : ''} transition-colors duration-300`}>
      {!isStarted ? (
        <LandingPage onStart={handleStart} darkMode={darkMode} onToggleTheme={toggleDarkMode} />
      ) : (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col h-screen overflow-hidden animate-in fade-in duration-500">
          {/* Navbar */}
          <nav className="fixed top-0 w-full bg-slate-900 text-white z-50 px-4 md:px-6 py-3 flex justify-between items-center shadow-md print:hidden h-16">
            <div className="flex items-center gap-4 font-bold text-xl tracking-tight">
              <button 
                onClick={handleBackToLanding}
                className="hover:text-indigo-400 transition-colors"
                title="Back to home"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="text-indigo-400" />
                <span className="hidden sm:inline">ResumeAI</span>
                <span className="sm:hidden">CV.AI</span>
              </div>
            </div>

            {/* Desktop Nav & Actions */}
            <div className="hidden md:flex items-center gap-4">
               <div className="flex gap-2 mr-4 border-r border-slate-700 pr-4">
                  <button 
                    onClick={() => setActiveTab('editor')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2"><FileText size={16} /> Builder</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('ats')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ats' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2"><Search size={16} /> ATS Check</div>
                  </button>
               </div>
               
               <button 
                  onClick={toggleDarkMode} 
                  className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 mr-2"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

               <div className="flex items-center gap-2">
                 <button onClick={handleDownloadDocx} className="bg-slate-800 text-indigo-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700">
                    DOCX
                 </button>
                 <button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-75">
                   {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                   ) : <Download size={16} />} 
                   PDF
                 </button>
               </div>
            </div>

            {/* Mobile Actions Toggle */}
            <div className="md:hidden flex items-center gap-2">
               <button onClick={toggleDarkMode} className="p-2 text-slate-300">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 text-slate-300">
                  {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="fixed top-16 left-0 w-full bg-slate-800 text-white z-40 p-4 shadow-xl border-t border-slate-700 md:hidden animate-in slide-in-from-top-2">
               <div className="flex flex-col gap-3">
                  <button onClick={() => { handleDownloadDocx(); setShowMobileMenu(false); }} className="p-3 bg-slate-700 rounded-lg flex items-center gap-3 text-left">
                    <FileText size={18} /> Download DOCX
                  </button>
                  <button onClick={() => { handleDownloadPDF(); setShowMobileMenu(false); }} className="p-3 bg-white text-slate-900 font-bold rounded-lg flex items-center gap-3 text-left">
                    <Download size={18} /> Download PDF
                  </button>
               </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 pt-16 px-0 md:px-4 max-w-[1600px] mx-auto w-full flex gap-6 overflow-hidden">
            
            {/* Left Panel: Editor/ATS */}
            <div className={`
                w-full md:w-5/12 xl:w-1/3 flex flex-col gap-4 h-full overflow-y-auto print:hidden scrollbar-hide bg-slate-100 dark:bg-slate-950 p-4 md:p-0 transition-colors
                ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}
            `}>
              {activeTab === 'ats' ? (
                <div className="h-full animate-in fade-in slide-in-from-right-4 pb-20 md:pb-0">
                   <ATSOptimizer resumeData={resumeData} />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4 pb-20 md:pb-0">
                   {/* Template Selector */}
                   <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm mb-4 border border-slate-200 dark:border-slate-800 transition-colors">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Layout size={14} /> Choose Template
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.values(TemplateType).map((t) => (
                          <button
                            key={t}
                            onClick={() => setActiveTemplate(t)}
                            className={`py-2 px-1 text-xs font-semibold rounded border-2 transition-all capitalize ${
                              activeTemplate === t 
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400' 
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                   </div>
                   <Editor data={resumeData} onChange={setResumeData} />
                </div>
              )}
            </div>

            {/* Right Panel: Preview */}
            <div className={`
               md:flex md:w-7/12 xl:w-2/3 bg-slate-200/50 dark:bg-slate-900/50 md:rounded-xl md:border border-slate-300/50 dark:border-slate-800/50 items-start justify-center overflow-auto h-full p-4 md:p-8 print:block print:w-full print:h-auto print:bg-white print:p-0 print:border-none print:static print:shadow-none print:overflow-visible relative transition-colors
               ${activeTab === 'preview' ? 'flex fixed inset-0 z-40 pt-20 bg-slate-200 dark:bg-slate-950' : 'hidden'}
               ${activeTab === 'preview' ? 'w-full' : ''}
            `}>
              <div className="origin-top scale-[0.55] sm:scale-[0.65] lg:scale-[0.70] xl:scale-[0.85] 2xl:scale-100 transition-transform duration-200 print:scale-100 print:transform-none">
                 <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] print:w-full print:min-h-0 print:h-auto overflow-hidden">
                    <ResumeTemplates data={resumeData} template={activeTemplate} />
                 </div>
              </div>
            </div>

          </main>

          {/* Mobile Bottom Nav */}
          <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'editor' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
               <FileText size={20} /> Builder
            </button>
            <button 
              onClick={() => setActiveTab('ats')}
              className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'ats' ? 'text-emerald-600' : 'text-slate-400'}`}
            >
               <Search size={20} /> ATS Check
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'preview' ? 'text-purple-600' : 'text-slate-400'}`}
            >
               <Eye size={20} /> Preview
            </button>
          </div>

          <style>{`
            @media print {
              @page { margin: 0; size: auto; }
              body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                background: white; 
                margin: 0; 
                padding: 0;
              }
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
            }
            .input-field {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #e2e8f0;
              border-radius: 0.5rem;
              font-size: 0.875rem;
              outline: none;
              transition: all 0.2s;
            }
            .dark .input-field {
              background-color: #1e293b;
              border-color: #334155;
              color: #f1f5f9;
            }
            .input-field:focus {
              border-color: #6366f1;
              box-shadow: 0 0 0 1px #6366f1;
            }
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            ::-webkit-scrollbar-track {
              background: transparent; 
            }
            ::-webkit-scrollbar-thumb {
              background: #cbd5e1; 
              border-radius: 4px;
            }
            .dark ::-webkit-scrollbar-thumb {
              background: #334155;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #94a3b8; 
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default App;