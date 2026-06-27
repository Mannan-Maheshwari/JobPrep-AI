const { GoogleGenAI } = require("@google/genai");
const {z, config} = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const reportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate and the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the intervierwer behind asking this question"),
        answer: z.string().describe("How to answer this question in the interview, what points to cover, what to avoid!!")
    })).describe("The technical questions that can be asked in the interview"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the intervierwer behind asking this question"),
        answer: z.string().describe("How to answer this question in the interview, what points to cover, what to avoid!!")
    })).describe("The behavioral questions that can be asked in the interview"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low","medium","high"]).describe("The severity of the skill gap")
    })).describe("The skill gaps that the candidate has"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe("The focus of the preparation plan for that day"),
        tasks: z.array(z.string()).describe("The tasks to be done for that day")
    })).describe("The preparation plan for the candidate to improve their skills and prepare for the interview")

});

// gemini docs -> structured output -> json schema, zod to json schema
async function generateReport({resume, Selfdescription, JobDescription}){

    const prompt = `Generate an interview report for the candidate based on the following information:
                    Resume: ${resume}
                    Self Description: ${Selfdescription}
                    Job Description: ${JobDescription} `

    const response = await ai.generateText({
        model: "gemini-2.5-flash",
        content: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(reportSchema),
        },
    })

    console.log(JSON.parse(response.text));
}

module.exports = generateReport