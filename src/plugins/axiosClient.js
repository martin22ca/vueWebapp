import axios from 'axios'
import router from '@/router/index'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const EXPRESS_PORT = import.meta.env.VITE_EXPRESS_PORT
const FLASK_PORT = import.meta.env.VITE_FLASK_PORT

const createAxiosClient = (port) => {
  return axios.create({
    baseURL: `${BASE_URL}:${port}`,
  });
}

const setupInterceptors = (axiosClient) => {

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle 401 here, e.g., redirect to the login page
        router.push({ name: "Login" });
      }
      return Promise.reject(error);
    }
  );
}

export const axiosExpressClient = createAxiosClient(EXPRESS_PORT);
export const axiosFlaskClient = createAxiosClient(FLASK_PORT);

setupInterceptors(axiosExpressClient);
setupInterceptors(axiosFlaskClient);