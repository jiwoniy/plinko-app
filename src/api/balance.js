import axiosInstance from './axios'

const baseUrl = '/balance'
export default {
  getBalance (token) {
    return axiosInstance.get(`${baseUrl}`, {
      params: {
        token
      }
    })
  },
}

