import request from '@/utils/request'

export function getNamespaces(params) {
  return request({
    url: '/namespaces',
    method: 'get',
    params
  })
}

export function createNamespaces(data) {
  return request({
    url: '/namespaces',
    method: 'post',
    data
  })
}

export function deleteNamespaces(data) {
  return request({
    url: '/namespaces',
    method: 'delete',
    data
  })
}

