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




module.exports = interviewRouter;
