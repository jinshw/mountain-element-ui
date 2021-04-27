import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/es/add',
    method: 'post',
    data
  })
}
