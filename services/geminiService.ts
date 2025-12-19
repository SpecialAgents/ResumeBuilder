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
  const prompt = `Write a professional, high-impact resume summary for a ${jobTitle} with skills in: ${skills}. 
  Focus on specific achievements and value proposition. Use active language. 
  The summary should be approximately 3-4 sentences and ATS-friendly. Do not use placeholders.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
  const prompt = `You are a career expert. Rewrite the following resume bullet point for a ${role} to be more result-oriented and impactful. 
  Follow the STAR (Situation, Task, Action, Result) method principles. Start with a strong action verb and quantify results if possible.
  Keep it to exactly one sentence.
  Original: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

  const prompt = `Analyze this resume against the provided Job Description like a top-tier recruiter and ATS system.
  
  Job Description:
  ${jobDescription}

  Resume JSON:
  ${resumeText}

  Task:
  1. Score the resume match from 0-100.
  2. Identify critical missing keywords (technologies, skills, certifications).
  3. Provide 3 specific, high-value suggestions to increase the match rate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(cleanJSON(text));
    return result as ATSAnalysis;
  } catch (error) {
    console.error("Error analyzing ATS:", error);
    return {
      score: 0,
      missingKeywords: ["Connection error"],
      suggestions: ["Please check your internet and try again."]
    };
  }
};