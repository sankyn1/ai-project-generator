import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import RequirementsInput from './components/RequirementsInput';
import GenerationResults from './components/GenerationResults';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyManager from './components/ApiKeyManager';
import './App.css';

function App() {
  const [requirements, setRequirements] = useState([]);
  const [techPreferences, setTechPreferences] = useState({});
  const [projectType, setProjectType] = useState('web-application');
  const [generationResults, setGenerationResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    provider: 'openai',
    model: 'gpt-4',
    apiKey: '',
    baseUrl: ''
  });

  const handleGenerate = async (reqData) => {
    if (!apiConfig.apiKey && apiConfig.provider !== 'ollama') {
      alert('Please configure your API key first');
      return;
    }

    setIsGenerating(true);
    setRequirements(reqData.requirements);
    setTechPreferences(reqData.techPreferences);
    setProjectType(reqData.projectType);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reqData,
          apiConfig
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const results = await response.json();
      setGenerationResults(results);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setRequirements([]);
    setTechPreferences({});
    setProjectType('web-application');
    setGenerationResults(null);
  };

  return (
    <Router>
      <div className="App">
        <Header>
          <ApiKeyManager onApiConfigChange={setApiConfig} />
        </Header>
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  {!generationResults && !isGenerating && (
                    <RequirementsInput 
                      onGenerate={handleGenerate} 
                      apiConfig={apiConfig}
                    />
                  )}
                  
                  {isGenerating && <LoadingSpinner />}
                  
                  {generationResults && (
                    <GenerationResults 
                      results={generationResults}
                      onReset={handleReset}
                      apiConfig={apiConfig}
                    />
                  )}
                </>
              } 
            />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;