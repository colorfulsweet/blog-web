const DEFAULT_TIMEOUT = 10000

function serializeParams(params) {
  if (!params) return ''
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .flatMap(([k, v]) => Array.isArray(v) ? v.map(item => `${encodeURIComponent(k)}=${encodeURIComponent(item)}`) : [`${encodeURIComponent(k)}=${encodeURIComponent(v)}`])
    .join('&')
  return query ? '?' + query : ''
}

function handleResponse(res) {
  if (!res.ok) {
    return Promise.reject(new Error(`HTTP ${res.status}`))
  }
  return res.json().then(responseBody => {
    // 统一响应格式处理
    switch (responseBody.code) {
      case 0:
        // 成功，直接返回数据
        return responseBody.data
      case -1:
        return Promise.reject(new Error(responseBody.message || '请求失败'))
      default:
        // 其他情况，兼容没有包装格式的响应
        return responseBody
    }
  })
}

async function request(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)
  return fetch(url, { ...options, signal: controller.signal })
    .then(res => { clearTimeout(timer); return handleResponse(res) })
    .catch(err => { clearTimeout(timer); return Promise.reject(err) })
}

const http = {
  get(url, { params } = {}) {
    return request(url + serializeParams(params))
  },
  post(url, data) {
    return request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
}

export default http