import { toast } from 'react-toastify';

export const handleApiResponse = async (promise, {
    successMessage,
    loadingMessage = 'Please wait...',
    errorMessage = 'An error occurred'
} = {}) => {
    const toastId = toast.loading(loadingMessage);
    
    try {
        const response = await promise;
        if (successMessage) {
            toast.update(toastId, {
                render: successMessage,
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        } else {
            toast.dismiss(toastId);
        }
        return response;
    } catch (error) {
        const message = error.response?.data?.message || errorMessage;
        toast.update(toastId, {
            render: message,
            type: 'error',
            isLoading: false,
            autoClose: 3000
        });
        throw error;
    }
};

export const handleApiAction = async (action, {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    loadingMessage
} = {}) => {
    try {
        const response = await handleApiResponse(action(), {
            successMessage,
            errorMessage,
            loadingMessage
        });
        if (onSuccess) {
            onSuccess(response);
        }
        return response;
    } catch (error) {
        if (onError) {
            onError(error);
        }
        throw error;
    }
};

export const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
    warning: (message) => toast.warning(message),
    loading: (message) => toast.loading(message),
    dismiss: (id) => toast.dismiss(id),
    update: (id, options) => toast.update(id, options)
};