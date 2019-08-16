import request from '@/utils/request'

export function getAge(data) {
  return request({
    url: '/error/id/12',
    method: 'get',
    data
  })
}
