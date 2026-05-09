import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useinterview";
import "../style/home.scss";

const Home = () => {
  const navigate = useNavigate();
  const { generateReport, loading, error, reports, getReports } = useInterview();

  useEffect(() => {
    getReports();
  }, []);

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [notification, setNotification] = useState(null);

  const MAX_DESCRIPTION_LENGTH = 5000;
  const MAX_SELF_DESCRIPTION_LENGTH = 2000;

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSelfDescriptionChange = (e) => {
    setSelfDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setResumeFile(file);
      } else {
        showNotification("Only PDF files are allowed", "error");
        e.target.value = "";
      }
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setResumeFile(null);
    const input = document.getElementById("resume");
    if (input) input.value = "";
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const isFormValid =
    jobDescription.trim().length > 0 &&
    (selfDescription.trim().length > 0 || resumeFile);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const result = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (result) {
        showNotification("Report generated successfully! Redirecting...", "success");
        setTimeout(() => {
          navigate(`/interview/${result._id}`);
        }, 1500);
      }
    } catch (err) {
        
      showNotification(error || "Failed to generate report", "error");
    }
  };

  return (
    <main className="home">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="home-content">
        {/* Header */}
        <div className="header-section">
            {/* <h2>Welcome {user?.username}</h2> */}
          <h1>
            Create Your Custom <span className="highlight-text">Interview Plan</span>
          </h1>
          <p className="subtitle">
            Let our AI analyze the job requirements and your unique profile to build a <br />
            winning strategy
          </p>
          <div className="header-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Form Container */}
        <div className="form-container">
          <form className="plan-form" onSubmit={handleGenerateReport}>
            {/* Left Card - Target Job Description */}
            <div className="plan-card left-card">
              <div className="card-header">
                <div className="card-title-wrapper">
                  <span className="card-icon">🎯</span>
                  <h2>Target Job Description</h2>
                </div>
                <span className="card-badge">Required</span>
              </div>

              <div className="card-content">
                <p className="card-description">
                  Paste the full job description here. E.g., Senior Frontend Engineer at Google, Asantify or for job description
                </p>
                <textarea
                  name="jobDescription"
                  id="jobDescription"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className="input-textarea"
                />
                <div className="char-counter">
                  {jobDescription.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>
            </div>

            {/* Right Card - Your Profile */}
            <div className="plan-card right-card">
              <div className="card-header">
                <div className="card-title-wrapper">
                  <span className="card-icon">👤</span>
                  <h2>Your Profile</h2>
                </div>
                <span className="card-badge">Required</span>
              </div>

              <div className="card-content">
                {/* Resume Upload */}
                <div className="profile-section">
                  <h3>Upload Resume</h3>
                  <div className="upload-container">
                    {resumeFile ? (
                      <div className="file-preview">
                        <div className="file-icon">📄</div>
                        <div className="file-details">
                          <p className="file-name">{resumeFile.name}</p>
                          <p className="file-size">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button
                          className="remove-file-btn"
                          onClick={handleRemoveFile}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          hidden
                          type="file"
                          id="resume"
                          name="resume"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="resume" className="upload-button">
                          <div className="upload-icon-large">📤</div>
                          <p>Click to upload or drag and drop</p>
                          <span className="upload-hint">PDF up to 5 MB</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Self Description */}
                <div className="profile-section">
                  <h3>Quick Self Description</h3>
                  <textarea
                  
                    name="selfDescription"
                    id="selfDescription"
                    placeholder="Briefly describe your experience, skills, and career goals..."
                    value={selfDescription}
                    onChange={handleSelfDescriptionChange}
                    maxLength={MAX_SELF_DESCRIPTION_LENGTH}
                    className="input-textarea"
                  />
                  <div className="char-counter">
                    {selfDescription.length}/{MAX_SELF_DESCRIPTION_LENGTH}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Action Button */}
          <div className="action-section">
            <button
              type="submit"
              className={`generate-button ${loading ? "loading" : ""} ${!isFormValid ? "disabled" : ""}`}
              onClick={handleGenerateReport}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating your strategy...</span>
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  <span>Generate My Interview Strategy</span>
                </>
              )}
            </button>
          </div>

          {/* Recent reports list */}
          {
            reports.length > 0 && (
              <div className="recent-reports-section">
                <h2>Recent Interview Plans</h2>
                <ul className="reports-list">
                  {reports.map((report) => (
                    <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                      <div className="report-info">
                        <h3 className="report-title">{report.title}</h3>
                        <p className="report-date">{new Date(report.createdAt).toLocaleString()}</p>
                        <h3 className="score-label">Match Score {report.matchScore}</h3>
                      </div>
                      
                      <span className="report-arrow">→</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          {/* Footer */}
          <div className="footer-section">
            <p className="footer-text">© Powered by Gept. Important Legal Stuff</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="#terms">Terms of Service</a>
              <span className="separator">•</span>
              <a href="#help">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
