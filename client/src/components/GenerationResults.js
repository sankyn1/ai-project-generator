import React, { useState, useEffect } from 'react';
import { Download, FileText, Database, Figma, GitBranch, Settings, RotateCcw, Eye, Code, Folder, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import mermaid from 'mermaid';
import ErrorBoundary from './ErrorBoundary';

// Import modular tab components
import {
  SRSTab,
  FlowDiagramTab,
  SQLSchemaTab,
  FigmaDesignTab,
  TechStackTab,
  ProjectStructureTab,
  ReferencesTab
} from './tabs';

const GenerationResults = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('srs');
  const [viewMode, setViewMode] = useState('rendered'); // 'rendered' or 'code'

  useEffect(() => {
    // Initialize Mermaid globally
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif'
    });
  }, []);



  const tabs = [
    { id: 'srs', label: 'SRS Document', icon: FileText, content: results?.srs },
    { id: 'flow', label: 'Flow Diagram', icon: GitBranch, content: results?.flowDiagram },
    { id: 'sql', label: 'SQL Schema', icon: Database, content: results?.sqlSchema },
    { id: 'figma', label: 'Figma Design', icon: Figma, content: results?.figmaDesign },
    { id: 'tech', label: 'Tech Stack', icon: Settings, content: results?.techStack },
    { id: 'structure', label: 'Project Structure', icon: Folder, content: results?.projectStructure },
    { id: 'references', label: 'References', icon: ExternalLink, content: results?.references }
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

  const renderTabContent = () => {
    const content = activeTabData?.content;
    
    switch (activeTab) {
      case 'srs':
        return <SRSTab content={content} viewMode={viewMode} />;
      case 'flow':
        return <FlowDiagramTab content={content} viewMode={viewMode} />;
      case 'sql':
        return <SQLSchemaTab content={content} viewMode={viewMode} />;
      case 'figma':
        return <FigmaDesignTab content={content} viewMode={viewMode} />;
      case 'tech':
        return <TechStackTab content={content} viewMode={viewMode} />;
      case 'structure':
        return <ProjectStructureTab content={content} viewMode={viewMode} />;
      case 'references':
        return <ReferencesTab content={content} viewMode={viewMode} />;
      default:
        return (
          <div className="content-error">
            <h3>⚠️ Unknown Tab</h3>
            <p>The requested tab "{activeTab}" is not recognized.</p>
          </div>
        );
    }
  };

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
              const hasContent = tab.content && tab.content.trim().length > 0;
              const hasError = tab.content && tab.content.includes('Generation failed');
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''} ${hasError ? 'error' : hasContent ? 'has-content' : 'no-content'}`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {hasError ? (
                    <span className="tab-status error">⚠️</span>
                  ) : hasContent ? (
                    <span className="tab-status success">✓</span>
                  ) : (
                    <span className="tab-status pending">⏳</span>
                  )}
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
              <ErrorBoundary>
                {renderTabContent()}
              </ErrorBoundary>
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