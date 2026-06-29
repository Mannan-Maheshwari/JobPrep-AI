const { GoogleGenAI, Type } = require('@google/genai');
const { z } = require('zod');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const ReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});

const geminiResponseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title of the job for which the interview report is generated" },
        matchScore: { type: Type.INTEGER, description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description" },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                }
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                }
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, description: "The severity of this skill gap, i.e. low, medium, or high" }
                }
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc." },
                    tasks: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "List of tasks to be done on this day to follow the preparation plan" 
                    }
                }
            }
        }
    }
};

async function generateReport({resume,selfDescription,jobDescription}) {

    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume:${resume},
                    Self Description:${selfDescription},
                    Job Description:${jobDescription},
                    `

    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseSchema:geminiResponseSchema 
        }
    })

    const parsed = JSON.parse(response.text);
    return ReportSchema.parse(parsed);
}

module.exports = generateReport


// const { GoogleGenAI } = require("@google/genai");
// const {z, config} = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");


// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_API_KEY,
// });

// const reportSchema = z.object({
//     matchScore: z.number().min(0).max(100).describe("The match score between the candidate and the job description"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question that can be asked in the interview"),
//         intention: z.string().describe("The intention of the intervierwer behind asking this question"),
//         answer: z.string().describe("How to answer this question in the interview, what points to cover, what to avoid!!")
//     })).describe("The technical questions that can be asked in the interview"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The behavioral question that can be asked in the interview"),
//         intention: z.string().describe("The intention of the intervierwer behind asking this question"),
//         answer: z.string().describe("How to answer this question in the interview, what points to cover, what to avoid!!")
//     })).describe("The behavioral questions that can be asked in the interview"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill that the candidate is lacking"),
//         severity: z.enum(["low","medium","high"]).describe("The severity of the skill gap")
//     })).describe("The skill gaps that the candidate has"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number of the preparation plan"),
//         focus: z.string().describe("The focus of the preparation plan for that day"),
//         tasks: z.array(z.string()).describe("The tasks to be done for that day")
//     })).describe("The preparation plan for the candidate to improve their skills and prepare for the interview")

// });

// // gemini docs -> structured output -> json schema, zod to json schema
// async function generateReport({resume, Selfdescription, JobDescription}){

//     const prompt = `Generate an interview report for the candidate based on the following information:
//                     Resume: ${resume}
//                     Self Description: ${Selfdescription}
//                     Job Description: ${JobDescription} `

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(reportSchema),
//         },
//     })

//     console.log(JSON.parse(response.text));
// }





