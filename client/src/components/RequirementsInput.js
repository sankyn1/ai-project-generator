import React, { useState } from 'react';
import { Plus, Trash2, Zap, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUpload from './FileUpload';
import TextPaste from './TextPaste';

const RequirementsInput = ({ onGenerate, apiConfig }) => {
  const [requirements, setRequirements] = useState(['']);
  const [projectType, setProjectType] = useState('web-application');
  const [techPreferences, setTechPreferences] = useState({
    frontend: '',
    backend: '',
    database: '',
    cloud: ''
  });
  const [uploadMethod, setUploadMethod] = useState('manual');

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const updateRequirement = (index, value) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      const updated = requirements.filter((_, i) => i !== index);
      setRequirements(updated);
    }
  };

  const handleRequirementsExtracted = (extractedRequirements) => {
    // Replace existing requirements with extracted ones, or add to existing non-empty ones
    const existingRequirements = requirements.filter(req => req.trim() !== '');
    const newRequirements = existingRequirements.length > 0 
      ? [...existingRequirements, ...extractedRequirements]
      : extractedRequirements;
    
    setRequirements(newRequirements);
    setUploadMethod('manual'); // Switch back to manual editing
    
    // Show success message
    toast.success(`Added ${extractedRequirements.length} requirements!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validRequirements = requirements.filter(req => req.trim() !== '');
    
    if (validRequirements.length === 0) {
      toast.error('Please add at least one requirement');
      return;
    }

    if (!apiConfig.apiKey && apiConfig.provider !== 'ollama') {
      toast.error('Please configure your API key first using the API Config button');
      return;
    }

    onGenerate({
      requirements: validRequirements,
      projectType,
      techPreferences
    });
  };

  return (
    <div className="requirements-container">
      <div className="hero-section">
        <h1>AI Project Generator</h1>
        <p>Transform your requirements into comprehensive project deliverables</p>
      </div>

      <form onSubmit={handleSubmit} className="requirements-form">
        <div className="form-section">
          <h2>Project Requirements</h2>
          <p>Add your requirements using any of these methods</p>
          
          <div className="upload-methods">
            <button
              type="button"
              onClick={() => setUploadMethod('manual')}
              className={`upload-method-tab ${uploadMethod === 'manual' ? 'active' : ''}`}
            >
              ✏️ Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`upload-method-tab ${uploadMethod === 'file' ? 'active' : ''}`}
            >
              <Upload size={16} />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('paste')}
              className={`upload-method-tab ${uploadMethod === 'paste' ? 'active' : ''}`}
            >
              <FileText size={16} />
              Paste Text
            </button>
          </div>

          {uploadMethod === 'file' && (
            <FileUpload onRequirementsExtracted={handleRequirementsExtracted} />
          )}

          {uploadMethod === 'paste' && (
            <TextPaste onRequirementsExtracted={handleRequirementsExtracted} />
          )}

          {uploadMethod === 'manual' && (
            <div className="manual-requirements">
              {requirements.map((requirement, index) => (
                <div key={index} className="requirement-input-group">
                  <textarea
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}: e.g., User authentication with email and password`}
                    className="requirement-input"
                    rows="2"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addRequirement}
                className="add-requirement-btn"
              >
                <Plus size={16} />
                Add Requirement
              </button>
            </div>
          )}

          {requirements.filter(req => req.trim() !== '').length > 0 && (
            <div className="requirements-summary">
              <p>📋 Total requirements: <strong>{requirements.filter(req => req.trim() !== '').length}</strong></p>
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Project Type</h2>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="project-type-select"
          >
            <option value="web-application">Web Application</option>
            <option value="mobile-app">Mobile App</option>
            <option value="desktop-app">Desktop Application</option>
            <option value="api-service">API Service</option>
            <option value="e-commerce">E-commerce Platform</option>
            <option value="cms">Content Management System</option>
            <option value="dashboard">Analytics Dashboard</option>
          </select>
        </div>

        <div className="form-section">
          <h2>Technology Preferences (Optional)</h2>
          <div className="tech-preferences">
            <input
              type="text"
              placeholder="Frontend (e.g., React, Vue, Angular)"
              value={techPreferences.frontend}
              onChange={(e) => setTechPreferences({...techPreferences, frontend: e.target.value})}
              className="tech-input"
            />
            <input
              type="text"
              placeholder="Backend (e.g., Node.js, Python, Java)"
              value={techPreferences.backend}
              onChange={(e) => setTechPreferences({...techPreferences, backend: e.target.value})}
              className="tech-input"
            />
            <input
              type="text"
              placeholder="Database (e.g., PostgreSQL, MongoDB)"
              value={techPreferences.database}
              onChange={(e) => setTechPreferences({...techPreferences, database: e.target.value})}
              className="tech-input"
            />
            <input
              type="text"
              placeholder="Cloud Platform (e.g., AWS, Azure, GCP)"
              value={techPreferences.cloud}
              onChange={(e) => setTechPreferences({...techPreferences, cloud: e.target.value})}
              className="tech-input"
            />
          </div>
        </div>

        <div className="generate-section">
          {apiConfig.provider && (
            <div className="current-config">
              <span>Using: {apiConfig.provider} - {apiConfig.model}</span>
              {!apiConfig.apiKey && apiConfig.provider !== 'ollama' && (
                <span className="config-warning">⚠️ API key required</span>
              )}
            </div>
          )}
          <button type="submit" className="generate-btn">
            <Zap size={20} />
            Generate Project Deliverables
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequirementsInput;