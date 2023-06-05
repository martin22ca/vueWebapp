import axios from 'axios'

const BASEURL = import.meta.env.VITE_API_BASE_URL 

export const axiosClient = axios.create({
  baseURL: BASEURL,
});

export default axiosClient;