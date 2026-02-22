import axios from "axios"

export const baseURL = import.meta.env.VITE_API_BASE_URL 

export default (headers = {}) => {
    const service = axios.create({
        baseURL:baseURL,
        headers:
        {
            ...headers
        },
    });
  return service

}