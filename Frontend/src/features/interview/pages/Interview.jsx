import React, { useState, useEffect } from 'react';
import { useInterview } from '../hooks/useinterview';
import "../style/interview.scss";
import { useNavigate, useParams } from 'react-router';

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { report, getReportById, reportTitle, matchScore, loading, error } = useInterview();
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
