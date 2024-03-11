import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customService from '../../services/customService';

// Async thunk for fetching doctor details
export const fetchDoctorDetails = createAsyncThunk('custom/doctor_details_availability', async () => {
  const response = await customService.doctorDetailsAvailability();
  return response.data;
});

export const doctorSlice = createSlice({
  name: 'doctor',
  initialState: { data: null, status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default doctorSlice.reducer;