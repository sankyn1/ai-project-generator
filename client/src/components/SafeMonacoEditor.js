import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const SafeMonacoEditor = ({ 
  height = "600px", 
  defaultLanguage = "sql", 
  value = "", 
  options = {}, 
  onMount,
  onValidate,
  loading 
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Reset error state when value changes
    setHasError(false);
    setErrorMessage('');
  }, [value]);

  const handleEditorMount = (editor, monaco) => {
    try {
      console.log('Monaco Editor mounted successfully');
      if (onMount) {
        onMount(editor, monaco);
      }
    } catch (error) {
      console.error('Error in Monaco Editor onMount:', error);
      setHasError(true);
      setErrorMessage(error.message);
    }
  };

  const handleValidation = (markers) => {
    try {
      if (onValidate) {
        onValidate(markers);
      }
    } catch (error) {
      console.error('Error in Monaco Editor validation:', error);
      setHasError(true);
      setErrorMessage(error.message);
    }
  };

  const handleEditorError = (error) => {
    console.error('Monaco Editor error:', error);
    setHasError(true);
    setErrorMessage(error.message || 'Unknown editor error');
  };

  if (hasError) {
    return (
      <div className="monaco-error-fallback">
        <div className="error-content">
          <h3>🚨 Editor Error</h3>
          <p>The code editor encountered an error and couldn't load properly.</p>
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{errorMessage}</pre>
          </details>
          <div className="fallback-content">
            <h4>Content Preview:</h4>
            <pre className="code-fallback">{value || 'No content available'}</pre>
          </div>
          <button 
            onClick={() => {
              setHasError(false);
              setErrorMessage('');
            }}
            className="retry-editor-btn"
          >
            Retry Editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-monaco-wrapper">
      <Editor
        height={height}
        defaultLanguage={defaultLanguage}
        value={value || `-- No ${defaultLanguage} content available`}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          theme: 'vs-dark',
          automaticLayout: true,
          ...options
        }}
        onMount={handleEditorMount}
        onValidate={handleValidation}
        loading={loading || <div className="editor-loading">Loading Editor...</div>}
        beforeMount={(monaco) => {
          // Configure Monaco before mounting
          try {
            // Set up error handling
            monaco.editor.onDidCreateEditor((editor) => {
              editor.onDidChangeModelContent(() => {
                // Handle content changes if needed
              });
            });
          } catch (error) {
            console.error('Error in Monaco beforeMount:', error);
            handleEditorError(error);
          }
        }}
      />
    </div>
  );
};

export default SafeMonacoEditor;