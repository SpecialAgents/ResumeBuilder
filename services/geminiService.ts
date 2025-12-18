import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData, ATSAnalysis } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to strip markdown code blocks if present
const cleanJSON = (text: string) => {
  return text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
};

export const generateSummary = async (jobTitle: string, skills: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Write a professional, concise (3-4 sentences), and impactful resume summary for a ${jobTitle} with skills in: ${skills}. Focus on value and achievements. Do not include placeholders.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
};

export const optimizeBulletPoint = async (text: string, role: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Rewrite the following resume bullet point for a ${role} role to be more result-oriented, using strong action verbs and quantifying results if implied. Keep it to one concise sentence.
  Original: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Error optimizing bullet:", error);
    return text;
  }
};

export const analyzeATS = async (resumeData: ResumeData, jobDescription: string): Promise<ATSAnalysis> => {
  const ai = getAIClient();
  
  const resumeText = JSON.stringify(resumeData);
  
  // Schema definition for structured output
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "A score from 0 to 100 indicating match quality." },
      missingKeywords: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of important keywords from the JD missing in the resume."
      },
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Specific actionable suggestions to improve the resume for this JD."
      }
    },
    required: ["score", "missingKeywords", "suggestions"]
  };

  const prompt = `You are an expert ATS (Applicant Tracking System) scanner. Analyze the provided resume JSON against the Job Description.
  
  Job Description:
  ${jobDescription}

  Resume JSON:
  ${resumeText}

  Provide an objective match score (0-100), identify critical missing hard/soft skills (keywords), and give 3 specific suggestions for improvement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const result = JSON.parse(cleanJSON(response.text));
    return result as ATSAnalysis;
  } catch (error) {
    console.error("Error analyzing ATS:", error);
    return {
      score: 0,
      missingKeywords: ["Error analyzing resume"],
      suggestions: ["Please try again."]
    };
  }
};
