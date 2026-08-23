import axios from "axios"

export const baseURL = process.env.REACT_APP_API_BASE_URL

const createService = (headers = {}) => {
    const service = axios.create({
        baseURL:baseURL,
        headers:
        {
            ...headers
        },
    });
  return service

}

export default createService;
