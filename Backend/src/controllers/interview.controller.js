const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report on the basis of user self description, resume pdf and jos description.
 */
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

/**
 * @description Controller to get interview report by interview id.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await InterviewReportModel.findOne({
    _id: interviewId,
    user: req.user?.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await InterviewReportModel.find({
    user: req.user?.id,
  })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -updatedAt -technicalQuestions -behaviourQuestions -skillGaps -preparationPlan",
    ); // Exclude sensitive content for listing

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport = await InterviewReportModel.findById(interviewReportId);
  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  const {resume, jobDescription, selfDescription} = interviewReport;

  const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription});
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
  });
  res.send(pdfBuffer);
}

async function deleteInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await InterviewReportModel.findOneAndDelete({
      _id: interviewId,
      user: req.user?.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    res.status(200).json({
      message: "Interview report deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  deleteInterviewReportController
};
