import request from '@/utils/request'

export function updateConfig(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  })
}

export function supportedFormat() {
  return request({
    url: '/format',
    method: 'get'
  })
}
