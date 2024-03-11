import api from '../utils/apiUtils';

const appointmentService = {
    getAppointment: async (data) => {
        try {
            const response = await api.post('api/appointment/get', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
    createAppointment: async (data) => {
        try {
            const response = await api.post('api/appointment/add', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
    updateAppointment: async (data) => {
        try {
            const response = await api.post('api/appointment/update', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
    cancelAppointment: async (data) => {
        try {
            const response = await api.post('api/appointment/cancel', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
};

export default appointmentService;