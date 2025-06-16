// Error handling utility functions
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
            case 401:
                return 'Please login to continue';
            case 403:
                return 'You do not have permission to perform this action';
            case 404:
                return 'The requested resource was not found';
            case 422:
                return message || 'Invalid data provided';
            case 429:
                return 'Too many requests. Please try again later';
            case 500:
                return 'Server error. Please try again later';
            default:
                return message || 'An unexpected error occurred';
        }
    } else if (error.request) {
        // Request was made but no response received
        return 'Unable to connect to server. Please check your internet connection';
    } else {
        // Error in setting up the request
        return 'An error occurred while processing your request';
    }
};

// Format validation errors from backend
export const formatValidationErrors = (errors) => {
    if (typeof errors === 'string') return errors;
    if (Array.isArray(errors)) return errors.join(', ');
    
    return Object.entries(errors)
        .map(([field, messages]) => {
            const formattedField = field.replace('_', ' ');
            return `${formattedField}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
        })
        .join('; ');
};

// Check if error requires authentication
export const isAuthenticationError = (error) => {
    return error.response && (error.response.status === 401 || error.response.status === 403);
};

// Check if error is a network error
export const isNetworkError = (error) => {
    return !error.response && error.request;
};