import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
      const response = await axiosInstance.post('/api/auth/signup', signupData)
      return response.data
    };
    
export const login = async (loginData) => {
      const response = await axiosInstance.post('/api/auth/login', loginData)
      return response.data
    };

export const getAuthUser = async () => {
      const response = await axiosInstance.get('/api/auth/me');
      return response.data;
    };

export const completeOnboarding = async (userData) => {
      const response = await axiosInstance.post('/api/auth/onboarding', userData);
      return response.data;
    }