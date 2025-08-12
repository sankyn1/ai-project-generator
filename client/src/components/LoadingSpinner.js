import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <Loader2 size={48} className="spinner" />
        <h2>Generating Your Project Deliverables</h2>
        <p>This may take a few moments while we create your comprehensive documentation...</p>
        
        <div className="loading-steps">
          <div className="step">
            <div className="step-icon">📋</div>
            <span>Analyzing requirements</span>
          </div>
          <div className="step">
            <div className="step-icon">🎨</div>
            <span>Creating design specifications</span>
          </div>
          <div className="step">
            <div className="step-icon">📊</div>
            <span>Generating flow diagrams</span>
          </div>
          <div className="step">
            <div className="step-icon">🗄️</div>
            <span>Building SQL schemas</span>
          </div>
          <div className="step">
            <div className="step-icon">📄</div>
            <span>Compiling documentation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;