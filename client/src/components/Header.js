import React from 'react';
import { Zap } from 'lucide-react';

const Header = ({ children }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Zap size={24} />
          <span>AI Project Generator</span>
        </div>
        <div className="header-right">
          {children}
          <nav className="nav">
            <a href="https://buymeacoffee.com/shivshankarnamdev" target="_blank" rel="noopener noreferrer" className="support-link">
              ☕ Support
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="#docs">Documentation</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;