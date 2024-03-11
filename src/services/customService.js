import api from '../utils/apiUtils';

const customService = {
  doctorDetailsAvailability: async () => {
    try {
      const response = await api.get('api/custom/doctor_details_availability')
      return response;
    } catch (error) {

      // throw new Error('signup failed', error) 
      return error?.response;
    }
  },
};

export default customService;