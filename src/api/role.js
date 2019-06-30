import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sysrole/list',
    method: 'post',
    data
  })
}
export function addRole(data) {
  return request({
    url: '/sysrole/add',
    method: 'post',
    data
  })
}
export function editRole(data) {
  return request({
    url: '/sysrole/edit',
    method: 'post',
    data
  })
}
export function deleteRole(data) {
  return request({
    url: '/sysrole/delete',
    method: 'post',
    data
  })
}
