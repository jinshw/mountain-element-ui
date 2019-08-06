import request from '@/utils/request'

export function getDicts(data) {
  return request({
    url: '/sysdict/list',
    method: 'post',
    data
  })
}
export function addDict(data) {
  return request({
    url: '/sysdict/add',
    method: 'post',
    data
  })
}
export function editDict(data) {
  return request({
    url: '/sysdict/edit',
    method: 'post',
    data
  })
}
export function deleteDict(data) {
  return request({
    url: '/sysdict/delete',
    method: 'post',
    data
  })
}
