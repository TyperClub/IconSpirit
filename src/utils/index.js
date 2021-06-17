import axios from 'axios'
// import router from '../router'

// axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:7001' : 'http://127.0.0.1:7001'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  // if (res.data.resultCode != 200) {
  //   if (res.data.message) this.$message.error(res.data.message)
  //   if (res.data.resultCode == 416) {
  //     router.push({ path: '/login' })
  //   }
  //   // return Promise.reject(res.data)
  // }
  return res.data
}, err => {
  console.log('错误', err)
  return Promise.reject(err);
})


export default {
  post(url, data) {
    return axios({
      method: 'post',
      url,
      data: data
    })
  },
  put(url, data) {
    return axios({
      method: 'put',
      url,
      data: data
    })
  },
  patch(url, data) {
    return axios({
      method: 'patch',
      url,
      data: data
    })
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params
    })
  },
  delete(url, params) {
    return axios({
      method: 'delete',
      url,
      params
    })
  }
}
