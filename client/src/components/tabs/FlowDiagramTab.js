import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import ErrorBoundary from '../ErrorBoundary';

const FlowDiagramTab = ({ content, viewMode }) => {
  const [mermaidSvg, setMermaidSvg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (viewMode === 'rendered' && content) {
      renderMermaidDiagram();
    }
  }, [content, viewMode]);

  const renderMermaidDiagram = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mermaidCode = extractMermaidCode(content);
      if (mermaidCode) {
        console.log('🔍 Mermaid code to render:', mermaidCode);
        
        const cleanCode = mermaidCode
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();
        
        const { svg } = await mermaid.render('mermaid-diagram-' + Date.now(), cleanCode);
        setMermaidSvg(svg);
      } else {
        setError('No valid Mermaid diagram found in the generated content.');
      }
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      setError(`Diagram rendering failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractMermaidCode = (content) => {
    if (!content || typeof content !== 'string') {
      return null;
    }

    const patterns = [
      /```mermaid\n([\s\S]*?)\n```/,
      /```mermaid([\s\S]*?)```/,
      /```\n(flowchart[\s\S]*?)\n```/,
      /```\n(graph[\s\S]*?)\n```/,
      /(flowchart[\s\S]*?)(?=\n\n|\n#|$)/,
      /(graph[\s\S]*?)(?=\n\n|\n#|$)/
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        let code = match[1].trim();
        code = cleanMermaidSyntax(code);
        
        if (code.includes('flowchart') || code.includes('graph') || code.includes('-->') || code.includes('->')) {
          return code;
        }
      }
    }
    
    if (content.includes('flowchart') || content.includes('graph') || content.includes('-->')) {
      return content.trim();
    }
    
    return null;
  };

  const cleanMermaidSyntax = (code) => {
    if (!code) return code;
    
    try {
      let cleanCode = code
        .replace(/^.*?(flowchart|graph)/i, '$1')
        .replace(/^graph\s+/i, 'flowchart ')
        .replace(/Define Node Styles.*$/gm, '')
        .replace(/style\s+\w+.*$/gm, '')
        .replace(/classDef.*$/gm, '')
        .replace(/([A-Z])\s*-\s*-+>/g, '$1 --> ')
        .replace(/--+>/g, '-->')
        .replace(/\s*-->\s*/g, ' --> ')
        .replace(/([A-Z])\s*\[\s*([^\]]+)\s*\]/g, '$1["$2"]')
        .replace(/([A-Z])\s+([^"\[\-\n]+)(?=\s*-->|\s*$)/g, '$1["$2"]')
        .replace(/[^\w\s\[\](){}":;.,\->\|\n]/g, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/gm, '')
        .trim();
      
      if (!cleanCode.match(/^(flowchart|graph)\s+/i)) {
        cleanCode = 'flowchart TD\n' + cleanCode;
      }
      
      cleanCode = cleanCode.split('\n').filter(line => line.trim()).join('\n');
      return cleanCode;
    } catch (error) {
      console.error('Error cleaning Mermaid syntax:', error);
      return code;
    }
  };

  if (viewMode === 'code') {
    return (
      <div className="code-view-container">
        <div className="code-header">
          <h3>🔄 Flow Diagram Source</h3>
          <p>Mermaid diagram code</p>
        </div>
        <pre className="code-content">
          {content || 'No flow diagram content available'}
        </pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flow-diagram-container">
        {isLoading ? (
          <div className="diagram-loading">
            <div className="spinner"></div>
            <p>Rendering flow diagram...</p>
          </div>
        ) : error ? (
          <div className="diagram-error">
            <h3>⚠️ Diagram Error</h3>
            <p>{error}</p>
            <button onClick={renderMermaidDiagram} className="retry-btn">
              Retry Rendering
            </button>
            <details className="error-details">
              <summary>View Raw Content</summary>
              <pre>{content}</pre>
            </details>
          </div>
        ) : mermaidSvg ? (
          <div 
            className="mermaid-diagram"
            dangerouslySetInnerHTML={{ __html: mermaidSvg }}
          />
        ) : content ? (
          <div className="diagram-loading">
            <p>Preparing diagram...</p>
          </div>
        ) : (
          <div className="content-placeholder">
            <h3>🔄 Flow Diagram</h3>
            <p>Flow diagram is being generated or not available.</p>
            <div className="placeholder-content">
              <h4>Expected Content:</h4>
              <ul>
                <li>User flow diagrams</li>
                <li>System process flows</li>
                <li>Data flow diagrams</li>
                <li>Application workflow</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FlowDiagramTab;