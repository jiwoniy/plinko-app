import axiosInstance from './axios'

// import apiHandler from '@/helper/apiHandler'

const baseUrl = '/plinko'
export default {
  getPlinkoProbalblity (start_index, p_length = 42) {
    return axiosInstance.get(`${baseUrl}/getProbablity`, {
      params: {
        start_index,
        p_length
      }
    })
  },
}

