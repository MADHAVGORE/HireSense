const express = require('express');
const authMiddleware = require("../middleware/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middleware/file.middleware")


const interviewRouter = express.Router();


/**
 * @route POST /api/interview
 * @description Genearte new interview report on the basis of user self description, resume pdf and jos description
 * @access Private
 */

interviewRouter.post(
  "/", authMiddleware.authUser, upload.single("resume"),interviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interview id
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);


/**
 * @route GET /api/interview/resume/pdf
 * @description Generate resume pdf based on interview report and download it.
 * @access Private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

/**
 * @route DELETE /api/interview/:interviewId
 * @description Delete interview report by interview id
 * @access Private
 */
interviewRouter.delete("/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewReportController);

module.exports = interviewRouter;