import React from 'react';
import ProjectStructureRenderer from '../ProjectStructureRenderer';
import ErrorBoundary from '../ErrorBoundary';

const ProjectStructureTab = ({ content, viewMode }) => {
  if (viewMode === 'code') {
    return (
      <div className="code-view-container">
        <div className="code-header">
          <h3>📁 Project Structure Source</h3>
          <p>Folder structure and file organization</p>
        </div>
        <pre className="code-content">
          {content || 'No project structure content available'}
        </pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="project-structure-container">
        {content && content.trim() ? (
          <ProjectStructureRenderer content={content} />
        ) : (
          <div className="content-placeholder">
            <h3>📁 Project Structure</h3>
            <p>Project structure is being generated or not available.</p>
            <div className="placeholder-content">
              <h4>Expected Content:</h4>
              <ul>
                <li>Clean Architecture folder structure</li>
                <li>SOLID principles implementation</li>
                <li>Industry best practices</li>
                <li>Scalable project organization</li>
                <li>Configuration and environment files</li>
              </ul>
              
              <div className="structure-preview">
                <div className="folder-tree">
                  <div className="folder-item">
                    <span className="folder-icon">📁</span> src/
                    <div className="folder-children">
                      <div className="folder-item">
                        <span className="folder-icon">📁</span> components/
                      </div>
                      <div className="folder-item">
                        <span className="folder-icon">📁</span> pages/
                      </div>
                      <div className="folder-item">
                        <span className="folder-icon">📁</span> services/
                      </div>
                      <div className="folder-item">
                        <span className="folder-icon">📁</span> utils/
                      </div>
                      <div className="folder-item">
                        <span className="file-icon">📄</span> App.js
                      </div>
                      <div className="folder-item">
                        <span className="file-icon">📄</span> index.js
                      </div>
                    </div>
                  </div>
                  <div className="folder-item">
                    <span className="folder-icon">📁</span> public/
                  </div>
                  <div className="folder-item">
                    <span className="file-icon">📄</span> package.json
                  </div>
                  <div className="folder-item">
                    <span className="file-icon">📄</span> README.md
                  </div>
                </div>
                <p><em>Sample project structure</em></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ProjectStructureTab;