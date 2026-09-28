// 引入axios
import store from '@/store'
import axios from 'axios'
import { Toast } from 'vant'
// 配置axios实例 这一块可以再axios官网axios实例文档中查看
const request = axios.create({
  // 基地址（开发环境走 devServer 代理，生产环境直连接口）
  baseURL: process.env.NODE_ENV === 'production' ? 'https://smart-shop.itheima.net/index.php?s=/api' : '/api',
  // 超时时间
  timeout: 5000
  // headers: { 'X-Custom-Header': 'foobar' }
})

// 自定义配置 -请求/响应拦截器
// 添加请求拦截器 axios官网拷贝
request.interceptors.request.use(function (config) {
  // 设置platform请求头（接口文档要求）
  config.headers.platform = 'H5'
  // 开启loadingg，禁止背景点击(节流处理)
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0 // 长时间显示,直到手动关闭
    // duration: 1000 // 1秒后自动关闭
  })

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么，默认axios会多包装一层data，需要响应拦截器处理
  const res = response.data
  if (res.status !== 200) {
    // 错误提示用户,Toast组件默认是单例模式，后面调用的Toast会覆盖前面的Toast
    Toast(res.message || '请求失败')
    return Promise.reject(res.message || '请求失败')
  } else {
    // 关闭loading
    Toast.clear()
    return res
  }
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 请求失败也要关闭loading，否则Toast会一直挂在页面上
  Toast.clear()
  return Promise.reject(error)
})
// 导出axios实例
export default request
