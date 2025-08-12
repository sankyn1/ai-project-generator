import React, { useState } from 'react';
import { ExternalLink, Github, Star, Globe, Book, Code, Users, Award, TrendingUp, Settings } from 'lucide-react';

const ReferencesRenderer = ({ content }) => {
  const [activeCategory, setActiveCategory] = useState('repositories');

  const parseReferences = (text) => {
    const references = {
      repositories: [],
      websites: [],
      architecture: [],
      learning: [],
      tools: [],
      industry: []
    };

    // Extract GitHub repositories
    const repoMatches = text.match(/github\.com\/[^\s\)]+/g);
    if (repoMatches) {
      repoMatches.forEach(repo => {
        references.repositories.push({
          url: `https://${repo}`,
          name: repo.split('/').pop(),
          description: 'Open source project with similar functionality'
        });
      });
    }

    // Extract website URLs
    const websiteMatches = text.match(/https?:\/\/[^\s\)]+/g);
    if (websiteMatches) {
      websiteMatches.forEach(url => {
        if (!url.includes('github.com')) {
          references.websites.push({
            url,
            name: new URL(url).hostname,
            description: 'Live example implementation'
          });
        }
      });
    }

    // Parse content sections
    const sections = text.split(/#{1,3}\s+/);
    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        const title = lines[0].toLowerCase();
        
        if (title.includes('architecture') || title.includes('pattern')) {
          references.architecture.push(...extractItems(section));
        } else if (title.includes('learning') || title.includes('tutorial')) {
          references.learning.push(...extractItems(section));
        } else if (title.includes('tool') || title.includes('library')) {
          references.tools.push(...extractItems(section));
        } else if (title.includes('industry') || title.includes('company')) {
          references.industry.push(...extractItems(section));
        }
      }
    });

    return references;
  };

  const extractItems = (section) => {
    const items = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const item = trimmed.substring(1).trim();
        const urlMatch = item.match(/(https?:\/\/[^\s\)]+)/);
        
        items.push({
          name: item.replace(/(https?:\/\/[^\s\)]+)/g, '').trim(),
          url: urlMatch ? urlMatch[1] : null,
          description: item
        });
      }
    });
    
    return items;
  };

  const categories = [
    { id: 'repositories', label: 'GitHub Repos', icon: Github, color: '#333' },
    { id: 'websites', label: 'Live Sites', icon: Globe, color: '#0066cc' },
    { id: 'architecture', label: 'Architecture', icon: Code, color: '#ff6b35' },
    { id: 'learning', label: 'Learning', icon: Book, color: '#4caf50' },
    { id: 'tools', label: 'Tools', icon: Settings, color: '#9c27b0' },
    { id: 'industry', label: 'Industry', icon: TrendingUp, color: '#ff9800' }
  ];

  const references = parseReferences(content);

  const renderReferenceCard = (item, category) => {
    const categoryData = categories.find(cat => cat.id === category);
    const Icon = categoryData?.icon || ExternalLink;
    
    return (
      <div key={item.url || item.name} className="reference-card">
        <div className="card-header">
          <Icon size={20} color={categoryData?.color} />
          <h4>{item.name}</h4>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="external-link">
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        <p className="card-description">{item.description}</p>
        {category === 'repositories' && (
          <div className="repo-stats">
            <span className="stat">
              <Star size={14} />
              Popular
            </span>
            <span className="stat">
              <Users size={14} />
              Active
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="references-renderer">
      <div className="references-header">
        <h3>🔗 Project References & Resources</h3>
        <p>Curated collection of similar projects, tools, and learning resources</p>
      </div>

      <div className="category-tabs">
        {categories.map(category => {
          const Icon = category.icon;
          const count = references[category.id]?.length || 0;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              style={{ '--category-color': category.color }}
            >
              <Icon size={16} />
              {category.label}
              {count > 0 && <span className="count-badge">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="references-content">
        <div className="category-header">
          <h4>{categories.find(cat => cat.id === activeCategory)?.label} References</h4>
        </div>

        <div className="references-grid">
          {references[activeCategory]?.length > 0 ? (
            references[activeCategory].map(item => renderReferenceCard(item, activeCategory))
          ) : (
            <div className="no-references">
              <p>No specific {activeCategory} references found in the generated content.</p>
              <div className="fallback-content">
                <h4>General {activeCategory} recommendations:</h4>
                {activeCategory === 'repositories' && (
                  <div className="fallback-items">
                    <div className="fallback-item">
                      <Github size={16} />
                      <span>Search GitHub for similar projects using your tech stack</span>
                    </div>
                    <div className="fallback-item">
                      <Star size={16} />
                      <span>Look for repositories with high star counts and recent activity</span>
                    </div>
                  </div>
                )}
                {activeCategory === 'websites' && (
                  <div className="fallback-items">
                    <div className="fallback-item">
                      <Globe size={16} />
                      <span>Research competitors and similar applications</span>
                    </div>
                    <div className="fallback-item">
                      <Award size={16} />
                      <span>Study award-winning designs and implementations</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {references[activeCategory]?.length === 0 && (
          <div className="raw-content">
            <h4>📄 Full Reference Content</h4>
            <div className="content-text">
              {content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferencesRenderer;