import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

const SQLSchemaTab = ({ content, viewMode }) => {
  console.log('🔍 SQL Content Debug:', {
    hasContent: !!content,
    contentType: typeof content,
    contentLength: content?.length || 0,
    contentPreview: content?.substring(0, 100) || 'No content'
  });

  if (viewMode === 'code') {
    return (
      <div className="code-view-container">
        <div className="code-header">
          <h3>🗄️ SQL Schema Source</h3>
          <p>Database schema and table definitions</p>
        </div>
        <pre className="code-content">
          {content || 'No SQL schema content available'}
        </pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="sql-container">
        {content ? (
          <div className="sql-fallback-container">
            <div className="sql-header">
              <h3>🗄️ SQL Database Schema</h3>
              <p>Database tables, relationships, and constraints</p>
            </div>
            <pre className="sql-content">
              {content}
            </pre>
          </div>
        ) : (
          <div className="content-placeholder">
            <h3>🗄️ SQL Database Schema</h3>
            <p>SQL schema is being generated or not available.</p>
            <div className="placeholder-content">
              <h4>Expected Content:</h4>
              <ul>
                <li>Database table definitions</li>
                <li>Primary and foreign key relationships</li>
                <li>Indexes and constraints</li>
                <li>Sample data insertion scripts</li>
                <li>Database migration scripts</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SQLSchemaTab;