import axios from 'axios'
import configs from '@/configs'
import { useCommonStore } from '@/stores/common';

const apiClient = new axios.create({
   baseURL: configs.API_BASE_URL,
   withCredentials: false,
   headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
   },
   timeout: 60000,
});

const token = localStorage.getItem('token');

if (token) {
   apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

apiClient.interceptors.response.use(
   (response) => response,
   (error) => {
      if (
         error.response && error.response.status === 401 && !error.response.config.url.includes('auth/login')
      ) {}

      const { showMessage } = useCommonStore();

      showMessage({
         text: error?.response?.data?.message || error?.response?.data?.meta?.message || `Error desconocido, contacta al administrador (${error?.status} - ${error.statusText})`,
         type: 'error',
      });

      return Promise.reject(error);
   },
);

export { apiClient as default };
