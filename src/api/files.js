import request from '@/utils/request'

export function queryFileList(data) {
  return request({
    url: '/file/queryList',
    method: 'post',
    data
  })
}
export function fileUpload(data) {
  return request({
    url: '/file/fileUpload',
    method: 'post',
    data
  })
}
export function fileDownLoad(data) {
  return request({
    url: '/file/fileDownLoad',
    method: 'post',
    data
  })
}
export function fileDelete(data) {
  return request({
    url: '/file/delete',
    method: 'post',
    data
  })
}
