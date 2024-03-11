import api from '../utils/apiUtils';

const userService = {
  signup: async (credentials) => {
    try {
      const response = await api.post('api/user/signup', credentials)
      return response;
    } catch (error) {

      // throw new Error('signup failed', error) 
      return error?.response;
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('api/user/login', credentials)
      return response;
    } catch (error) {
      // throw new Error('Login failed')
      return error?.response;
    }
  },
  getUserDetails: async (userData) => {
    try {
      const response = await api.post(`api/user/user_details`, userData)
      return response
    } catch (error) {

      // throw new Error('Update issue')
      return error?.response;
    }
  },
  updateUser: async (userData) => {
    try {
      const response = await api.post(`api/user/update_user`, userData)
      return response
    } catch (error) {

      // throw new Error('Update issue')
      return error?.response;
    }
  },
}

export default userService
