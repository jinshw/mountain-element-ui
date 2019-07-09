# mountain-element-ui

## 项目概述

```
mountain-element-ui 是mountain 项目的前端工程，是基于vue-admin-template开源项目扩展开发的，实现管理系统最基础的模块开发
```

## 动态路由添加

* 遇到问题

  1. 后台返回json数据，怎样转换成router

     解决方法：

     ```javascript
     // 变量后台返回的菜单tree，转换成前端router
     function getMenuTree(list) {
       const remoteMenuList = []
       for (const index in list) {
         let obj = {}
         const menu = list[index]
         if (menu.type === 0) { // 目录
           obj.path = menu.url
           obj.component = Layout
           obj.meta = {
             title: menu.name,
             icon: menu.icon
           }
         } else if (menu.type === 1) { // 菜单
           var urlArr = menu.url.split(';')
           obj = {
             path: urlArr[0],
             component: _import(trim(urlArr[1])),
             name: urlArr[0],
             meta: {
               title: menu.name,
               icon: menu.icon
             }
           }
         } else if (menu.type === 2) { // 按钮
           console.log(menu.type)
         }
         if (list[index].children.length !== 0) {
           const tempChildren = getMenuTree(list[index].children)
           obj.children = tempChildren
         }
         if (Object.keys(obj).length > 0) {
           remoteMenuList.push(obj)
         }
       }
       return remoteMenuList
     }
     ```

     

  2. 怎样动态添加路由

     解决方法：

     ```javascript
     router.addRoutes(router.options.routes)// 动态添加路由
     ```

     

  3. 刷新页面不能添加路由菜单

     解决方法：把后台返回的菜单tree保存在`LocalStorage`，在`router.beforeEach()` 方法中获取本地数据，并添加到路由上。

     ```javascript
     // 保存后台菜单tree
     setLocalStorage('router', response.sysMenus.children)
     
     // permission.js 文件中 router.beforeEach
     router.beforeEach(async(to, from, next) => {
       const initRouterList = getLocalStorage('initRouter')
     
       if (router.options.routes.length <= initRouterList.length) {// 必须添加，否则死循环
         const list = getLocalStorage('router')
         const remoteRouter = menuTreeToPageMenu(list)
         // 动态添加路由
         if (remoteRouter !== null && remoteRouter !== undefined) {
           for (let i = 0; i < remoteRouter.length; i++) {
             var isFlag = router.options.routes.some(function(obj) {
               if (obj.path === remoteRouter[i].path) {
                 return true
               }
             })
             if (!isFlag) {
               router.options.routes.push(remoteRouter[i])
             }
           }
           router.addRoutes(router.options.routes)
           next({ ...to, replace: true })
         }
       }
       ....
       
     }
     
     ```

     

  4. 添加新菜单并且赋权后，重新登录不显示新增菜单

     解决方法：

     ```javascript
     // src/router/index.js 中获取localstorage获取initRouter
     const initRouter = getLocalStorage('initRouter')
     router.options.routes = initRouter
     ```

     

* 



----

---

## Build Setup

```bash
# 参考项目
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

