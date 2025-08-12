import React, { useState, useEffect } from 'react';
import { Download, FileText, Database, Figma, GitBranch, Settings, RotateCcw, Eye, Code, Folder, ExternalLink } from 'lucide-react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import mermaid from 'mermaid';
import MarkdownRenderer from './MarkdownRenderer';
import FigmaRenderer from './FigmaRenderer';
import ProjectStructureRenderer from './ProjectStructureRenderer';
import ReferencesRenderer from './ReferencesRenderer';

const GenerationResults = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('srs');
  const [viewMode, setViewMode] = useState('rendered'); // 'rendered' or 'code'
  const [mermaidSvg, setMermaidSvg] = useState('');

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif'
    });
  }, []);

  useEffect(() => {
    // Render Mermaid diagram when flow tab is active
    if (activeTab === 'flow' && viewMode === 'rendered' && results.flowDiagram) {
      renderMermaidDiagram();
    }
  }, [activeTab, viewMode, results.flowDiagram]);

  const renderMermaidDiagram = async () => {
    try {
      // Extract mermaid code from the response
      const mermaidCode = extractMermaidCode(results.flowDiagram);
      if (mermaidCode) {
        console.log('🔍 Mermaid code to render:', mermaidCode);
        
        // Clean up the mermaid code
        const cleanCode = mermaidCode
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();
        
        console.log('🧹 Cleaned mermaid code:', cleanCode);
        
        const { svg } = await mermaid.render('mermaid-diagram-' + Date.now(), cleanCode);
        setMermaidSvg(svg);
      } else {
        console.warn('No mermaid code found in flow diagram');
        setMermaidSvg('<div class="mermaid-error">No valid Mermaid diagram found in the generated content.</div>');
      }
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      console.error('Error details:', error.message);
      setMermaidSvg(`<div class="mermaid-error">
        <h4>Diagram Rendering Error</h4>
        <p>Unable to render the flowchart diagram.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Please check the raw code in the "Code" view.</p>
      </div>`);
    }
  };

  const extractMermaidCode = (content) => {
    if (!content || typeof content !== 'string') {
      return null;
    }

    // Try different patterns to extract mermaid code
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
        
        // Clean up common issues
        code = code
          .replace(/^```mermaid\n?/, '')
          .replace(/\n?```$/, '')
          .replace(/^\n+/, '')
          .replace(/\n+$/, '');
        
        // Clean up Mermaid syntax issues
        code = cleanMermaidSyntax(code);
        
        // Validate it looks like mermaid
        if (code.includes('flowchart') || code.includes('graph') || code.includes('-->') || code.includes('->')) {
          return code;
        }
      }
    }
    
    // If no code block found but content looks like mermaid
    if (content.includes('flowchart') || content.includes('graph') || content.includes('-->')) {
      return content.trim();
    }
    
    return null;
  };

  const cleanMermaidSyntax = (code) => {
    if (!code) return code;
    
    try {
      let cleanCode = code
        // Remove any text before flowchart/graph declaration
        .replace(/^.*?(flowchart|graph)/i, '$1')
        // Fix graph to flowchart
        .replace(/^graph\s+/i, 'flowchart ')
        // Remove style definitions and other invalid content
        .replace(/Define Node Styles.*$/gm, '')
        .replace(/style\s+\w+.*$/gm, '')
        .replace(/classDef.*$/gm, '')
        // Fix common syntax issues
        .replace(/([A-Z])\s*-\s*-+>/g, '$1 --> ')  // Fix "A - -->" patterns
        .replace(/--+>/g, '-->')  // Normalize arrows
        .replace(/\s*-->\s*/g, ' --> ')  // Fix spacing
        // Fix node labels
        .replace(/([A-Z])\s*\[\s*([^\]]+)\s*\]/g, '$1["$2"]')
        .replace(/([A-Z])\s+([^"\[\-\n]+)(?=\s*-->|\s*$)/g, '$1["$2"]')
        // Remove invalid characters
        .replace(/[^\w\s\[\](){}":;.,\->\|\n]/g, '')
        // Clean up whitespace
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/gm, '')
        .trim();
      
      // Ensure proper flowchart declaration
      if (!cleanCode.match(/^(flowchart|graph)\s+/i)) {
        cleanCode = 'flowchart TD\n' + cleanCode;
      }
      
      // Remove empty lines
      cleanCode = cleanCode.split('\n').filter(line => line.trim()).join('\n');
      
      console.log('🧹 Cleaned Mermaid code:', cleanCode);
      return cleanCode;
    } catch (error) {
      console.error('Error cleaning Mermaid syntax:', error);
      return code;
    }
  };

  const tabs = [
    { id: 'srs', label: 'SRS Document', icon: FileText, content: results.srs },
    { id: 'flow', label: 'Flow Diagram', icon: GitBranch, content: results.flowDiagram },
    { id: 'sql', label: 'SQL Schema', icon: Database, content: results.sqlSchema },
    { id: 'figma', label: 'Figma Design', icon: Figma, content: results.figmaDesign },
    { id: 'tech', label: 'Tech Stack', icon: Settings, content: results.techStack },
    { id: 'structure', label: 'Project Structure', icon: Folder, content: results.projectStructure },
    { id: 'references', label: 'References', icon: ExternalLink, content: results.references }
  ];

  const handleExport = async (format) => {
    try {
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const extensions = {
        pdf: 'pdf',
        json: 'json',
        mermaid: 'mmd',
        sql: 'sql'
      };
      
      a.download = `project-deliverables.${extensions[format]}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
      console.error('Export error:', error);
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Generated Project Deliverables</h1>
        <div className="header-actions">
          <div className="export-buttons">
            <button onClick={() => handleExport('pdf')} className="export-btn">
              <Download size={16} />
              PDF
            </button>
            <button onClick={() => handleExport('json')} className="export-btn">
              <Download size={16} />
              JSON
            </button>
            <button onClick={() => handleExport('mermaid')} className="export-btn">
              <Download size={16} />
              Mermaid
            </button>
            <button onClick={() => handleExport('sql')} className="export-btn">
              <Download size={16} />
              SQL
            </button>
          </div>
          <button onClick={onReset} className="reset-btn">
            <RotateCcw size={16} />
            New Project
          </button>
        </div>
      </div>

      <div className="results-content">
        <div className="tabs-container">
          <div className="tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="tab-content">
            <div className="content-header">
              <h2>{activeTabData.label}</h2>
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('rendered')}
                  className={`view-btn ${viewMode === 'rendered' ? 'active' : ''}`}
                >
                  <Eye size={16} />
                  Rendered
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`view-btn ${viewMode === 'code' ? 'active' : ''}`}
                >
                  <Code size={16} />
                  Code
                </button>
              </div>
            </div>
            
            <div className="content-body">
              {viewMode === 'code' ? (
                // Code view - show raw content in editor
                <Editor
                  height="600px"
                  defaultLanguage={
                    activeTab === 'flow' ? 'mermaid' :
                    activeTab === 'sql' ? 'sql' : 'markdown'
                  }
                  value={activeTabData.content}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on'
                  }}
                />
              ) : (
                // Rendered view - show formatted content
                <div className="rendered-content">
                  {activeTab === 'flow' ? (
                    <div className="flow-diagram-container">
                      {mermaidSvg ? (
                        <div 
                          className="mermaid-diagram"
                          dangerouslySetInnerHTML={{ __html: mermaidSvg }}
                        />
                      ) : (
                        <div className="diagram-loading">
                          <p>Rendering diagram...</p>
                        </div>
                      )}
                    </div>
                  ) : activeTab === 'sql' ? (
                    <div className="sql-container">
                      <Editor
                        height="600px"
                        defaultLanguage="sql"
                        value={activeTabData.content}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          wordWrap: 'on',
                          theme: 'vs-dark'
                        }}
                      />
                    </div>
                  ) : activeTab === 'figma' ? (
                    <FigmaRenderer content={activeTabData.content} />
                  ) : activeTab === 'structure' ? (
                    activeTabData.content && activeTabData.content.trim() ? (
                      <ProjectStructureRenderer content={activeTabData.content} />
                    ) : (
                      <div className="content-placeholder">
                        <h3>🏗️ Project Structure</h3>
                        <p>Project structure content is being generated or not available.</p>
                        <div className="placeholder-content">
                          <h4>Expected Content:</h4>
                          <ul>
                            <li>Clean Architecture folder structure</li>
                            <li>SOLID principles implementation</li>
                            <li>Industry best practices</li>
                            <li>Scalable project organization</li>
                          </ul>
                          <p><strong>Debug Info:</strong> Content length: {activeTabData.content?.length || 0}</p>
                        </div>
                      </div>
                    )
                  ) : activeTab === 'references' ? (
                    activeTabData.content && activeTabData.content.trim() ? (
                      <ReferencesRenderer content={activeTabData.content} />
                    ) : (
                      <div className="content-placeholder">
                        <h3>🔗 References & Resources</h3>
                        <p>References content is being generated or not available.</p>
                        <div className="placeholder-content">
                          <h4>Expected Content:</h4>
                          <ul>
                            <li>Similar GitHub repositories</li>
                            <li>Live website examples</li>
                            <li>Architecture patterns</li>
                            <li>Learning resources</li>
                            <li>Industry tools and libraries</li>
                          </ul>
                          <p><strong>Debug Info:</strong> Content length: {activeTabData.content?.length || 0}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    activeTabData.content ? (
                      <MarkdownRenderer content={activeTabData.content} />
                    ) : (
                      <div className="content-error">
                        <p>Content is not available.</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="generation-metadata">
        <p>Generated on: {new Date(results.metadata.generatedAt).toLocaleString()}</p>
        <p>Requirements processed: {results.metadata.requirementsCount}</p>
        <p>Project type: {results.metadata.projectType}</p>
        <div className="support-project">
          <p>💡 Found this helpful? <a href="https://buymeacoffee.com/shivshankarnamdev" target="_blank" rel="noopener noreferrer">☕ Buy me a coffee</a> to support development!</p>
        </div>
      </div>
    </div>
  );
};

export default GenerationResults;