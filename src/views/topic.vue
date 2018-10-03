<style src="css/topic"></style>

<template>
	<div id="app" class="topic">
		<div class="progress-bar" :style="{width: width}"></div>

		<div class="topic-title">
			<p>
				{{index + 1}}<i>/{{testingRubric.length}}</i>
				<span v-text="obj.problemWord"></span>
			</p>
			<img :src="prefix + obj.problemPicSrc + suffix" v-if="obj.problemPicSrc">
		</div>

		<ul class="topic-list">
			<li :class="{selected: arr[index].optionId === item.id}" v-for="(item, i) of obj.tsoList" @click="report(item.id)">
			<!-- <li  v-for="(item, i) of obj.tsoList" @click="report(item.id)"> -->
				{{i | format}} {{item.optionWord}}

				<img :src="prefix + item.optionPic + suffix" v-if="item.optionPic">
			</li>
		</ul>

		<div class="btn-wrapper">
			<div class="btn pre-btn" @click="index--" v-if="index !== 0">上一题</div>
			<div class="btn submit-btn" v-if="index === testingRubric.length - 1" @click="submit">提交</div>
		</div>

		<profile :arr="arr" v-if="showProfile"></profile>
	</div>
</template>

<script>
	import {mapState} from "vuex"

	import {getURLParams} from "utils"
	import {getResponseGeneral} from "api"

	import Profile from "components/profile"

	export default {
		data() {
			return {
				index: 0,
				showProfile: false,

				arr: [{}],
			}
		},
		computed: {
			... mapState(["uid", "prefix", "suffix"]),
			width() {
				if (! this.testingRubric) {
					return 0
				}
				return `${(this.index + 1) / this.testingRubric.length * 100}%`
			},
			obj() {
				return this.testingRubric[this.index] || {}
			},
			testingRubric() {
				return this.$store.state.testingRubric
			}
		},
		components: {
			Profile
		},
		asyncData({store, route}) {
			return store.dispatch("getTestingRubric", route.params.id)
		},
		filters: {
			format(value) {
				return ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M."][value]
			}
		},
		beforeMount() {

			// if (this.testingRubric.length) {
			// 	this.arr = this.testingRubric.map((item) => ({
			// 		testScaleTitleId: item.id,
			// 		optionId: ""
			// 	}))

			// 	return
			// }


			// if (! this.$root.user) {
			// 	this.$root.uid = getURLParams(location.search.slice(1)).uid

			// 	this.getUserInfo()
			// }

			if (this.uid) {
				! this.$root.user && this.getUserInfo()
			}

			this.$store.dispatch("getTestingRubric", this.$route.params.id).then(() => {
				this.arr = this.testingRubric.map((item) => ({
					testScaleTitleId: item.id,
					optionId: ""
				}))
			})
		},
		methods: {
			report(id) {
				this.arr[this.index].optionId = id

				if (this.index < this.testingRubric.length - 1) {
					this.index++
				}

			},
			submit() {
				if (this.arr[this.arr.length - 1].optionId) {
					this.showProfile = true
				}
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