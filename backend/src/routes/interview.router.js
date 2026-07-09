const express = require('express');
const authMiddleware =require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/multer.middleware')


const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description, resume pdf, and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware.authUser, upload.single('resume'), interviewController.generateReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf from the report.
 * @access private
 */
interviewRouter.post("/resume/pdf/:reportId", authMiddleware.authUser, interviewController.generateResumePdfController)



module.exports = interviewRouter;
