// Validation schemas and utilities for BookIt (India-specific)

/**
 * Validation patterns and constants for India
 */
const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/, // Indian phone numbers: starts with 6-9, 10 digits
  NAME: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/, // Allows letters, spaces, hyphens, apostrophes
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PROMO_CODE: /^[A-Z0-9]{4,20}$/,
  PIN_CODE: /^\d{6}$/, // Indian PIN code: exactly 6 digits
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // 24-hour time format
  INDIAN_NAME: /^[a-zA-Z\s]{2,50}$/ // Indian names with basic validation
};

/**
 * Validation error messages for Indian context
 */
const ERROR_MESSAGES = {
  REQUIRED: (field) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit Indian phone number',
  INVALID_NAME: 'Please enter a valid name (2-50 characters)',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PROMO_CODE: 'Invalid promo code format',
  INVALID_PIN_CODE: 'Please enter a valid 6-digit PIN code',
  MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field, max) => `${field} must be less than ${max} characters`,
  MIN_VALUE: (field, min) => `${field} must be at least ${min}`,
  MAX_VALUE: (field, max) => `${field} must be less than ${max}`,
  INVALID_DATE: 'Please enter a valid date',
  INVALID_TIME: 'Please enter a valid time',
  FUTURE_DATE: 'Date must be in the future',
  POSITIVE_NUMBER: 'Must be a positive number',
  WHOLE_NUMBER: 'Must be a whole number'
};

/**
 * Validation utility functions
 */

// Check if value is empty
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Validate email
const validateEmail = (email) => {
  if (isEmpty(email)) return ERROR_MESSAGES.REQUIRED('Email');
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

// Validate Indian phone number
const validatePhone = (phone) => {
  if (isEmpty(phone)) return ERROR_MESSAGES.REQUIRED('Phone number');
  const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  if (!VALIDATION_PATTERNS.PHONE.test(cleanPhone)) return ERROR_MESSAGES.INVALID_PHONE;
  return null;
};

// Validate name (Indian context)
const validateName = (name) => {
  if (isEmpty(name)) return ERROR_MESSAGES.REQUIRED('Name');
  if (name.trim().length < 2) return ERROR_MESSAGES.MIN_LENGTH('Name', 2);
  if (name.trim().length > 50) return ERROR_MESSAGES.MAX_LENGTH('Name', 50);
  return null;
};

// Validate password
const validatePassword = (password) => {
  if (isEmpty(password)) return ERROR_MESSAGES.REQUIRED('Password');
  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) return ERROR_MESSAGES.INVALID_PASSWORD;
  return null;
};

// Validate promo code
const validatePromoCode = (code) => {
  if (isEmpty(code)) return null; // Optional field
  if (!VALIDATION_PATTERNS.PROMO_CODE.test(code)) return ERROR_MESSAGES.INVALID_PROMO_CODE;
  return null;
};

// Validate Indian PIN code
const validatePinCode = (pinCode) => {
  if (isEmpty(pinCode)) return ERROR_MESSAGES.REQUIRED('PIN code');
  if (!VALIDATION_PATTERNS.PIN_CODE.test(pinCode)) return ERROR_MESSAGES.INVALID_PIN_CODE;
  return null;
};

// Validate number range
const validateNumberRange = (value, field, min, max) => {
  if (isEmpty(value)) return ERROR_MESSAGES.REQUIRED(field);
  const num = Number(value);
  if (isNaN(num)) return `Please enter a valid number for ${field}`;
  if (min !== undefined && num < min) return ERROR_MESSAGES.MIN_VALUE(field, min);
  if (max !== undefined && num > max) return ERROR_MESSAGES.MAX_VALUE(field, max);
  return null;
};

// Validate date
const validateDate = (dateString, mustBeFuture = false) => {
  if (isEmpty(dateString)) return ERROR_MESSAGES.REQUIRED('Date');
  if (!VALIDATION_PATTERNS.DATE.test(dateString)) return ERROR_MESSAGES.INVALID_DATE;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) return ERROR_MESSAGES.INVALID_DATE;
  if (mustBeFuture && date < today) return ERROR_MESSAGES.FUTURE_DATE;
  
  return null;
};

// Validate time
const validateTime = (timeString) => {
  if (isEmpty(timeString)) return ERROR_MESSAGES.REQUIRED('Time');
  if (!VALIDATION_PATTERNS.TIME.test(timeString)) return ERROR_MESSAGES.INVALID_TIME;
  return null;
};

/**
 * Validation schemas for different forms
 */

