import request from '@/utils/request'

export function release(data) {
  return request({
    url: '/release',
    method: 'post',
    data
  })
}

export function listReleaseHistory(params) {
  return request({
    url: '/release/history',
    method: 'get',
    params
  })
}

export function rollback(data) {
  return request({
    url: '/rollback',
    method: 'post',
    data
  })
}

