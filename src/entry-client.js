import Vue from 'vue'

import { createApp } from './app'

import Toast from "components/toast"

Vue.use(Toast)

// a global mixin that calls `asyncData` when a route component's params change
// Vue.mixin({
//   beforeRouteUpdate (to, from, next) {
//     const { asyncData } = this.$options
//     if (asyncData) {
//       asyncData({
//         store: this.$store,
//         route: to
//       }).then(next).catch(next)
//     } else {
//       next()
//     }
//   }
// })

const { app, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 解决 rem 兼容问题
const ua = navigator.userAgent

if (/(vivo|oppo)/i.test(ua)) {
  const fuckVIVO = (Math.min(innerWidth, screen.width) / 7.5) * 100 / parseFloat(getComputedStyle(document.documentElement).fontSize)

  document.documentElement.style.fontSize =  `calc(${fuckVIVO}vw / 7.5)`
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  // router.beforeResolve((to, from, next) => {
  //   const matched = router.getMatchedComponents(to)
  //   const prevMatched = router.getMatchedComponents(from)
  //   let diffed = false
  //   const activated = matched.filter((c, i) => {
  //     return diffed || (diffed = (prevMatched[i] !== c))
  //   })
  //   const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
  //   if (!asyncDataHooks.length) {
  //     return next()
  //   }

  //   Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
  //     .then(() => {
  //       next()
  //     })
  //     .catch(next)
  // })

  // actually mount to DOM
  app.$mount('#app')
})
