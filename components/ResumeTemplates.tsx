import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { MapPin, Phone, Mail, Globe, Linkedin, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  template: TemplateType;
}

const ResumeTemplates: React.FC<TemplateProps> = ({ data, template }) => {
  
  // --- Template 1: Modern (Sidebar + Navy Headers) ---
  if (template === TemplateType.MODERN) {
    return (
      <div className="w-full min-h-[297mm] bg-white text-slate-800 font-sans leading-relaxed flex flex-row shadow-none overflow-hidden" id="resume-preview">
        {/* Sidebar */}
        <div className="w-[33%] bg-slate-900 text-white p-6 flex flex-col gap-6 shrink-0 print:bg-slate-900 print:text-white">
          <div className="mb-4">
            <h1 className="text-3xl font-bold uppercase tracking-wider leading-tight break-words">{data.fullName}</h1>
            <p className="text-cyan-400 mt-2 font-medium">
              {data.experience[0]?.position || "Professional Title"}
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            {data.email && <div className="flex items-center gap-2"><Mail size={14} className="shrink-0" /> <span className="break-all">{data.email}</span></div>}
            {data.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" /> <span>{data.phone}</span></div>}
            {data.location && <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /> <span>{data.location}</span></div>}
            {data.website && <div className="flex items-center gap-2"><Globe size={14} className="shrink-0" /> <a href={data.website} target="_blank" rel="noreferrer" className="underline decoration-cyan-400/50 break-all">Website</a></div>}
            {data.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} className="shrink-0" /> <a href={data.linkedin} target="_blank" rel="noreferrer" className="underline decoration-cyan-400/50 break-all">LinkedIn</a></div>}
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase border-b border-slate-700 pb-1 mb-3 text-white">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <span key={skill.id} className="bg-slate-800 px-2 py-1 rounded text-xs text-cyan-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase border-b border-slate-700 pb-1 mb-3 text-white">Education</h3>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-white">{edu.institution}</div>
                  <div className="text-sm text-cyan-400">{edu.degree}</div>
                  <div className="text-xs text-slate-400">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Use flex-1 to fill remaining space without overflowing */}
        <div className="flex-1 p-8 bg-white">
          {data.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">Profile</h2>
              <p className="text-sm text-slate-600 text-justify leading-relaxed">{data.summary}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{exp.position}</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded whitespace-nowrap ml-2">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-cyan-700 font-medium text-sm mb-2">{exp.company}</div>
                  <div className="text-sm text-slate-600 whitespace-pre-line pl-4 border-l-2 border-slate-100 leading-relaxed">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4">Projects</h2>
              <div className="space-y-4">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{proj.name}</h3>
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-cyan-600"><ExternalLink size={12}/></a>}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Template 2: Professional (Classic Top-Down) ---
  if (template === TemplateType.PROFESSIONAL) {
    return (
      <div className="w-full min-h-[297mm] bg-white text-slate-900 font-serif p-10 mx-auto overflow-hidden" id="resume-preview">
        <header className="border-b-2 border-black pb-4 mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">{data.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
            {data.linkedin && <span>• LinkedIn</span>}
            {data.website && <span>• Portfolio</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Work Experience</h2>
          <div className="space-y-5">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-md">{exp.company}</h3>
                  <span className="text-sm italic shrink-0 ml-4">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-sm font-semibold mb-1">{exp.position}</div>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-8">
          <section className="mb-6 flex-1">
            <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-sm">{edu.institution}</div>
                  <div className="text-sm">{edu.degree}, {edu.fieldOfStudy}</div>
                  <div className="text-xs text-slate-500">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6 flex-1">
            <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Skills</h2>
            <div className="text-sm leading-relaxed">
              {data.skills.map(s => s.name).join(' • ')}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- Template 3: Minimalist (Clean Grid) ---
  return (
    <div className="w-full min-h-[297mm] bg-white text-gray-800 font-sans p-10 overflow-hidden" id="resume-preview">
      <header className="mb-8">
        <h1 className="text-5xl font-light text-slate-900 tracking-tight mb-2">{data.fullName}</h1>
        <p className="text-xl text-emerald-600 font-light">{data.experience[0]?.position}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
           {data.email && <span>{data.email}</span>}
           {data.phone && <span>{data.phone}</span>}
           {data.location && <span>{data.location}</span>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-8 flex flex-col">
          {data.summary && (
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About Me</h3>
              <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.summary}</p>
            </div>
          )}

          <div className="mb-8 flex-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Experience</h3>
            <div className="space-y-8">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative pl-6 border-l border-gray-200">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <p className="text-emerald-700 text-sm mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4">
           <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Timeline</h3>
            <div className="space-y-2">
                {data.experience.map(exp => (
                    <div key={exp.id} className="text-xs">
                        <span className="font-bold block text-gray-800">{exp.company}</span>
                        <span className="text-gray-500">{exp.startDate.split('-')[0]} — {exp.current ? 'Now' : exp.endDate.split('-')[0]}</span>
                    </div>
                ))}
            </div>
           </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Education</h3>
            {data.education.map(edu => (
                <div key={edu.id} className="mb-3 text-sm">
                    <div className="font-bold">{edu.institution}</div>
                    <div className="text-gray-600">{edu.degree}</div>
                </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span key={skill.id} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                        {skill.name}
                    </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplates;