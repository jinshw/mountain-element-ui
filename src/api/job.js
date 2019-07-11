import request from '@/utils/request'

export function queryjob(data) {
  return request({
    url: '/job/queryjob',
    method: 'post',
    data
  })
}
export function addjob(data) {
  return request({
    url: '/job/addjob',
    method: 'post',
    data
  })
}
export function pausejob(data) {
  return request({
    url: '/job/pausejob',
    method: 'post',
    data
  })
}
export function resumejob(data) {
  return request({
    url: '/job/resumejob',
    method: 'post',
    data
  })
}
export function deletejob(data) {
  return request({
    url: '/job/deletejob',
    method: 'post',
    data
  })
}
export function reschedulejob(data) {
  return request({
    url: '/job/reschedulejob',
    method: 'post',
    data
  })
}
