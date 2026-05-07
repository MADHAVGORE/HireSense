const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // ✅ pdfParse is a function - call it directly
    const resumeContent = await pdfParse(req.file.buffer);

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAI = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user?.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAI,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });

  } catch (err) {
    console.error("Controller error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateInterviewReportController };