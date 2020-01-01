import request from '@/utils/request'

export function getApps() {
  return request({
    url: '/apps',
    method: 'get'
  })
}

export function createApp(data) {
  return request({
    url: '/app',
    method: 'post',
    data: data
  })
}

export function deleteApp(data) {
  return request({
    url: '/app',
    method: 'delete',
    data: data
  })
}
