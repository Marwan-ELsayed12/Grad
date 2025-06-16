// Form validation rules
const rules = {
    required: (value) => ({
        isValid: !!value && value.toString().trim().length > 0,
        message: 'This field is required'
    }),
    
    email: (value) => ({
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    }),
    
    password: (value) => ({
        isValid: value && value.length >= 6,
        message: 'Password must be at least 6 characters long'
    }),
    
    confirmPassword: (value, formData) => ({
        isValid: value === formData.password,
        message: 'Passwords do not match'
    }),
    
    minLength: (value, minLength) => ({
        isValid: value && value.length >= minLength,
        message: `Must be at least ${minLength} characters long`
    }),
    
    maxLength: (value, maxLength) => ({
        isValid: value && value.length <= maxLength,
        message: `Must be no more than ${maxLength} characters long`
    }),
    
    numeric: (value) => ({
        isValid: /^\d+$/.test(value),
        message: 'Must contain only numbers'
    }),
    
    decimal: (value) => ({
        isValid: /^\d*\.?\d*$/.test(value),
        message: 'Must be a valid number'
    }),
    
    phone: (value) => ({
        isValid: /^\+?[\d\s-]+$/.test(value),
        message: 'Please enter a valid phone number'
    })
};

// Validate a single field
export const validateField = (value, validations = [], formData = {}) => {
    for (const validation of validations) {
        let rule;
        let param;

        if (typeof validation === 'string') {
            rule = rules[validation];
        } else if (typeof validation === 'object') {
            rule = rules[validation.rule];
            param = validation.param;
        }

        if (rule) {
            const result = rule(value, param, formData);
            if (!result.isValid) {
                return result.message;
            }
        }
    }
    return '';
};

// Validate entire form
export const validateForm = (formData, validationSchema) => {
    const errors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
        const value = formData[fieldName];
        const validations = validationSchema[fieldName];
        const error = validateField(value, validations, formData);

        if (error) {
            errors[fieldName] = error;
            isValid = false;
        }
    });

    return { isValid, errors };
};

// Example validation schema
export const createValidationSchema = (fields) => {
    const schema = {};
    fields.forEach(field => {
        if (typeof field === 'string') {
            schema[field] = ['required'];
        } else {
            schema[field.name] = field.validations;
        }
    });
    return schema;
};

// Common validation schemas
export const commonSchemas = {
    login: {
        email: ['required', 'email'],
        password: ['required', 'password']
    },
    
    registration: {
        name: ['required', { rule: 'minLength', param: 2 }],
        email: ['required', 'email'],
        password: ['required', 'password'],
        confirmPassword: ['required', 'confirmPassword']
    },
    
    bookReview: {
        rating: ['required', { rule: 'minLength', param: 1 }],
        comment: ['required', { rule: 'minLength', param: 10 }]
    }
};