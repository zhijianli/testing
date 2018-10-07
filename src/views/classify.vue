<style src="css/classify"></style>

<template>
	<div id="app" class="classify">
		<header class="classify-header-wrapper">
			<div class="classify-header-scroll-wrapper">
				<div class="classify-header">
					<span :class="{actived: currentClassify === 0}" @click="selectClassify(0)">最新</span>
					<span :class="{actived: currentClassify === item.id}" v-text="item.name" v-for="item of classify" @click="selectClassify(item.id)"></span>
				</div>
			</div>
		</header>

		<ul class="testing-list" v-if="testingList.length">
			<testing-item :key="item.id" :item="item" v-for="item of testingList"></testing-item>
		</ul>

		<div class="classify-loading" v-if="loading"></div>

		<!-- <no-data v-if="noData && ! loading"></no-data> -->

		<!-- 撑开Fixednav挡住的位置 -->
		<div class="space"></div>
		<!-- 固定导航栏 -->
		<fixednav></fixednav>
	</div>
</template>

<script>
	import {mapState} from "vuex"

	import {getURLParams} from "utils"

	import noData from "components/no-data"
	import testingItem from "components/testing-item"
	import fixednav from 'components/fixed-nav'

	export default {
		data() {
			return {
				loading: false,
				currentClassify: -1
			}
		},
		computed: {
			... mapState(["classify", "testingList"]),
			noData() {
				return ! this.testingList.length
			}
		},
		components: {
			noData,
			testingItem,
			fixednav
		},
		asyncData({store}) {
			return store.dispatch("getClassifyData").catch((error) => {
				console.error(error)
			})
		},
		watch: {
			currentClassify(id) {
				this.getClassifyTestingList(id)
			}
		},
		beforeMount() {
			this.currentClassify = getURLParams(location.search.slice(1)).id || 0

			if (this.classify.length) {
				return
			}
			this.$store.dispatch("getClassifyData", this.currentClassify).then(() => {
				this.loading = false
			}).catch((error) => {
				this.$toast(error.msg)
			})
		},
		methods: {
			selectClassify(id) {
				this.currentClassify = id

				this.$router.replace({
					path: `/classify/`,
					query: {
						//uid: this.$route.query.uid,
						id
					}
				})
			},
			getClassifyTestingList(id) {
				this.loading = true

				this.$store.commit("setTestingList", [])

				this.$store.dispatch("getClassifyTestingList", {id}).then(() => {
					this.loading = false
				}).catch((error) => {
					this.$toast(error.msg)
				})
			}
		}
	}
</script>
