import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import availabilityReducer from './slices/availabilitySlice'
import appointmentReducer from './slices/appointmentSlice'
import doctorReducer from './slices/doctorDetailsAvailabilitySlice'

const rootReducer = combineReducers({
  user: userReducer,
  availability: availabilityReducer,
  appointment: appointmentReducer,
  doctor: doctorReducer
});

export default rootReducer;