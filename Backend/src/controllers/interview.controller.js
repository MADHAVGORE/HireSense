const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {

  const resumeContent = await (new pdfParse.PDFParse(Uint8Array(req.file.buffer))).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAI = await generateInterviewReport({
    resume:resumeContent.text,
    selfDescription,
    jobDescription
  })

  const interviewReport = await InterviewReportModel.create({
    user:req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAI
  })

  res.status(201).json({
    message:"Interview report generated successfully",
    interviewReport
  })
}

module.exports = { generateInterviewReportController };
