import React from 'react';

const MarkdownRenderer = ({ content }) => {
  const renderMarkdown = (text) => {
    // Safety check
    if (!text || typeof text !== 'string') {
      return '<p>No content available</p>';
    }

    try {
      // Simple and stable markdown to HTML conversion
      let html = text
        // Headers (handle multiple # patterns)
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold (handle ** and __)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic (be careful not to conflict with bold)
        .replace(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)/g, '<em>$1</em>')
        .replace(/(?<!_)_(?!_)([^_\n]+?)_(?!_)/g, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Numbered lists
        .replace(/^\d+\.\s+(.*$)/gim, '<li class="numbered">$1</li>')
        // Bullet lists (handle *, -, +)
        .replace(/^\*\s+(.*$)/gim, '<li class="bullet">$1</li>')
        .replace(/^-\s+(.*$)/gim, '<li class="bullet">$1</li>')
        .replace(/^\+\s+(.*$)/gim, '<li class="bullet">$1</li>')
        // Line breaks (preserve paragraph structure)
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      // Wrap in paragraph tags
      html = '<p>' + html + '</p>';

      // Fix empty paragraphs
      html = html.replace(/<p><\/p>/g, '');
      html = html.replace(/<p><br><\/p>/g, '');

      // Group consecutive list items
      html = html.replace(/(<li class="bullet">.*?<\/li>)/gs, (match) => {
        const items = match.match(/<li class="bullet">.*?<\/li>/g);
        return items ? '<ul>' + items.join('') + '</ul>' : match;
      });

      html = html.replace(/(<li class="numbered">.*?<\/li>)/gs, (match) => {
        const items = match.match(/<li class="numbered">.*?<\/li>/g);
        return items ? '<ol>' + items.join('') + '</ol>' : match;
      });

      // Clean up list classes
      html = html.replace(/class="bullet"/g, '');
      html = html.replace(/class="numbered"/g, '');

      // Fix multiple consecutive ul/ol tags
      html = html.replace(/<\/ul><ul>/g, '');
      html = html.replace(/<\/ol><ol>/g, '');

      return html;
    } catch (error) {
      console.error('Markdown rendering error:', error);
      return '<pre>' + text + '</pre>';
    }
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;