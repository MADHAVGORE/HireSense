const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const interviewReportSchema = z.object({
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this technical question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this technical question, what points to cover, what approach to use while answering this question",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with the intention and how to answer them",
    ),
  behaviourQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioural question can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking the behavioural question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this behavioural question, what points to cover, what approach to use while answering this question",
          ),
      }),
    )
    .describe(
      "Behavioural questions that can be asked in the interview along with the intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("The skill in which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap"),
      }),
    )
    .describe(
      "Skill gaps that the candidate needs to work on along with the severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The focus of the day in the preparation plan, what the candidate should focus on that day",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of actionable tasks that the candidate should do on that day to prepare for the interview",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to prepare for the interview, with each day having a specific focus and actionable tasks",
    ),
});

async function generateInterviewReport({
  jobDescription,
  resume,
  selfDescription,
}) {
const prompt = `
You are an expert interviewer.

Generate:

1. 5 technical questions with:
   - question
   - intention
   - answer

2. 4 behavioural questions with:
   - question
   - intention
   - answer

3. Skill gaps with severity

4. 7-day preparation plan

IMPORTANT:
- Write clearly in structured format
- Do NOT return JSON
- Use clear labels like:

TECHNICAL QUESTIONS:
Q:
Intention:
Answer:

BEHAVIOURAL QUESTIONS:
...

SKILL GAPS:
Skill - Severity

PREPARATION PLAN:
Day 1:
Focus:
Tasks:
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(JSON.parse(response.text));
}

module.exports = { generateInterviewReport };
