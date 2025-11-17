export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateNumber = (value: string, fieldName: string, min?: number, max?: number): string | null => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `${fieldName} must be no more than ${max}`;
  }
  
  return null;
};

export const validateDate = (dateString: string, fieldName: string): string | null => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return `${fieldName} must be a valid date`;
  }
  
  return null;
};

export const validateFutureDate = (dateString: string, fieldName: string): string | null => {
  const dateValidation = validateDate(dateString, fieldName);
  if (dateValidation) return dateValidation;
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (date <= now) {
    return `${fieldName} must be a future date`;
  }
  
  return null;
};