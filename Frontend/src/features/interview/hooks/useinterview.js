import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  generateResumePdf as generateResumePdfAPI,
  deleteInterviewReport as deleteInterviewReportAPI,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    matchScore,
    setMatchScore,
    reportTitle,
    setReportTitle,
    error,
    setError,
  } = context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    setError(null);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      const interviewReport = response.interviewReport;
      setReport(interviewReport);

      // Extract matchScore and reportTitle from the response
      if (interviewReport) {
        setMatchScore(interviewReport.matchScore || null);
        setReportTitle(
          interviewReport.reportTitle ||
            `Interview Report - ${new Date().toLocaleDateString()}`
        );
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error generating report";
      setError(errorMessage);
      console.error("Error generating interview report:", errorMessage);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    setError(null);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      const interviewReport = response.interviewReport;
      setReport(interviewReport);

      // Extract matchScore and reportTitle
      if (interviewReport) {
        setMatchScore(interviewReport.matchScore || null);
        setReportTitle(
          interviewReport.reportTitle ||
            `Interview Report - ${new Date().toLocaleDateString()}`
        );
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error fetching report";
      setError(errorMessage);
      console.error("Error fetching interview report by id:", errorMessage);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport;
  };

  const getReports = async () => {
    setLoading(true);
    setError(null);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error fetching reports";
      setError(errorMessage);
      console.error("Error fetching all interview reports:", errorMessage);
    } finally {
      setLoading(false);
    }
    return response?.interviewReports;
  };

  const clearReport = () => {
    setReport(null);
    setMatchScore(null);
    setReportTitle(null);
    setError(null);
  };

  const deleteReport = async (interviewId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInterviewReportAPI(interviewId);
      setReport(null);
      setMatchScore(null);
      setReportTitle(null);
      setReports((prevReports) => prevReports.filter((item) => item._id !== interviewId));
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error deleting report";
      setError(errorMessage);
      console.error("Error deleting interview report:", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateResumePdf = async ({ interviewReportId }) => {
    setLoading(true);
    let response = null;
    try{
      response = await generateResumePdfAPI({ interviewReportId });
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    }
    catch(err){
      console.log("Error generating resume PDF:", err.message);
    }
    finally {
      setLoading(false);
    }
  }
  

  return {
    loading,
    report,
    reports,
    matchScore,
    reportTitle,
    error,
    generateReport,
    getReportById,
    getReports,
    clearReport,
    deleteReport,
    generateResumePdf,
  };
};
