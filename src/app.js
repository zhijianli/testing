import "normalize.css"
import "css/common.css"

import Vue from 'vue'
import App from './App.vue'
import 'mint-ui/lib/style.css'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

// 引入 babel-plyfill
import "babel-polyfill"

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances

  //创建各个存储容器
  const store = createStore()

  //创建各个页面的路由
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App) //这是ES6的写法，表示渲染一个名字叫“APP”的vue组件
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
