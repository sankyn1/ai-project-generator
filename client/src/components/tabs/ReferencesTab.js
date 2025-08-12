import React from 'react';
import ReferencesRenderer from '../ReferencesRenderer';
import ErrorBoundary from '../ErrorBoundary';

const ReferencesTab = ({ content, viewMode }) => {
  if (viewMode === 'code') {
    return (
      <div className="code-view-container">
        <div className="code-header">
          <h3>🔗 References Source</h3>
          <p>Links, resources, and documentation references</p>
        </div>
        <pre className="code-content">
          {content || 'No references content available'}
        </pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="references-container">
        {content && content.trim() ? (
          <ReferencesRenderer content={content} />
        ) : (
          <div className="content-placeholder">
            <h3>🔗 References & Resources</h3>
            <p>References and resources are being generated or not available.</p>
            <div className="placeholder-content">
              <h4>Expected Content:</h4>
              <ul>
                <li>Similar GitHub repositories</li>
                <li>Live website examples</li>
                <li>Architecture patterns and tutorials</li>
                <li>Learning resources and documentation</li>
                <li>Industry tools and libraries</li>
                <li>Best practices and guidelines</li>
              </ul>
              
              <div className="references-preview">
                <div className="reference-category">
                  <h4>📚 Documentation</h4>
                  <div className="reference-items">
                    <div className="reference-item">
                      <span className="reference-icon">📖</span>
                      <span>Official Framework Docs</span>
                    </div>
                    <div className="reference-item">
                      <span className="reference-icon">🎓</span>
                      <span>Best Practices Guide</span>
                    </div>
                  </div>
                </div>
                
                <div className="reference-category">
                  <h4>🔧 Tools & Libraries</h4>
                  <div className="reference-items">
                    <div className="reference-item">
                      <span className="reference-icon">⚡</span>
                      <span>Development Tools</span>
                    </div>
                    <div className="reference-item">
                      <span className="reference-icon">📦</span>
                      <span>Package Managers</span>
                    </div>
                  </div>
                </div>
                
                <div className="reference-category">
                  <h4>🌐 Examples</h4>
                  <div className="reference-items">
                    <div className="reference-item">
                      <span className="reference-icon">💻</span>
                      <span>GitHub Repositories</span>
                    </div>
                    <div className="reference-item">
                      <span className="reference-icon">🌍</span>
                      <span>Live Demos</span>
                    </div>
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

export default ReferencesTab;