import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sysuser/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/sysuser/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sysuser/logout',
    method: 'post'
  })
}

export function getList(data) {
  return request({
    url: '/sysuser/list',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/sysuser/adduser',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/sysuser/delete',
    method: 'post',
    data
  })
}
export function editUser(data) {
  return request({
    url: '/sysuser/edit',
    method: 'post',
    data
  })
}
export function resetPassword(data) {
  return request({
    url: '/sysuser/resetPassword',
    method: 'post',
    data
  })
}
export function modifyPassword(data) {
  return request({
    url: '/sysuser/modifyPassword',
    method: 'post',
    data
  })
}
