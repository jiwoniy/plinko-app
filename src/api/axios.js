import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000',
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
// instance.response.use(function (response) {
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error);
// });

export default instance
