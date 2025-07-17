import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

// Load user from localStorage if available
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    initialState.user = JSON.parse(savedUser);
    initialState.otpVerified = initialState.user?.isAuthenticated || false;
  }
}

// Async thunks for authentication
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phoneNumber, countryCode }: { phoneNumber: string; countryCode: string }, { rejectWithValue }) => {
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call an API to send OTP
      return { success: true, phoneNumber, countryCode };
    } catch (error) {
      return rejectWithValue('Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ 
    otp, 
    phoneNumber, 
    countryCode 
  }: { 
    otp: string; 
    phoneNumber: string; 
    countryCode: string 
  }, { rejectWithValue }) => {
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll accept any 6-digit OTP
      if (otp.length === 6) {
        // Create a mock user
        const user: User = {
          id: Math.random().toString(36).substring(2, 15),
          phoneNumber,
          countryCode,
          isAuthenticated: true,
        };
        
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        return { user };
      } else {
        return rejectWithValue('Invalid OTP');
      }
    } catch (error) {
      return rejectWithValue('Failed to verify OTP');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove user from localStorage
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return rejectWithValue('Failed to logout');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.isLoading = false;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder.addCase(sendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.otpSent = true;
      state.error = null;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Verify OTP
    builder.addCase(verifyOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.otpVerified = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.otpVerified = false;
      state.otpSent = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetAuthState, resetOtpState } = authSlice.actions;
export default authSlice.reducer; 