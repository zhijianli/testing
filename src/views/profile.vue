<template>
	<div id="app">
		<div>
			<img class="topImage" src="https://image-testscale.oss-cn-hangzhou.aliyuncs.com/background.png">
		</div>
		<div class="profile-tab">
			<div class="btn" :class="{selected: index === 0}" @click="index = 0">已完成</div>
			<div class="btn" :class="{selected: index === 1}" @click="index = 1">已收藏</div>
		</div>

		<ul class="testing-list sdasdas" v-if="index === 0">
			<testing-item :key="item.id" :type="1" :item="item" v-for="item of profileTestingList">
				<p class="time" slot="footer">测试时间： {{item.createTime | format}}</p>
			</testing-item>
		</ul>

		<ul class="testing-list" v-if="index === 1">
			<testing-item :key="item.id" :item="item" v-for="item of profileCollectTestingList">
				<p class="testing-count" slot="footer">
					共{{item.numberOfTitle}}题·{{item.numberOfTest}}人测过
				</p>
			</testing-item>
		</ul>

		<div class="classify-loading" v-if="loading"></div>

		<no-data v-if="! noData && index === 0"></no-data>
		<no-data v-if="! noDataCollect && index === 1" text="还没有收藏过"></no-data>

		<!-- 撑开Fixednav挡住的位置 -->
		<div class="space"></div>
		<!-- 固定导航栏 -->
		<fixednav></fixednav>
	</div>
</template>

<script>
	import {mapState} from "vuex"

	import {getURLParams, timeFormat} from "utils"

	import noData from "components/no-data"
	import testingItem from "components/testing-item"
	import fixednav from 'components/fixed-nav'
	export default {
		data() {
			return {
				index: 0,

				loading: false,
				//currentClassify: -1
			}
		},
		computed: {
			... mapState(["profileCount", "profileCountCollect", "profileLoaded", "profileTestingList", "profileCollectTestingList"]),
			noData() {
				return !! this.profileCount
			},
			noDataCollect() {
				return !! this.profileCountCollect
			}
		},
		components: {
			noData,
			testingItem,
      fixednav
		},
		asyncData({store}) {
			return store.dispatch("getProfileData", store.state.uid).catch((error) => {
				console.error(error)
			})
		},
		filters: {
			format(value) {
				return timeFormat(value)
			}
		},
		beforeMount() {
			if (this.profileLoaded) {
				return
			}
			this.loading = true
			this.$store.dispatch("getProfileData", this.$store.state.uid).then(() => {
				this.loading = false
			}).catch((error) => {
				this.loading = false
				this.$toast(error.msg)
			})
		},
		methods: {
			getTestingList(id) {
				this.loading = true

				this.$store.commit("setProfileTestingList", [])

				this.$store.dispatch("getProfileData").then(() => {
					this.loading = false
				}).catch((error) => {
					this.$toast(error.msg)
				})
			}
		}
	}
</script>

<style scoped>
.topImage {
  width: 100%;
	height: 3rem;


}
.profile-tab {
	display: flex;
	justify-content: space-around;
	line-height: .88rem;
	border-bottom: 1px solid #EEE;
	background-color: #FFF;

	& .btn {
		color: #666;
		font-size: .3rem;
	}

	& .selected {
		position: relative;
		/* color: #00D3DD; */
		color: #0ba8f0;

		&::after {
			content: "";
			width: 120%;
			height: 2px;
			position: absolute;
			left: 50%;
			bottom: 0;
			background-color: currentcolor;
			transform: translateX(-50%);
		}
	}
}
.testing-list {
	margin-top: .24rem;
	background-color: #FFF;
}
.time {
	color: #BFBFBF;
	font-size: .24rem;
}
</style>
