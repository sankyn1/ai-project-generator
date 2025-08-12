import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import ErrorBoundary from '../ErrorBoundary';

const TechStackTab = ({ content, viewMode }) => {
  if (viewMode === 'code') {
    return (
      <div className="code-view-container">
        <div className="code-header">
          <h3>⚙️ Tech Stack Source</h3>
          <p>Technology recommendations and justifications</p>
        </div>
        <pre className="code-content">
          {content || 'No tech stack content available'}
        </pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="tech-stack-container">
        {content && content.trim() ? (
          <div className="tech-stack-content">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <div className="content-placeholder">
            <h3>⚙️ Technology Stack Recommendations</h3>
            <p>Technology stack recommendations are being generated or not available.</p>
            <div className="placeholder-content">
              <h4>Expected Content:</h4>
              <ul>
                <li>Frontend framework recommendations</li>
                <li>Backend technology choices</li>
                <li>Database selection and rationale</li>
                <li>Cloud platform suggestions</li>
                <li>Development tools and libraries</li>
                <li>Performance and scalability considerations</li>
              </ul>
              
              <div className="tech-preview">
                <div className="tech-category">
                  <h4>🎨 Frontend</h4>
                  <div className="tech-items">
                    <span className="tech-item">React</span>
                    <span className="tech-item">TypeScript</span>
                    <span className="tech-item">Tailwind CSS</span>
                  </div>
                </div>
                
                <div className="tech-category">
                  <h4>⚡ Backend</h4>
                  <div className="tech-items">
                    <span className="tech-item">Node.js</span>
                    <span className="tech-item">Express</span>
                    <span className="tech-item">JWT Auth</span>
                  </div>
                </div>
                
                <div className="tech-category">
                  <h4>🗄️ Database</h4>
                  <div className="tech-items">
                    <span className="tech-item">PostgreSQL</span>
                    <span className="tech-item">Redis</span>
                  </div>
                </div>
                
                <div className="tech-category">
                  <h4>☁️ Cloud & DevOps</h4>
                  <div className="tech-items">
                    <span className="tech-item">AWS</span>
                    <span className="tech-item">Docker</span>
                    <span className="tech-item">GitHub Actions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TechStackTab;