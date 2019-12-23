import request from '@/utils/request'

export function getClusters(params) {
  return request({
    url: '/clusters',
    method: 'get',
    params
  })
}
