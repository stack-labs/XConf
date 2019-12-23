import request from '@/utils/request'

export function getApps(params) {
  return request({
    url: '/apps',
    method: 'get',
    params
  })
}
