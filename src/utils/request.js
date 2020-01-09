import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getCookies } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    // do something before request is sent
    const sessionId = getCookies('sessionId')
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    if (sessionId != null && sessionId !== undefined) {
      config.headers['token'] = sessionId
    }

    if (config.url === '/file/upload') {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else if (config.url === '/file/fileDownLoad') {
      config.responseType = 'blob'
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const headers = response.headers
    const contentType = headers['content-type']
    if (contentType === 'application/octet-stream;charset=utf-8' || contentType === 'application/fore-download') {
      console.log(headers)
      return response
    } else if (res.code !== 20000) { // if the custom code is not 20000, it is judged as an error.
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;50008 system err
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('您已经注销，您可以取消以停留在此页面，或再次登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code === 50015) { // not have permission
        Message({
          message: '您没有操作权限',
          type: 'warning',
          duration: 5 * 1000
        })
        return false
      }

      // const promise = Promise.reject(new Error(res.message || 'Error'))

      // promise.catch(function(error) {
      //   console.log('98888', error)
      // })
      // promise.then((resp) => {
      //   return resp
      // }, (resp) => {
      //   return resp
      // })

      const promise = new Promise(function(resolve, reject) {
        reject(new Error(res.message || 'Error'))
      })
      promise.catch(function(error) {
        console.log(error)
      })

      return promise
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
