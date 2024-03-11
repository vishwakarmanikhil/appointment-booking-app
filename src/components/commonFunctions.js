const dayjs = require('dayjs');

export function isValidObject(obj) {
    return obj !== null && typeof obj === 'object' && obj !== undefined && Object.keys(obj).length !== 0;
}

export function isNotNullOrEmpty(value) {
    return value !== null && value !== undefined && value !== '';
}

// export function generateTimeSlots(doctorData, selectedDoctorId) {
//     console.log('doctorData', doctorData)
//     console.log('selectedDoctorId', selectedDoctorId)
//     // Find the doctor with the selected ID
//     const selectedDoctor = doctorData.find(doctor => doctor.id == selectedDoctorId);
//     console.log('selectedDoctor', selectedDoctor)


//     if (!selectedDoctor) {
//         return []; // Return an empty array if the doctor is not found
//     }

//     const { start_time, end_time, interval_minute } = selectedDoctor;

//     // Convert start_time and end_time to Date objects
//     const startTime = dayjs(`2024-01-01T${start_time}`);
//     const endTime = dayjs(`2024-01-01T${end_time}`);

//     // Calculate time slots based on interval_minute
//     const timeSlots = [];
//     let currentTime = startTime;
//     console.log('currentTime', currentTime)
//     while (currentTime <= endTime) {
//         const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
//         console.log('formattedTime', formattedTime)
//         timeSlots.push(formattedTime);
//         currentTime.setMinutes(currentTime.getMinutes() + interval_minute);
//     }

//     return timeSlots;
// }