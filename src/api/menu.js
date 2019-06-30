import request from '@/utils/request'

export function getTree(data) {
  return request({
    url: '/sysmenu/getTree',
    method: 'post',
    data
  })
}
export function getList(data) {
  return request({
    url: '/sysmenu/list',
    method: 'post',
    data
  })
}
export function addMenu(data) {
  return request({
    url: '/sysmenu/add',
    method: 'post',
    data
  })
}
export function editMenu(data) {
  return request({
    url: '/sysmenu/edit',
    method: 'post',
    data
  })
}
export function deleteMenu(data) {
  return request({
    url: '/sysmenu/delete',
    method: 'post',
    data
  })
}
