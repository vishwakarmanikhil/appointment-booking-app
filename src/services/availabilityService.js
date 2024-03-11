import api from '../utils/apiUtils';

const userService = {
    getAvailability: async (data) => {
        try {
            const response = await api.post('api/availability/get', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
    addAvailability: async (data) => {
        try {
            const response = await api.post('api/availability/add', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
    updateAvailability: async (data) => {
        try {
            const response = await api.post('api/availability/update', data)
            return response;
        } catch (error) {

            // throw new Error('signup failed', error) 
            return error?.response;
        }
    },
}

export default userService
