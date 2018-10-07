<style src="css/home"></style>

<template>
	<div id="app">
		<slide :banner="banner"></slide>

		<!--
     测试分类
		<nav class="testing-nav">
			<router-link :to="'/classify/?id=' + item.id" :key="item.id" v-for="item of nav.slice(0, 3)" :style="{backgroundImage: 'url(' + prefix + item.relatePicSrc + suffix + ')'}">{{item.name}}</router-link>
			<router-link to="/classify/">全部测试</router-link>
		</nav> -->

    <!-- 热门测试 -->
		<div class="hot-testing">
			<!-- <h4 class="testing-title">热门测试</h4> -->
				<h4 class="testList-title" >热门测试</h4>

			<ul class="testing-list hotTestingItem">
				<hot-testing-item-broadcast :key="item.id" :item="item" v-for="item of hotTestingList"></hot-testing-item-broadcast>
			</ul>
		</div>

    <!-- 精选测试 -->
		<div class="choice-testing">
			<!-- <h4 class="testing-title">精选测试</h4> -->
			<h4 class="testList-title" >精选测试</h4>

			<ul class="testing-list">
				<!-- <testing-item :key="item.id" :item="item" v-for="item of choiceTestingList.slice(0, 3)"> -->
					<testing-item :key="item.id" :item="item" v-for="item of choiceTestingList">
					<p class="testing-count" slot="footer">
						共{{item.numberOfTitle}}题·{{item.numberOfTest}}人测过
						<!-- <span>{{item.ping}}评论</span> -->
					</p>
				</testing-item>
			</ul>
		</div>

		<!-- <div class="hot-testing">
			<h4 class="testing-title">热门测试</h4>

			<ul class="testing-list">
				<hot-testing-item :key="item.id" :item="item" v-for="item of hotTestingList"></hot-testing-item>
			</ul>
		</div> -->

		<div class="home-loading" v-if="loading"></div>

		<div class="my-btn" @click="go" v-if="uid"></div>


		<!-- 撑开Fixednav挡住的位置 -->
    <div class="space"></div>
    <!-- 固定导航栏 -->
    <fixednav></fixednav>

	</div>
</template>

<script>
	import {getResponseGeneral} from "api"
	import {getURLParams} from "utils"

	import {mapState} from "vuex"

	import slide from "components/slide"
	import testingItem from "components/testing-item"
	import hotTestingItem from "components/hot-testing-item"
	import hotTestingItemBroadcast from "components/hot-testing-item-broadcast"
	import flyIscroll from "components/fly-iscroll"
	import fixednav from 'components/fixed-nav';

	// import Swiper from "swiper"
	import "swiper/dist/css/swiper.min.css"

	export default {
		data() {
			return {
				loading: false
			}
		},
		computed: {
			... mapState(["uid", "prefix", "suffix", "banner", "nav", "choiceTestingList", "hotTestingList"])
		},
		components: {
			slide,
			testingItem,
			hotTestingItem,
			hotTestingItemBroadcast,
			flyIscroll,
			fixednav
		},
		asyncData({store}) {
			return store.dispatch("getHomeData").catch((error) => {
				console.log(error.msg)
			})
		},
		beforeMount() {
			if (this.uid) {

				document.cookie = `mid=${this.uid}; expires=${new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toUTCString()}; path=/`

				// this.getUserInfo()
			}

			if (this.nav.length) {
				return
			}

			this.loading = true

			this.$store.dispatch("getHomeData").then(() => {
				this.loading = false
			}).catch((error) => {
				this.$toast("似乎网络出现了一点问题~~")
			})
		},
		// mounted(){
        // var mySwiper = new Swiper('.swiper-container', {
        //   autoplay:true,
        //   loop:true
        // })
				// require('components/fly-iscroll')
      // },
		methods: {
			go() {
				this.$router.push('/profile')
			},
			async getUserInfo() {
				const data = await getResponseGeneral("depression/api/getMemberByMid.json", {
					mid: this.uid
				})

				if (data.code === 0) {
					this.$root.user = {
						uid: this.uid,
						avatar: data.avatar,
						nickname: data.nickname,
						phone: data.mobilePhone
					}
				}
			}
		}
	}
</script>
