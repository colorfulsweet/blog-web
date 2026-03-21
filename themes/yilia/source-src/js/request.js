import axios from 'axios'

const http = axios.create({
  timeout: 10000,
  paramsSerializer: {
    indexes: null
  }
})

http.interceptors.response.use(res => {
  const responseBody = res.data
  // 统一响应格式处理
  switch (responseBody.code) {
    case 0:
      // 成功，直接返回数据
      return responseBody.data
    case -1:
      return Promise.reject(new Error(responseBody.message || '请求失败'))
    default:
      // 其他情况，兼容没有包装格式的响应
      return res.data
  }
}, err => Promise.reject(err))

export default http