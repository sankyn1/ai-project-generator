import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🚨 Something went wrong</h2>
            <p>An unexpected error occurred while rendering this component.</p>
            
            <details className="error-details">
              <summary>Error Details (Click to expand)</summary>
              <div className="error-stack">
                <h4>Error:</h4>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                
                <h4>Component Stack:</h4>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </div>
            </details>
            
            <div className="error-actions">
              <button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="retry-btn"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="reload-btn"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;