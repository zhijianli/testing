
import Vue from "vue"
import Router from "vue-router"

import Home from "views/home"
import Classify from "views/classify"
import Detail from "views/detail"
import Topic from "views/topic"
import Result from "views/result"
import Selftest from "views/selftest"
import Profile from "views/profile"

// import IScrollView from "vue-iscroll-view"
// import IScroll from "iscroll"
// import IScroll from '../../build/iscroll.js'

// 404
import NotFoundComponent from "components/not-found-component"

Vue.use(Router)


export function createRouter() {
	return new Router({
		mode: "history",//避免路径中出现“#”，比如：http://localhost:8080/testing/#/
		fallback: false,
		base: "/testing",
		scrollBehavior: () => ({ y: 0 }),
		routes: [
			{
				path: "/",
				component: Home
			},
			{
				path: "/classify",
				component: Classify
			},
			{
				path: "/detail/:id",
				component: Detail
			},
			{
				path: "/topic/:id",
				component: Topic
			},
			{
				path: "/result/:id",
				component: Result
			},
			{
				path: "/profile",
				component: Profile
			},
      {
        path: "/selftest",
        component: Selftest
      },
			{
				path: "*",
				component: NotFoundComponent
			}
		]
	})

}
