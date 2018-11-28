import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 1000,
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
  // console.log(error)
  // console.log(error.response)
  // console.log(error.response.data)
  // console.log(error.response.status)
  // console.log(error.response.headers)
  // console.log(error.request)
  // Do something with response error
  return {
    status: error.response.status,
    request: error.request,
    data: error.response.data,
    isSuccess: false
  }
  // return Promise.reject(error);
}));

export default instance
