import React from 'react';
import FigmaRenderer from '../FigmaRenderer';
import ErrorBoundary from '../ErrorBoundary';

const FigmaDesignTab = ({ content, viewMode }) => {
  if (viewMode === 'code') {
    return (
      <div className="code-view-container">
        <div className="code-header">
          <h3>🎨 Figma Design Source</h3>
          <p>Design specifications and wireframe descriptions</p>
        </div>
        <pre className="code-content">
          {content || 'No Figma design content available'}
        </pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="figma-container">
        {content && content.trim() ? (
          <FigmaRenderer content={content} />
        ) : (
          <div className="content-placeholder">
            <h3>🎨 Figma Design Specifications</h3>
            <p>Design specifications are being generated or not available.</p>
            <div className="placeholder-content">
              <h4>Expected Content:</h4>
              <ul>
                <li>UI/UX wireframes and mockups</li>
                <li>Component design specifications</li>
                <li>Color schemes and typography</li>
                <li>Responsive design guidelines</li>
                <li>User interaction patterns</li>
              </ul>
              <div className="design-preview">
                <div className="mock-wireframe">
                  <div className="mock-header">Header</div>
                  <div className="mock-content">
                    <div className="mock-sidebar">Sidebar</div>
                    <div className="mock-main">Main Content Area</div>
                  </div>
                  <div className="mock-footer">Footer</div>
                </div>
                <p><em>Sample wireframe layout</em></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FigmaDesignTab;