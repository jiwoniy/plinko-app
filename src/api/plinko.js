import axiosInstance from './axios'

// import apiHandler from '@/helper/apiHandler'

const baseUrl = '/plinko'
export default {
  getPlinkoProbalblity (start_index) {
    return axiosInstance.get(`${baseUrl}/getProbablity`, {
      params: {
        start_index
      }
    })
  },
}

