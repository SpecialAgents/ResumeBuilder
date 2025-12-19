import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  TabStopPosition, 
  TabStopType,
  BorderStyle
} from "docx";
import saveAs from "file-saver";
import { ResumeData } from "../types";

export const generateDocx = async (data: ResumeData) => {
  // Helper for bullet points
  const createBullet = (text: string) => {
    return new Paragraph({
      text: text,
      bullet: { level: 0 },
    });
  };

  const sections = [];

  // --- Header ---
  const headerParams = [
    new Paragraph({
      text: data.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: data.email ? `${data.email} | ` : "" }),
        new TextRun({ text: data.phone ? `${data.phone} | ` : "" }),
        new TextRun({ text: data.location || "" }),
      ],
      spacing: { after: 200 },
    })
  ];

  if (data.linkedin || data.website) {
    headerParams.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: data.linkedin ? `LinkedIn: ${data.linkedin}  ` : "" }),
        new TextRun({ text: data.website ? `Portfolio: ${data.website}` : "" }),
      ],
      spacing: { after: 400 },
    }));
  }

  sections.push(...headerParams);

  // --- Summary ---
  if (data.summary) {
    sections.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 }
        },
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: data.summary,
        spacing: { after: 300 },
      })
    );
  }

  // --- Experience ---
  if (data.experience.length > 0) {
    sections.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 }
        },
        spacing: { before: 200, after: 100 },
      })
    );

    data.experience.forEach(exp => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
            new TextRun({ 
              text: `\t${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
              bold: true,
            }),
          ],
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          text: exp.company,
          italics: true,
          spacing: { after: 100 },
        })
      );

      if (exp.description) {
        exp.description.split('\n').forEach(line => {
          if (line.trim()) sections.push(createBullet(line.trim()));
        });
      }
    });
  }

  // --- Education ---
  if (data.education.length > 0) {
    sections.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 }
        },
        spacing: { before: 300, after: 100 },
      })
    );

    data.education.forEach(edu => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true }),
            new TextRun({ 
              text: `\t${edu.graduationDate}`,
              bold: true,
            }),
          ],
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          text: `${edu.degree}, ${edu.fieldOfStudy}`,
          spacing: { after: 100 },
        })
      );
    });
  }

  // --- Skills ---
  if (data.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 }
        },
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        text: data.skills.map(s => s.name).join(" • "),
        spacing: { after: 100 },
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.fullName.replace(/\s+/g, "_")}_Resume.docx`);
};

export const generateGuideDocx = async () => {
  const sections = [
    new Paragraph({
      text: "ResumeAI: The Complete User Guide",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Step 1: Foundation & Personal Branding",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Start with the 'Personal Information' section. Your name, email, and professional links are the foundation. Use a professional email and ensure links are correct.",
    }),
    new Paragraph({
      text: "Step 2: Crafting the Hook with AI",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Use the 'Auto-Generate' feature in the Summary section. The AI analyzes your job title and skills to create a powerful opening statement.",
    }),
    new Paragraph({
      text: "Step 3: Results-Oriented Experience",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Add your work experience and use 'Enhance Bullets'. This tool rewrites your duties using the STAR method (Situation, Task, Action, Result) to emphasize impact.",
    }),
    new Paragraph({
      text: "Step 4: ATS Optimization",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Switch to the 'ATS Check' tab. Paste the job description you are applying for. The AI will score your match and list missing keywords that you should integrate into your skills or experience sections.",
    }),
    new Paragraph({
      text: "Step 5: Visual Style and Export",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Select a template (Modern, Professional, or Minimalist) and export your final document as PDF, DOCX, or HTML.",
    }),
    new Paragraph({
      text: "Expert Tips:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    }),
    new Paragraph({ text: "• Aim for a match score above 85% for best results.", bullet: { level: 0 } }),
    new Paragraph({ text: "• Use strong action verbs at the start of every bullet point.", bullet: { level: 0 } }),
    new Paragraph({ text: "• Quantify your achievements (e.g., 'Improved efficiency by 20%').", bullet: { level: 0 } }),
    new Paragraph({ text: "• Keep your resume to a single page whenever possible.", bullet: { level: 0 } }),
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ResumeAI_User_Guide.docx");
};
