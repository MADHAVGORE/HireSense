const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
const prompt = `
You are an expert interview coach.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

You MUST return a valid JSON object with EXACTLY this structure:

{
  "reportTitle": "Short title for this interview report based on the job description (e.g. 'MERN Stack Developer Interview Prep')",
  "matchScore": 75,
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behaviourQuestions": [
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "skill name here", "severity": "low" },
    { "skill": "skill name here", "severity": "medium" },
    { "skill": "skill name here", "severity": "high" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 2, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 3, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 4, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 5, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 6, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 7, "focus": "focus here", "tasks": ["task 1", "task 2", "task 3"] }
  ]
}

STRICT RULES:
- matchScore must be a number between 0 and 100 representing how well the candidate matches the job
- title must be a short descriptive title for this interview report
- severity must be exactly "low", "medium", or "high"
- Every array must contain objects, never plain strings
- Fill in all "..." with real content based on the candidate's resume and job description
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // ❌ no responseSchema
    },
  });

  const clean = response.text.replace(/```json|```/g, "").trim();
  console.log("AI raw response:", clean);
  return JSON.parse(clean);
}

module.exports = { generateInterviewReport };