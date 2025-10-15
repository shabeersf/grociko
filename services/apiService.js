import { API_CONFIG, logApiRequest, logApiResponse } from '@/config/api';
import * as SecureStore from 'expo-secure-store';

/**
 * API Service for Grociko App
 * Handles all API requests with authentication and error handling
 */

// SecureStore Keys
const STORAGE_KEYS = {
  USER_DATA: 'grociko_user_data',
  JWT_TOKEN: 'grociko_jwt_token',
  USER_ID: 'grociko_user_id',
};

/**
 * Create Basic Auth header
 */
const getBasicAuthHeader = () => {
  const credentials = `${API_CONFIG.BASIC_AUTH.USERNAME}:${API_CONFIG.BASIC_AUTH.PASSWORD}`;
  const encodedCredentials = btoa(credentials);
  return `Basic ${encodedCredentials}`;
};

/**
 * Create request headers with Basic Auth
 */
const createHeaders = (isFormData = false) => {
  const headers = {
    'Authorization': getBasicAuthHeader(),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }

  return headers;
};

/**
 * Handle API errors
 */
const handleApiError = (error, endpoint) => {
  console.error(`API Error at ${endpoint}:`, error);

  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      error: error.response.data?.message || 'Server error occurred',
      statusCode: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      error: 'No response from server. Please check your internet connection.',
      statusCode: 0,
    };
  } else {
    // Something else happened
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      statusCode: 0,
    };
  }
};

/**
 * Make API request with timeout and error handling
 */
const makeRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    logApiRequest(options.method || 'GET', url, options.body);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Get response text first
    const responseText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Response is not valid JSON:', responseText.substring(0, 200));
      return {
        success: false,
        error: 'Server returned an invalid response. This might be an authentication issue.',
        statusCode: response.status,
        rawResponse: responseText.substring(0, 500),
      };
    }

    logApiResponse(url, data);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
        statusCode: response.status,
        data,
      };
    }

    return {
      success: true,
      data,
      statusCode: response.status,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout. Please try again.',
        statusCode: 408,
      };
    }
    return handleApiError(error, endpoint);
  }
};

/**
 * Save user data to SecureStore
 */
export const saveUserData = async (userData, jwt = null) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

    // Save JWT token - either from userData or passed separately
    const token = jwt || userData.jwt;
    if (token) {
      await SecureStore.setItemAsync(STORAGE_KEYS.JWT_TOKEN, token);
    }

    if (userData.id) {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, userData.id.toString());
    }

    console.log('✅ User data saved to SecureStore');
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user data from SecureStore
 */
export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Get JWT token from SecureStore
 */
export const getJwtToken = async () => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.JWT_TOKEN);
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return null;
  }
};

/**
 * Clear user data from SecureStore (logout)
 */
export const clearUserData = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID);
    return { success: true };
  } catch (error) {
    console.error('Error clearing user data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = async () => {
  const userData = await getUserData();
  const jwt = await getJwtToken();
  return !!(userData && jwt);
};

/**
 * User Signup API
 */
export const signupUser = async (formData) => {
  try {
    // For FormData, we only need Authorization header
    // Don't set Content-Type - let the browser/fetch set it with boundary
    const headers = {
      'Authorization': getBasicAuthHeader(),
      'Accept': 'application/json',
    };

    console.log('📤 Signup Request Headers:', headers);
    console.log('📤 FormData keys:', Array.from(formData._parts || []).map(([key]) => key));

    const response = await makeRequest('/sign-up.php', {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('📥 Signup Response:', {
      success: response.success,
      statusCode: response.statusCode,
      hasData: !!response.data,
      error: response.error,
    });

    if (response.success && response.data?.response_code === 200) {
      // Save user data to SecureStore with JWT token
      const jwt = response.data.jwt;
      await saveUserData(response.data.data, jwt);

      return {
        success: true,
        data: response.data.data,
        jwt: jwt,
        message: 'Account created successfully!',
      };
    } else {
      return {
        success: false,
        error: response.data?.data?.err?.join(', ') || response.error || 'Signup failed',
        errors: response.data?.data?.err || [],
      };
    }
  } catch (error) {
    console.error('❌ Signup Error:', error);
    return handleApiError(error, '/sign-up.php');
  }
};

/**
 * User Login API
 * Accepts email or phone with password
 */
export const loginUser = async (loginPayload) => {
  try {
    const headers = {
      'Authorization': getBasicAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    console.log('🔐 Login Request:', {
      hasEmail: !!loginPayload.email,
      hasPhone: !!loginPayload.phone,
    });

    const response = await makeRequest('/login.php', {
      method: 'POST',
      headers,
      body: JSON.stringify(loginPayload),
    });

    console.log('📥 Login Response:', {
      success: response.success,
      statusCode: response.statusCode,
      responseCode: response.data?.response_code,
    });

    if (response.success && response.data?.response_code === 200) {
      // Save user data to SecureStore with JWT token
      const jwt = response.data.jwt;
      await saveUserData(response.data.data, jwt);

      return {
        success: true,
        data: response.data.data,
        jwt: jwt,
        message: 'Login successful!',
      };
    } else if (response.data?.response_code === 220) {
      // No result found - invalid credentials
      return {
        success: false,
        error: response.data?.message || 'Invalid email/phone or password',
      };
    } else {
      return {
        success: false,
        error: response.data?.message || response.error || 'Login failed',
      };
    }
  } catch (error) {
    console.error('❌ Login Error:', error);
    return handleApiError(error, '/login.php');
  }
};

/**
 * Create FormData from signup form
 */
export const createSignupFormData = (formValues, imageUri) => {
  const formData = new FormData();

  // Add text fields
  formData.append('name', formValues.name || '');
  formData.append('phone', formValues.phone || '');
  formData.append('email', formValues.email || '');
  formData.append('username', formValues.username || '');
  formData.append('password', formValues.password || '');
  formData.append('c_password', formValues.c_password || '');

  // Add image if provided
  if (imageUri) {
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('photo', {
      uri: imageUri,
      name: filename,
      type,
    });
  }

  return formData;
};

/**
 * Get user profile image URL
 */
export const getUserImageUrl = (imageName, size = 'medium') => {
  if (!imageName) return null;

  const sizeUrls = {
    large: `${API_CONFIG.BASE_IMG_URL}/large`,
    medium: `${API_CONFIG.BASE_IMG_URL}/medium`,
    small: `${API_CONFIG.BASE_IMG_URL}/small`,
  };

  return `${sizeUrls[size] || sizeUrls.medium}/${imageName}`;
};

/**
 * Validate file before upload
 */
export const validateImageFile = (fileInfo) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const errors = [];

  if (fileInfo.fileSize && fileInfo.fileSize > MAX_SIZE) {
    errors.push('Image size must be less than 5MB');
  }

  if (fileInfo.mimeType && !ALLOWED_TYPES.includes(fileInfo.mimeType)) {
    errors.push('Only JPEG and PNG images are allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Export storage keys for external use if needed
export { STORAGE_KEYS };

