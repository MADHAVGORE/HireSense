import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [matchScore, setMatchScore] = useState(null);
  const [reportTitle, setReportTitle] = useState(null);
  const [error, setError] = useState(null);

  return (
    <InterviewContext.Provider
      value={{
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
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
