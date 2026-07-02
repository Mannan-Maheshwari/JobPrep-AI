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

async function getReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

module.exports = { 
    generateReportController,
    getReportByIdController,
    getAllReportsController
 }

