// 用户相关的接口
import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (data: User): any => {
  return request({
    method: 'POST',
    url: '/front//user/login',
    // content-type可有可无
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // axios把普通对象转成application/json
    // query string转成x-www-form-urlencoded
    data: qs.stringify(data)
  })
}

export const getInfo = (): any => {
  return request({
    method: 'GET',
    url: '/front//user/getInfo'
  })
}

export const getUserPages = (data: any): any => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (userId: string | number): any => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
