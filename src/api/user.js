import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/loginCross',
    // url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getList(data) {
  console.log('555555555555555')
  return request({
    url: '/sysuser/list',
    method: 'post',
    data
  })
}
export function addUser(data) {
  console.log(data, '...........')
  return request({
    url: '/sysuser/adduser',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  console.log(data, '...........')
  return request({
    url: '/sysuser/delete',
    method: 'post',
    data
  })
}
