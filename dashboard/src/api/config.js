import request from '@/utils/request'

export function updateConfig(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  })
}