// Checkout form validation (India-specific)
export const validateCheckoutForm = (data, partial = false) => {
  const errors = {};

  if (!partial || data.name !== undefined) {
    const nameError = validateName(data.name);
    if (nameError) errors.name = nameError;
  }

  if (!partial || data.email !== undefined) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
  }

  if (!partial || data.phone !== undefined) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (!partial || data.participants !== undefined) {
    const participantsError = validateNumberRange(data.participants, 'Participants', 1, 20);
    if (participantsError) errors.participants = participantsError;
  }

  if (!partial || data.promoCode !== undefined) {
    const promoError = validatePromoCode(data.promoCode);
    if (promoError) errors.promoCode = promoError;
  }

  // Optional address fields for India
  if (!partial || data.pinCode !== undefined) {
    if (data.pinCode && data.pinCode.trim() !== '') {
      const pinError = validatePinCode(data.pinCode);
      if (pinError) errors.pinCode = pinError;
    }
  }

  return errors;
};

// User registration validation (India-specific)
export const validateRegistrationForm = (data) => {
  const errors = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = ERROR_MESSAGES.PASSWORD_MISMATCH;
  }

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  return errors;
};

// User login validation
export const validateLoginForm = (data) => {
  const errors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

// Experience search validation
export const validateSearchForm = (data) => {
  const errors = {};

  if (data.location && data.location.length > 100) {
    errors.location = ERROR_MESSAGES.MAX_LENGTH('Location', 100);
  }

  if (data.category && data.category.length > 50) {
    errors.category = ERROR_MESSAGES.MAX_LENGTH('Category', 50);
  }

  if (data.date) {
    const dateError = validateDate(data.date, true);
    if (dateError) errors.date = dateError;
  }

  if (data.participants) {
    const participantsError = validateNumberRange(data.participants, 'Participants', 1, 50);
    if (participantsError) errors.participants = participantsError;
  }

  return errors;
};

// Booking form validation (for API)
export const validateBookingData = (data) => {
  const errors = {};

  if (!data.experienceId) {
    errors.experienceId = ERROR_MESSAGES.REQUIRED('Experience');
  }

  if (!data.slotId) {
    errors.slotId = ERROR_MESSAGES.REQUIRED('Time slot');
  }

  if (!data.userInfo) {
    errors.userInfo = ERROR_MESSAGES.REQUIRED('User information');
  } else {
    const userInfoErrors = validateCheckoutForm(data.userInfo);
    Object.assign(errors, userInfoErrors);
  }

  const participantsError = validateNumberRange(data.participants, 'Participants', 1, 20);
  if (participantsError) errors.participants = participantsError;

  if (data.promoCode) {
    const promoError = validatePromoCode(data.promoCode);
    if (promoError) errors.promoCode = promoError;
  }

  return errors;
};

// Promo code validation
export const validatePromoCodeData = (data) => {
  const errors = {};

  const codeError = validatePromoCode(data.code);
  if (codeError) errors.code = codeError;

  if (data.amount === undefined || data.amount === null) {
    errors.amount = ERROR_MESSAGES.REQUIRED('Amount');
  } else {
    const amountError = validateNumberRange(data.amount, 'Amount', 0);
    if (amountError) errors.amount = amountError;
  }

  return errors;
};

/**
 * Utility functions for form validation
 */

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).some(key => errors[key]);
};

// Get first error message
export const getFirstError = (errors) => {
  const firstKey = Object.keys(errors).find(key => errors[key]);
  return firstKey ? errors[firstKey] : null;
};

// Validate single field
export const validateField = (fieldName, value, schema = 'checkout') => {
  const schemas = {
    checkout: validateCheckoutForm,
    registration: validateRegistrationForm,
    login: validateLoginForm,
    search: validateSearchForm,
    booking: validateBookingData,
    promo: validatePromoCodeData
  };

  const validator = schemas[schema];
  if (!validator) return null;

  const errors = validator({ [fieldName]: value }, true);
  return errors[fieldName] || null;
};

// Sanitize form data for Indian context
export const sanitizeFormData = (data) => {
  const sanitized = { ...data };

  // Trim string values
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key].trim();
    }
  });

  // Convert number strings to numbers
  if (sanitized.participants) {
    sanitized.participants = parseInt(sanitized.participants, 10);
  }

  if (sanitized.amount) {
    sanitized.amount = parseFloat(sanitized.amount);
  }

  // Uppercase promo codes
  if (sanitized.promoCode) {
    sanitized.promoCode = sanitized.promoCode.toUpperCase();
  }

  // Clean phone number (remove spaces, dashes, etc.)
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.replace(/\D/g, '');
  }

  return sanitized;
};

// Format Indian phone number for display
export const formatIndianPhone = (phone) => {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return cleanPhone;
};

export default {
  PATTERNS: VALIDATION_PATTERNS,
  MESSAGES: ERROR_MESSAGES,
  validateCheckoutForm,
  validateRegistrationForm,
  validateLoginForm,
  validateSearchForm,
  validateBookingData,
  validatePromoCodeData,
  hasErrors,
  getFirstError,
  validateField,
  sanitizeFormData,
  formatIndianPhone
};