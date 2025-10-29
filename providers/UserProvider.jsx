import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { getUserData, getJwtToken, clearUserData, saveUserData } from '@/services/apiService';

// User Context
const UserContext = createContext();

// User Actions
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Initial State
const initialState = {
  user: null,
  jwt: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// User Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        jwt: action.payload.jwt,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from SecureStore on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Load user from storage
  const loadUserFromStorage = async () => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const [userData, jwt] = await Promise.all([
        getUserData(),
        getJwtToken(),
      ]);

      if (userData && jwt) {
        dispatch({
          type: USER_ACTIONS.SET_USER,
          payload: {
            user: userData,
            jwt: jwt,
          },
        });
      } else {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Failed to load user data' });
    }
  };

  // Login user
  const loginUser = async (userData, jwt) => {
    try {
      // Save to secure storage
      await saveUserData(userData, jwt);

      // Update context state
      dispatch({
        type: USER_ACTIONS.SET_USER,
        payload: {
          user: userData,
          jwt: jwt,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error logging in user:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Failed to log in' });
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    try {
      const updatedUser = {
        ...state.user,
        ...updatedData,
      };

      // Save updated user data
      await saveUserData(updatedUser, state.jwt);

      // Update context state
      dispatch({
        type: USER_ACTIONS.UPDATE_USER,
        payload: updatedData,
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Failed to update profile' });
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await clearUserData();
      dispatch({ type: USER_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  };

  // Utility Functions
  const getUserImage = () => {
    if (!state.user || !state.user.photo) {
      return null;
    }
    return state.user.photo;
  };

  const getUserName = () => {
    return state.user?.name || '';
  };

  const getUserEmail = () => {
    return state.user?.email || '';
  };

  const getUserPhone = () => {
    return state.user?.phone || '';
  };

  const getUserId = () => {
    return state.user?.id || null;
  };

  // Context value
  const contextValue = {
    // State
    user: state.user,
    jwt: state.jwt,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    loginUser,
    logoutUser,
    updateUserProfile,
    refreshUser: loadUserFromStorage,

    // Utility functions
    getUserImage,
    getUserName,
    getUserEmail,
    getUserPhone,
    getUserId,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

// Export action types for testing or advanced usage
export { USER_ACTIONS };
