import React, { useState } from 'react';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown, Info, Code, TestTube, Settings, Database, Shield } from 'lucide-react';

const ProjectStructureRenderer = ({ content }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const parseProjectStructure = (text) => {
    // Safety check for text input
    if (!text || typeof text !== 'string') {
      return [];
    }

    const lines = text.split('\n');
    const structure = [];
    let inFolderTree = false;
    
    lines.forEach((line, index) => {
      if (!line || line.trim() === '') return;
      
      try {
        // Detect start of folder tree
        if (line.includes('├──') || line.includes('└──') || line.includes('│')) {
          inFolderTree = true;
        }
        
        // Parse folder tree lines
        if (inFolderTree && (line.includes('├──') || line.includes('└──') || line.includes('│'))) {
          const treeMatch = line.match(/^(.*)([├└]──|│\s+)(.+)$/);
          if (treeMatch) {
            const [, prefix, connector, name] = treeMatch;
            const level = Math.floor(prefix.length / 4);
            const cleanName = name.trim().replace(/\/$/, '');
            
            if (cleanName) {
              const isFolder = name.endsWith('/') || 
                              !name.includes('.') ||
                              ['src', 'components', 'pages', 'utils', 'services', 'tests', 'config', 'public', 'assets', 'docs'].some(folder => 
                                cleanName.toLowerCase().includes(folder));
              
              structure.push({
                id: `item-${index}`,
                name: cleanName,
                level: Math.max(0, level),
                isFolder,
                description: ''
              });
            }
          }
        }
        // Also try to parse simple indented structure
        else {
          const indentMatch = line.match(/^(\s*)([\|\-\+\`]*)\s*(.+)$/);
          if (indentMatch) {
            const [, indent, symbols, name] = indentMatch;
            const level = Math.floor((indent?.length || 0) / 2) + ((symbols?.length || 0) > 0 ? 1 : 0);
            const cleanName = name?.replace(/[\/\|\-\+\`]/g, '').trim() || '';
            
            if (cleanName && level > 0) {
              const isFolder = cleanName.includes('/') || cleanName.endsWith('/') || 
                              ['src', 'components', 'pages', 'utils', 'services', 'tests', 'config', 'public', 'assets'].some(folder => 
                                cleanName.toLowerCase().includes(folder));
              
              structure.push({
                id: `item-${index}`,
                name: cleanName,
                level: Math.max(0, level),
                isFolder,
                description: ''
              });
            }
          }
        }
      } catch (error) {
        console.warn('Error parsing line:', line, error);
      }
    });
    
    return structure;
  };

  const getFileIcon = (name, isFolder) => {
    if (isFolder) {
      return expandedFolders.has(name) ? <FolderOpen size={16} /> : <Folder size={16} />;
    }
    
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code size={16} color="#f7df1e" />;
      case 'json':
        return <Settings size={16} color="#00d8ff" />;
      case 'test':
      case 'spec':
        return <TestTube size={16} color="#4caf50" />;
      case 'sql':
        return <Database size={16} color="#336791" />;
      case 'env':
        return <Shield size={16} color="#ff9800" />;
      default:
        return <File size={16} />;
    }
  };

  const renderMarkdownContent = (text) => {
    if (!text) return '';
    
    // Simple markdown to HTML conversion for project structure
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    html = '<p>' + html + '</p>';
    
    // Group list items
    html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
      const items = match.match(/<li>.*?<\/li>/g);
      return items ? '<ul>' + items.join('') + '</ul>' : match;
    });

    return html;
  };

  const architecturePrinciples = [
    {
      title: "Clean Architecture",
      description: "Separation of concerns with clear boundaries between layers",
      icon: "🏗️"
    },
    {
      title: "SOLID Principles",
      description: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
      icon: "🔧"
    },
    {
      title: "Domain-Driven Design",
      description: "Business logic separated from infrastructure concerns",
      icon: "🎯"
    },
    {
      title: "Scalable Structure",
      description: "Organized for team collaboration and future growth",
      icon: "📈"
    }
  ];

  const structure = parseProjectStructure(content);

  return (
    <div className="project-structure-renderer">
      <div className="structure-overview">
        <h3>🏗️ Project Architecture Overview</h3>
        
        <div className="architecture-principles">
          {architecturePrinciples.map((principle, index) => (
            <div key={index} className="principle-card">
              <div className="principle-icon">{principle.icon}</div>
              <div className="principle-content">
                <h4>{principle.title}</h4>
                <p>{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="structure-content">
        <div className="structure-header">
          <h3>📁 Project Structure</h3>
          <p>Industry best practices following clean architecture principles</p>
        </div>

        <div className="folder-tree">
          {structure.length > 0 ? (
            structure.map((item) => (
              <div 
                key={item.id} 
                className={`tree-item level-${item.level} ${item.isFolder ? 'folder' : 'file'}`}
                style={{ paddingLeft: `${item.level * 20}px` }}
              >
                <div className="item-content" onClick={() => item.isFolder && toggleFolder(item.name)}>
                  {item.isFolder && (
                    <span className="expand-icon">
                      {expandedFolders.has(item.name) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                  <span className="item-icon">
                    {getFileIcon(item.name, item.isFolder)}
                  </span>
                  <span className="item-name">{item.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="structure-text">
              <div className="markdown-content" dangerouslySetInnerHTML={{ 
                __html: renderMarkdownContent(content) 
              }} />
            </div>
          )}
        </div>

        <div className="structure-benefits">
          <h4>🎯 Key Benefits</h4>
          <div className="benefits-grid">
            <div className="benefit-item">
              <strong>Maintainability</strong>
              <p>Clear separation makes code easy to modify and extend</p>
            </div>
            <div className="benefit-item">
              <strong>Testability</strong>
              <p>Isolated components enable comprehensive testing</p>
            </div>
            <div className="benefit-item">
              <strong>Scalability</strong>
              <p>Structure supports team growth and feature expansion</p>
            </div>
            <div className="benefit-item">
              <strong>Collaboration</strong>
              <p>Organized structure improves team productivity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStructureRenderer;