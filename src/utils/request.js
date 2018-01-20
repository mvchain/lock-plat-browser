import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL: window.urlData.url, // api的base_url
  timeout: 15000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('mvcUser')
  if (token) {
    config.headers['Authorization'] = JSON.parse(token).token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器 Authorization
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status === 40101) {
      window.location.href = '#/login'
      return Promise.reject('连接超时，请重新登录')
    }
    return response.data
  },
  error => {
    return Promise.reject(error.response.data.message)
  }
)

export default service
