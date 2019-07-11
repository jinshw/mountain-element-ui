import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/task/list',
    method: 'post',
    data
  })
}
export function startCron(data) {
  return request({
    url: '/systask/startCron',
    method: 'post',
    data
  })
}
export function stopCron(data) {
  return request({
    url: '/systask/stopCron',
    method: 'post',
    data
  })
}
export function changeCron10(data) {
  return request({
    url: '/systask/changeCron10',
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
