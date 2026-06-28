const pdfParse = require('pdf-parse')
const generateReport = require("../services/ai.service")
const ReportModel = require('../models/report.model');

function mapAiReportToModel(reportByAI, { resume, selfDescription, jobDescription, userId }) {
    return {
        user: userId,
        resume,
        JobDescription: jobDescription,
        SelfDescription: selfDescription,
        MatchScore: reportByAI.matchScore,
        TechnicalQuestions: reportByAI.technicalQuestions,
        BehaviouralQuestions: reportByAI.behavioralQuestions,
        SkillGaps: reportByAI.skillGaps,
        PreparationPlan: reportByAI.preparationPlan,
    };
}

async function generateReportController(req, res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const { selfDescription, jobDescription } = req.body;

    const reportByAI = await generateReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    });

    const report = await ReportModel.create(
        mapAiReportToModel(reportByAI, {
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            userId: req.user.id,
        })
    );

    res.status(201).json({
        message: "Job interview report generated successfully",
        report,
    });
}

module.exports = { generateReportController }

