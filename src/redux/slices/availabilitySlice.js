import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import availabilityService from '../../services/availabilityService';

// Async thunk for getting availability
export const getAvailability = createAsyncThunk('availability/get', async (availabilityData) => {
  const response = await availabilityService.getAvailability(availabilityData);
  return response.data;
});

// Async thunk for adding availability
export const addAvailability = createAsyncThunk('availability/add', async (availabilityData) => {
  const response = await availabilityService.addAvailability(availabilityData);
  return response.data;
});

// Async thunk for updating availability
export const updateAvailability = createAsyncThunk('availability/update', async (availabilityData) => {
  const response = await availabilityService.updateAvailability(availabilityData);
  return response.data;
});


const availabilitySlice = createSlice({
  name: 'availability',
  initialState: { status: 'idle', data: null, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailability.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAvailability.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getAvailability.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAvailability.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addAvailability.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(addAvailability.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateAvailability.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default availabilitySlice.reducer;