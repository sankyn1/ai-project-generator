import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const TextPaste = ({ onRequirementsExtracted }) => {
  const [textContent, setTextContent] = useState('');

  const parseTextContent = (content) => {
    if (!content.trim()) return [];

    // Split by common delimiters and clean up
    const requirements = content
      .split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.match(/^[\d\.\-\*\+\s]*$/)) // Remove lines with only numbers/bullets
      .map(line => line.replace(/^[\d\.\-\*\+\s]+/, '').trim()) // Remove leading bullets/numbers
      .filter(line => line.length > 5); // Filter out very short lines

    return requirements;
  };

  const handleParseText = () => {
    if (!textContent.trim()) {
      toast.error('Please enter some text first');
      return;
    }

    const requirements = parseTextContent(textContent);
    
    if (requirements.length === 0) {
      toast.error('No valid requirements found in the text');
      return;
    }

    onRequirementsExtracted(requirements);
    toast.success(`Extracted ${requirements.length} requirements from text`);
    setTextContent(''); // Clear the text area
  };

  return (
    <div className="text-paste-section">
      <h3>📝 Paste Requirements Text</h3>
      <p>Copy and paste your requirements from any source</p>
      
      <textarea
        className="text-paste-area"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder={`Paste your requirements here. Examples:

• User authentication with email and password
• Dashboard with analytics and charts  
• File upload and management system
• Real-time notifications
• Mobile responsive design
• Payment integration with Stripe
• Admin panel for user management

Or paste from any document, email, or specification...`}
      />
      
      <button
        onClick={handleParseText}
        disabled={!textContent.trim()}
        className="parse-text-btn"
      >
        <FileText size={16} />
        Extract Requirements ({textContent.trim() ? parseTextContent(textContent).length : 0} found)
      </button>
    </div>
  );
};

export default TextPaste;