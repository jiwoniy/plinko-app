import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 3000,
  headers: { 'content-type': 'application/json' },
});

// // Add a request interceptor
// instance.request.use(function (config) {
//   // Do something before request is sent
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

// // Add a response interceptor
instance.interceptors.response.use((response => {
  return {
    ...response,
    isSuccess: true
  }
}),
  (error => {
    let result = {
      isSuccess: false
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        ...result,
        request: error.request,
        status: error.response.status,
        data: error.response.data,
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return {
        ...result,
        request: error.request,
        status: null,
        data: null
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        ...result,
        request: null,
        status: null,
        data: null
      }
    }
    // return Promise.reject(error);
}));

export default instance
