import axios from "axios"

export const baseURL = process.env.REACT_APP_API_BASE_URL 

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