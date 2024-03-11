import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Async thunk for user login
const loginUser = createAsyncThunk('user/login', async (credentials) => {
  const response = await userService.login(credentials);
  return response.data;
});

// Async thunk for user signup
const signupUser = createAsyncThunk('user/signup', async (userData) => {
  const response = await userService.signup(userData);
  return response.data;
});

// Async thunk for updating a user
const updateUser = createAsyncThunk('user/update', async (userData) => {
  const response = await userService.updateUser(userData);
  return response.data;
});

// Async thunk for getting user details
const getUserDetails = createAsyncThunk('user/user_details', async (userData) => {
  const response = await userService.getUserDetails(userData);
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducer logic for login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducer logic for signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducer logic for update
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducer logic for user details
      .addCase(getUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export { loginUser, signupUser, updateUser, getUserDetails };
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
