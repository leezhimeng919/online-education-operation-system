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

1. 处理 application/json 为 application/x-www-form-urlencoded 格式
2. 前面为 json 格式，后面为 query string 格式，由键值对和`=`、`&`组成
3. 使用 qs 模块。qs.stringify 和 qs.parse
4. 表单验证：rule 和 prop

### 身份认证

#### 处理 token 过期

### 用户权限

### 角色权限管理

### 课程管理

### 发布部署

## 一些问题处理

### 关于 token 过期的问题

1. 一般情况下：需要用户重新登录，重新调用登录接口获取新的 token
2. 体验更好的方案：自动重新获取 token
   1. 接口返回的关于 token 的字段
      1. access_token
         1. 用来授权获取接口数据
      2. expires_in
         1. access_token 的过期时间
         2. 为了安全，过期时间一般设置的比较短
      3. refresh_token
         1. 刷新获取新的 access_token
   2. 自动获取 token 方法
      1. 方法一：请求发起前拦截每个请求，通过 expires_in 判断 token 是否过期，如果过期用 refresh_token 去请求获取新的 token
         1. 缺点：需要额外提供 expires_in 字段，并且对服务端时间和客户端时间的一致性有严格要求，有校验失败的风险
      2. （推荐）方法二：请求前不做处理，拦截返回后的数据，如果 401 则过期，用 refresh_token，再重试一次
         1. 缺点：会多请求一次
3. 方法二实现
   1. 通过axios的响应拦截器去拦截错误响应，错误响应又分为三种：响应状态码超过2xx；没有响应；请求失败
   2. 在响应状态码为401的情况向做token过期处理，重新请求token
```javascript
function redirectLogin() {
  router.push({
    name: "login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
}

request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      // 请求发出去了，但是响应状态码超过2xx
      const { status } = error.response
      if (status === 401) {
        // 401
        // token无效，没有提供token、token无效、token过期了
        // 如果有refresh_token，则尝试使用refresh_token获取新的access_token
        //    成功 -> 把本次失败的请求重新发出去
        //    失败 -> 跳转登录页重新登录获取新的token
        // 如果没有，则直接跳转到登录页

        // 如果没有登录，直接跳转到登录页
        if (!store.state.user) {
          redirectLogin();
          return Promise.reject(error);
        }

        // 尝试刷新token
        // 单独创建axios实例，防止套娃
        try {
          const { data } = await axios.create()({
            method: "POST",
            url: "/front/user/refresh_token",
            data: qs.stringify({
              refreshtoken: store.state.user.refresh_token,
            }),
          });
          // 将新获取的token存到store里
          store.commit("setUser", data.content);
          //    成功 -> 把本次失败的请求重新发出去
          // return 一个Promise对象，刚好请求都在config里
          return request(error.config);
        } catch (error) {
          //    失败 -> 跳转登录页重新登录获取新的token
          store.commit("setUser", null);
          redirectLogin();
          return Promise.reject(error);
        }
      } else if (status === 403) {
         // 403
         Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
         // 404
         Message.error('访问资源不存在')
      } else if (status === 500) {
         // 500
         Message.error('服务端错误，请联系管理员')
      }
    } else if (error.request) {
      // 请求发出了，没收到响应
      Message.error("请求超时");
    } else {
      // 请求设置时出错
      Message.error(`请求失败:${error.Message}`);
    }
    return Promise.reject(error);
  }
);
```

### 关于多次请求刷新 token 的问题
1. 如果当前正在刷新token，则把当前过来的401请求存起来
   1. 存的每一项是请求的resolve函数`()=>{resolve(request(error.config))}`
2. 如果当前不再刷新token，则刷新token，再把存起来的请求队列(不包含第一次的请求)重新发出去，然后重置这个队列，最后把第一次的请求发出去
```javascript
function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}
// 响应拦截器
let isRefreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求
if (status === 401) {
   // token 无效（没有提供 token、token 是无效的、token 过期了）
   // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
   if (!store.state.user) {
      redirectLogin()
      return Promise.reject(error)
   }

   // 刷新 token
   if (!isRefreshing) {
      isRefreshing = true // 开启刷新状态
      // 尝试刷新获取新的 token
      return refreshToken().then(res => {
         if (!res.data.success) {
         throw new Error('刷新 Token 失败')
         }
         // 刷新 token 成功了
         store.commit('setUser', res.data.content)
         // 把 requests 队列中的请求重新发出去
         requests.forEach(cb => cb())
         // 重置 requests 数组
         requests = []
         return request(error.config)
      }).catch(err => {
         console.log(err)
         store.commit('setUser', null)
         redirectLogin()
         return Promise.reject(error)
      }).finally(() => {
         isRefreshing = false // 重置刷新状态
      })
   } else {
      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
         requests.push(() => {
         resolve(request(error.config))
         })
      })
   }
}
```
