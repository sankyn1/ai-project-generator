import React from 'react';
import { Palette, Type, Layout, Smartphone, Monitor, Tablet } from 'lucide-react';

const FigmaRenderer = ({ content }) => {
  const parseDesignSpecs = (text) => {
    const sections = {
      colors: [],
      typography: [],
      components: [],
      layouts: [],
      screens: []
    };

    // Extract color information
    const colorMatches = text.match(/#[0-9A-Fa-f]{6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
    if (colorMatches) {
      sections.colors = [...new Set(colorMatches)];
    }

    // Extract typography info
    const fontMatches = text.match(/font[^.]*?(\d+px|\d+rem|\d+pt)/gi);
    if (fontMatches) {
      sections.typography = [...new Set(fontMatches)];
    }

    // Extract component mentions
    const componentKeywords = ['button', 'card', 'modal', 'header', 'footer', 'sidebar', 'navigation'];
    componentKeywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[^.]*?[.!]`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        sections.components.push(...matches);
      }
    });

    // Extract screen/page mentions
    const screenKeywords = ['screen', 'page', 'view', 'dashboard', 'login', 'signup', 'profile'];
    screenKeywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[^.]*?[.!]`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        sections.screens.push(...matches);
      }
    });

    return sections;
  };

  const specs = parseDesignSpecs(content);

  return (
    <div className="figma-renderer">
      <div className="design-overview">
        <h3>🎨 Design System Overview</h3>

        {specs.colors.length > 0 && (
          <div className="design-section">
            <h4><Palette size={16} /> Color Palette</h4>
            <div className="color-palette">
              {specs.colors.slice(0, 8).map((color, index) => (
                <div key={index} className="color-swatch">
                  <div
                    className="color-preview"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="color-code">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {specs.typography.length > 0 && (
          <div className="design-section">
            <h4><Type size={16} /> Typography</h4>
            <div className="typography-list">
              {specs.typography.slice(0, 5).map((font, index) => (
                <div key={index} className="typography-item">
                  {font}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="design-section">
          <h4><Layout size={16} /> Responsive Breakpoints</h4>
          <div className="breakpoints">
            <div className="breakpoint">
              <Smartphone size={20} />
              <span>Mobile: 320px - 768px</span>
            </div>
            <div className="breakpoint">
              <Tablet size={20} />
              <span>Tablet: 768px - 1024px</span>
            </div>
            <div className="breakpoint">
              <Monitor size={20} />
              <span>Desktop: 1024px+</span>
            </div>
          </div>
        </div>

        {specs.screens.length > 0 && (
          <div className="design-section">
            <h4>📱 Key Screens</h4>
            <div className="screens-list">
              {specs.screens.slice(0, 6).map((screen, index) => (
                <div key={index} className="screen-item">
                  {screen.replace(/[.!]/g, '')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="design-details">
        <h3>📋 Detailed Specifications</h3>
        <div className="specs-content">
          {content.split('\n').map((line, index) => (
            <p key={index} className="spec-line">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FigmaRenderer;