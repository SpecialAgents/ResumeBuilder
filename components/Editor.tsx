import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Project } from '../types';
import { Plus, Trash2, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { generateSummary, optimizeBulletPoint } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleGenerateSummary = async () => {
    if (!data.experience[0]?.position) {
      alert("Please add a job position in your experience first.");
      return;
    }
    setIsGenerating(true);
    const skillsStr = data.skills.map(s => s.name).join(", ");
    const summary = await generateSummary(data.experience[0].position, skillsStr);
    if (summary) updateField('summary', summary);
    setIsGenerating(false);
  };

  const handleOptimizeDescription = async (index: number, text: string) => {
    if (!text) return;
    setIsGenerating(true);
    const role = data.experience[index].position;
    const lines = text.split('\n');
    const optimizedLines = await Promise.all(lines.map(line => line.length > 10 ? optimizeBulletPoint(line, role) : line));
    
    const newExp = [...data.experience];
    newExp[index].description = optimizedLines.join('\n');
    updateField('experience', newExp);
    setIsGenerating(false);
  };

  const addItem = <T extends { id: string }>(field: keyof ResumeData, item: T) => {
    updateField(field, [...(data[field] as unknown as T[]), item]);
  };

  const removeItem = (field: keyof ResumeData, id: string) => {
    updateField(field, (data[field] as any[]).filter((i: any) => i.id !== id));
  };

  const updateItem = (field: keyof ResumeData, index: number, key: string, value: any) => {
    const items = [...(data[field] as any[])];
    items[index] = { ...items[index], [key]: value };
    updateField(field, items);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Personal Info */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <button 
          onClick={() => toggleSection('personal')}
          className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="font-semibold text-slate-800 dark:text-slate-100">Personal Information</span>
          {activeSection === 'personal' ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        
        {activeSection === 'personal' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <input type="text" placeholder="Full Name" className="input-field" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} />
            <input type="email" placeholder="Email" className="input-field" value={data.email} onChange={e => updateField('email', e.target.value)} />
            <input type="text" placeholder="Phone" className="input-field" value={data.phone} onChange={e => updateField('phone', e.target.value)} />
            <input type="text" placeholder="Location (City, Country)" className="input-field" value={data.location} onChange={e => updateField('location', e.target.value)} />
            <input type="text" placeholder="LinkedIn URL" className="input-field" value={data.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
            <input type="text" placeholder="Website / Portfolio" className="input-field" value={data.website} onChange={e => updateField('website', e.target.value)} />
          </div>
        )}
      </div>

      {/* Professional Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <button onClick={() => toggleSection('summary')} className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Professional Summary</span>
          {activeSection === 'summary' ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {activeSection === 'summary' && (
          <div className="p-6">
            <div className="flex justify-end mb-2">
              <button 
                onClick={handleGenerateSummary} 
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-50"
              >
                <Wand2 size={14} /> {isGenerating ? 'Writing...' : 'Auto-Generate with AI'}
              </button>
            </div>
            <textarea 
              className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[120px] outline-none transition-colors"
              placeholder="Briefly describe your career highlights..."
              value={data.summary}
              onChange={e => updateField('summary', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <button onClick={() => toggleSection('experience')} className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Work Experience</span>
          {activeSection === 'experience' ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {activeSection === 'experience' && (
          <div className="p-6 space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative bg-slate-50/50 dark:bg-slate-800/20 transition-colors">
                <button onClick={() => removeItem('experience', exp.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Job Title" className="input-field" value={exp.position} onChange={e => updateItem('experience', index, 'position', e.target.value)} />
                  <input type="text" placeholder="Company" className="input-field" value={exp.company} onChange={e => updateItem('experience', index, 'company', e.target.value)} />
                  <input type="text" placeholder="Start Date" className="input-field" value={exp.startDate} onChange={e => updateItem('experience', index, 'startDate', e.target.value)} />
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="End Date" disabled={exp.current} className="input-field disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400" value={exp.endDate} onChange={e => updateItem('experience', index, 'endDate', e.target.value)} />
                    <label className="flex items-center gap-1 text-xs whitespace-nowrap text-slate-600 dark:text-slate-400">
                      <input type="checkbox" checked={exp.current} onChange={e => updateItem('experience', index, 'current', e.target.checked)} />
                      Present
                    </label>
                  </div>
                </div>
                <div>
                   <div className="flex justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Responsibilities (Bullet points)</label>
                      <button 
                        onClick={() => handleOptimizeDescription(index, exp.description)} 
                        disabled={isGenerating || !exp.description}
                        className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 disabled:opacity-50"
                      >
                        <Wand2 size={12} /> {isGenerating ? 'Optimizing...' : 'Enhance bullets'}
                      </button>
                   </div>
                   <textarea 
                    className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md text-sm min-h-[100px] outline-none transition-colors" 
                    value={exp.description}
                    placeholder="• Achieved X by doing Y..."
                    onChange={e => updateItem('experience', index, 'description', e.target.value)}
                   />
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('experience', { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' })}
              className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 flex justify-center items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Add Position
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <button onClick={() => toggleSection('skills')} className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Skills</span>
          {activeSection === 'skills' ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {activeSection === 'skills' && (
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {data.skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50 transition-colors">
                  <span className="text-sm">{skill.name}</span>
                  <button onClick={() => removeItem('skills', skill.id)} className="text-indigo-400 dark:text-indigo-500 hover:text-indigo-900 dark:hover:text-indigo-100 ml-1"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
               <input 
                  type="text" 
                  placeholder="Add a skill and press Enter" 
                  className="input-field flex-grow"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        addItem('skills', { id: Date.now().toString(), name: val, level: 'Intermediate' });
                        e.currentTarget.value = '';
                      }
                    }
                  }}
               />
            </div>
          </div>
        )}
      </div>

       {/* Education */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <button onClick={() => toggleSection('education')} className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Education</span>
          {activeSection === 'education' ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {activeSection === 'education' && (
          <div className="p-6 space-y-4">
             {data.education.map((edu, index) => (
              <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative bg-slate-50/50 dark:bg-slate-800/20 transition-colors">
                <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input type="text" placeholder="Institution" className="input-field" value={edu.institution} onChange={e => updateItem('education', index, 'institution', e.target.value)} />
                   <input type="text" placeholder="Degree" className="input-field" value={edu.degree} onChange={e => updateItem('education', index, 'degree', e.target.value)} />
                   <input type="text" placeholder="Field of Study" className="input-field" value={edu.fieldOfStudy} onChange={e => updateItem('education', index, 'fieldOfStudy', e.target.value)} />
                   <input type="text" placeholder="Graduation Date" className="input-field" value={edu.graduationDate} onChange={e => updateItem('education', index, 'graduationDate', e.target.value)} />
                </div>
              </div>
             ))}
             <button 
              onClick={() => addItem('education', { id: Date.now().toString(), institution: '', degree: '', fieldOfStudy: '', graduationDate: '' })}
              className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 flex justify-center items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Editor;