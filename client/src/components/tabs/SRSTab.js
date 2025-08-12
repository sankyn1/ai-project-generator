import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import ErrorBoundary from '../ErrorBoundary';

const SRSTab = ({ content, viewMode }) => {
    if (viewMode === 'code') {
        return (
            <div className="code-view-container">
                <div className="code-header">
                    <h3>📝 SRS Document Source</h3>
                    <p>Software Requirements Specification in Markdown format</p>
                </div>
                <pre className="code-content">
                    {content || 'No SRS content available'}
                </pre>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="srs-container">
                {content ? (
                    <MarkdownRenderer content={content} />
                ) : (
                    <div className="content-placeholder">
                        <h3>📋 Software Requirements Specification</h3>
                        <p>SRS document is being generated or not available.</p>
                        <div className="placeholder-content">
                            <h4>Expected Content:</h4>
                            <ul>
                                <li>Project overview and objectives</li>
                                <li>Functional requirements</li>
                                <li>Non-functional requirements</li>
                                <li>System architecture overview</li>
                                <li>User stories and acceptance criteria</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default SRSTab;