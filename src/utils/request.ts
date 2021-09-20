import axios from 'axios'
import store from '@/store'

const request = axios.create({

})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
// 在发送请求之前做些什么
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
// 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
// 对响应数据做点什么
  return response
}, function (error) {
// 对响应错误做点什么
  return Promise.reject(error)
})

export default request
