import request from '@/utils/request'

export function getNamespaces(params) {
  return request({
    url: '/namespaces',
    method: 'get',
    params
  })
}
