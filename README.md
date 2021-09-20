# edu-boss-fed

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

## TODO
### 用户登录
1. 处理application/json为application/x-www-form-urlencoded格式
2. 前面为json格式，后面为query string格式，由键值对和`=`、`&`组成
3. 使用qs模块。qs.stringify和qs.parse
4. 表单验证：rule和prop
### 身份认证
#### 处理token过期
### 用户权限
### 角色权限管理
### 课程管理
### 发布部署


## 一些问题处理

### 关于token过期的问题
1. 一般情况下：需要用户重新登录，重新调用登录接口获取新的token
2. 体验更好的方案：自动重新获取token
   1. 接口返回的关于token的字段
      1. access_token
         1. 用来授权获取接口数据
      2. expires_in
         1. access_token的过期时间
         2. 为了安全，过期时间一般设置的比较短
      3. refresh_token
         1. 刷新获取新的access_token
   2. 自动获取token方法
      1. 方法一：请求发起前拦截每个请求，通过expires_in判断token是否过期，如果过期用refresh_token去请求获取新的token
         1. 缺点：需要额外提供expires_in字段，并且对服务端时间和客户端时间的一致性有严格要求，有校验失败的风险
      2. （推荐）方法二：请求前不做处理，拦截返回后的数据，如果401则过期，用refresh_token，再重试一次
         1. 缺点：会多请求一次
