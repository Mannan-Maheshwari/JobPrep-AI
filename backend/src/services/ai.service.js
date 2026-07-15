const { GoogleGenAI, Type } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require('puppeteer');

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
        severity: z.string().toLowerCase().pipe(z.enum(["low", "medium", "high"])).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
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
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
    properties: {
        title: { type: Type.STRING, description: "The title of the job for which the interview report is generated" },
        matchScore: { type: Type.INTEGER, description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description" },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                required: ["question", "intention", "answer"],
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
                required: ["question", "intention", "answer"],
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
                required: ["skill", "severity"],
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of this skill gap, i.e. low, medium, or high" }
                }
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: Type.OBJECT,
                required: ["day", "focus", "tasks"],
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

async function generateReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume:${resume},
                    Self Description:${selfDescription},
                    Job Description:${jobDescription},
                    `;

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: geminiResponseSchema,
                    maxOutputTokens: 8192,
                    thinkingConfig: {
                        thinkingBudget: 0   // disable thinking — all tokens go to the actual JSON output
                    }
                }
            });

            const parsed = JSON.parse(response.text);
            console.log("PARSED KEYS:", Object.keys(parsed));
            return ReportSchema.parse(parsed);
        } catch (err) {
            lastError = err;
            const isRetryable = err.status === 503 || err.status === 429;
            if (!isRetryable || attempt === maxRetries) throw err;

            const delayMs = attempt * 1000; // simple linear backoff: 1s, 2s
            console.warn(`Gemini call failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    throw lastError;
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "load" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    });

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume || "not provided"}
                        Self Description: ${selfDescription || "not provided"}
                        Job Description: ${jobDescription || "not provided"}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        If the Job Description is "Not provided", do not tailor the resume to any specific job, and do not include a job description section or reference a specific role/company from a job posting.
                        - Only include sections (e.g. extracurriculars, certifications, projects) if relevant information for that section is present in the provided Resume or Self Description. Never include a section with placeholder or invented content.
                        - Extract the candidate's actual name, work history, education, and skills strictly from the Resume text provided. Never use placeholder names like "John Doe" — if the name cannot be determined from the resume, omit the name field rather than inventing one.
                        - ...(rest of your existing formatting/ATS instructions)
                        - The Resume should be of single page length when converted to PDF. If the content exceeds one page, truncate it appropriately while ensuring that the most relevant information is retained.
                    `;

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(resumePdfSchema),
                }
            });

            const jsonContent = JSON.parse(response.text);
            const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
            return pdfBuffer;
        } catch (err) {
            lastError = err;
            const isRetryable = err.status === 503 || err.status === 429;
            if (!isRetryable || attempt === maxRetries) throw err;

            const delayMs = attempt * 1000;
            console.warn(`Gemini call failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    throw lastError;
}

module.exports = { generateReport, generateResumePdf }


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





