import React, { useState, useEffect } from 'react';
import { useInterview } from '../hooks/useinterview';
import "../style/interview.scss";
import { useNavigate, useParams } from 'react-router';

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { report, getReportById, reportTitle, matchScore, loading, error, generateResumePdf } = useInterview();
  const { interviewId } = useParams()

  useEffect(() =>{
    if (interviewId){
        getReportById(interviewId)
    }
  }, [interviewId])

  const reportData = report || {
    technicalQuestions: [],
    behaviourQuestions: [],
    skillGaps: [],
    preparationPlan: [],
  };

  const menuItems = [
    { id: "technical", label: "Technical Questions", icon: "💻", count: reportData.technicalQuestions?.length || 0 },
    { id: "behavioral", label: "Behavioral Questions", icon: "👥", count: reportData.behaviourQuestions?.length || 0 },
    { id: "roadmap", label: "Preparation Plan", icon: "🗺️", count: reportData.preparationPlan?.length || 0 }
  ];

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "low",
      medium: "medium",
      high: "high"
    };
    return colors[severity] || "medium";
  };

  const renderContent = () => {
    if (!report) {
      return (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h2>No Report Generated Yet</h2>
          <p>Generate a report from the home page to see your interview plan.</p>
        </div>
      );
    }

    if (activeSection === "technical") {
      return (
        <div className="questions-container">
          <div className="section-header">
            <h2>Technical Questions</h2>
            <span className="question-count">{reportData.technicalQuestions?.length || 0} questions</span>
          </div>
          <div className="questions-list">
            {reportData.technicalQuestions?.map((item, index) => (
              <div
                key={index}
                className={`question-item ${expandedQuestion === `tech-${index}` ? "expanded" : ""}`}
              >
                <div
                  className="question-header-item"
                  onClick={() => toggleQuestion(`tech-${index}`)}
                >
                  <div className="question-main">
                    <h3>{item.question}</h3>
                    <p className="intention">{item.intention}</p>
                  </div>
                  <span className="expand-icon">{expandedQuestion === `tech-${index}` ? "▼" : "▶"}</span>
                </div>

                {expandedQuestion === `tech-${index}` && (
                  <div className="question-answer">
                    <div className="answer-label">Answer:</div>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeSection === "behavioral") {
      return (
        <div className="questions-container">
          <div className="section-header">
            <h2>Behavioral Questions</h2>
            <span className="question-count">{reportData.behaviourQuestions?.length || 0} questions</span>
          </div>
          <div className="questions-list">
            {reportData.behaviourQuestions?.map((item, index) => (
              <div
                key={index}
                className={`question-item ${expandedQuestion === `behav-${index}` ? "expanded" : ""}`}
              >
                <div
                  className="question-header-item"
                  onClick={() => toggleQuestion(`behav-${index}`)}
                >
                  <div className="question-main">
                    <h3>{item.question}</h3>
                    <p className="intention">{item.intention}</p>
                  </div>
                  <span className="expand-icon">{expandedQuestion === `behav-${index}` ? "▼" : "▶"}</span>
                </div>

                {expandedQuestion === `behav-${index}` && (
                  <div className="question-answer">
                    <div className="answer-label">Answer:</div>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeSection === "roadmap") {
      return (
        <div className="roadmap-container">
          <div className="section-header">
            <h2>Preparation Plan</h2>
            <span className="question-count">{reportData.preparationPlan?.length || 0} days</span>
          </div>
          <div className="roadmap-grid">
            {reportData.preparationPlan?.map((day, index) => (
              <div key={index} className="day-card">
                <div className="day-header">
                  <span className="day-number">Day {day.day}</span>
                </div>
                <h3 className="day-focus">{day.focus}</h3>
                <ul className="day-tasks">
                  {day.tasks?.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="interview-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <h2>Generating your interview plan...</h2>
          <p>Please wait while we analyze your profile.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interview-container">
        <div className="error-state">
          <span className="error-icon">❌</span>
          <h2>Error Loading Report</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-container">
      {/* Report Header with Title and Match Score */}
      {report && (
        <div className="report-header-banner">
          <div className="report-title-section">
            <h1 className="report-title">{report.title}</h1>
            <p className="report-meta">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="match-score-section">
            <div className="match-score-card">
              <span className="score-label">Match Score</span>
              <div className="score-display">
                <span className="score-number">{matchScore || "--"}%</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${matchScore || 0}%` }}></div>
                </div>
              </div>
              <span className="score-description">
                {matchScore >= 75 ? "Excellent" : matchScore >= 50 ? "Good" : matchScore >= 25 ? "Fair" : "Need Improvement"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="interview-grid">
        {/* Left Sidebar - Menu */}
        <aside className="interview-sidebar left-sidebar">
          <div className="sidebar-content">
            <h3 className="sidebar-title">Interview Plan</h3>
            <nav className="menu-list">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setExpandedQuestion(null);
                  }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-count">{item.count}</span>
                </button>
              ))}
            </nav>
            <button
            onClick={()=>{generateResumePdf(interviewId)}} className="generate-resume-btn">
              {/* <span className="btn-icon">📄</span> */}
              <svg height={"1rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
              <span className="btn-text">Generate Resume</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="interview-main">
          {renderContent()}
        </main>

        {/* Right Sidebar - Skill Gaps */}
        <aside className="interview-sidebar right-sidebar">
          <div className="sidebar-content">
            <h3 className="sidebar-title">Skill Gaps</h3>
            <div className="skills-container">
              {reportData.skillGaps?.map((item, index) => (
                <div key={index} className={`skill-tag severity-${getSeverityColor(item.severity)}`}>
                  <span className="skill-name">{item.skill}</span>
                  <span className="severity-badge">{item.severity}</span>
                </div>
              ))}
            </div>

            {reportData.skillGaps?.length > 0 && (
              <div className="focus-areas">
                <h4 className="focus-title">Key Focus Areas</h4>
                <div className="focus-list">
                  <div className="focus-item">
                    <span className="focus-icon">🔴</span>
                    <div>
                      <p className="focus-label">High Priority</p>
                      <p className="focus-count">{reportData.skillGaps?.filter(s => s.severity === "high").length || 0} skills</p>
                    </div>
                  </div>
                  <div className="focus-item">
                    <span className="focus-icon">🟡</span>
                    <div>
                      <p className="focus-label">Medium Priority</p>
                      <p className="focus-count">{reportData.skillGaps?.filter(s => s.severity === "medium").length || 0} skills</p>
                    </div>
                  </div>
                  <div className="focus-item">
                    <span className="focus-icon">🟢</span>
                    <div>
                      <p className="focus-label">Low Priority</p>
                      <p className="focus-count">{reportData.skillGaps?.filter(s => s.severity === "low").length || 0} skills</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
