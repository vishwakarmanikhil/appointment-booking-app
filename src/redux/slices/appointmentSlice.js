import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointmentService';

// Async thunk for getting appointment
export const getAppointment = createAsyncThunk('appointment/get', async (post) => {
  const response = await appointmentService.getAppointment(post);
  return response.data;
});

// Async thunk for add appointment
export const addAppointment = createAsyncThunk('appointment/add', async (post) => {
    const response = await appointmentService.createAppointment(post);
    return response.data;
  });

// Async thunk for updating appointment
export const updateAppointment = createAsyncThunk('appointment/update', async (post) => {
  const response = await appointmentService.updateAppointment(post);
  return response.data;
});

// Async thunk for canceling appointment
export const cancelAppointment = createAsyncThunk('appointment/cancel', async (post) => {
  const response = await appointmentService.cancelAppointment(post);
  return response.data;
});


const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: { 
    status: 'idle', 
    appointmentList: null, 
    addAppointment: null, 
    updateAppointment: null, 
    cancelAppointment: null, 
    error: null 
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointmentList = action.payload;
      })
      .addCase(getAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addAppointment = action.payload;
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.updateAppointment = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(cancelAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cancelAppointment = action.payload;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});


export default appointmentSlice.reducer;