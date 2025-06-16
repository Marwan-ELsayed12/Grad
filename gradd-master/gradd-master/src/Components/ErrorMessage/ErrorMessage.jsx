import React from 'react';

import './ErrorMessage.css';

const ErrorMessage = ({ 
    title = 'Oops! Something went wrong', 
    message = 'An error occurred while processing your request', 
    onRetry,
    showRetry = true
}) => {
    const Button = ({ onClick, children, variant = "primary" }) => {
  const className = `btn btn-${variant}`;
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

    return (
        <div className="error-container">
            <div className="error-content">
                <h2>{title}</h2>
                <p>{message}</p>
                {showRetry && onRetry && (
                    <Button 
                        variant="primary" 
                        onClick={onRetry}
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;