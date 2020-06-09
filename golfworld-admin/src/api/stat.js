import request from '@/utils/request'

export function statUser(query) {
  return request({
    url: '/stat/user',
    method: 'get',
    params: query
  })
}

export function statOrder(query) {
  return request({
    url: '/stat/order',
    method: 'get',
    params: query
  })
}

export function statProduct(query) {
  return request({
    url: '/stat/product',
    method: 'get',
    params: query
  })
}
