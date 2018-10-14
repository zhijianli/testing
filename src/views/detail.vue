<style src="css/detail"></style>

<template>
	<div id="app" class="detail-wrapper">
		<img class="detail-banner" :src="prefix + detail.relatePicSrc + suffix">
		<div class="detail-tab">
			<span class="detail-name" @click="changeIndex(0)">{{detail.name}}</span>
			<!-- <span :class="{actived: index === 0}" @click="changeIndex(0)">测试介绍</span>
			<span :class="{actived: index === 1}" @click="changeIndex(1)">用户评论({{detailComment.commonCommentList.length}})</span> -->
		</div>
		<div class="detail-container" v-if="index === 0">
			<!-- <h1 v-text="detail.name"></h1> -->
			<p class="detail-count-info">
				共{{detail.numberOfTitle}}题 |
				<span>{{detail.numberOfTest}}人测过</span>
			</p>
			<div class="detail-intro">
				<h4>测试介绍</h4>
				<p v-html="detail.description"></p>
			</div>
			<div class="btn testing-btn" @click="start" v-if="! testingDetailIsTesting">开始测试</div>

			<div class="d-btn-wrapper" v-else>
				<div class="btn retesting-btn" @click="start">重新测试</div>
				<div class="btn view-btn" @click="view">查看结果</div>
			</div>
		</div>
		<div class="detail-comment" v-if="index === 1">
			<ul class="comment-list" @click="forReply">
				<comment-item :key="item.commentId" :item="item" v-for="item of detailComment.commonCommentList"></comment-item>
			</ul>

			<!-- <div class="like-comment-wrapper">
				<div class="like-comment">我来说说...</div>
			</div> -->

			<comment :payload="payload" :focus="focus" @comment="commentHandler" @blur="blur" v-if="uid"></comment>
		</div>

		<div class="g-btn-wrapper">
			<div class="collect-btn" :class="{dactived: testingDetailCollect, disabled: collectDisabled}" @click="collect" v-if="uid"></div>
			<div class="detail-share-btn" @click="share" v-if="isAPP"></div>
		</div>

		<div class="detail-loading" v-if="loading"></div>
	</div>
</template>

<script>
	import {mapState} from "vuex"

	import {getResponse, getResponseGeneral, getResponseGeneralGET} from "api"
	import {getURLParams} from "utils"

	import commentItem from "components/comment-item"
	import comment from "components/comment"

	export default {
		data() {
			return {
				loading: false,
				index: 0,

				collectDisabled: false,
				collectStatus: false,
				comment: [],
				//commentLoaded: false,
				//commentLoading: true,

				page: 1,

				focus: 1,
				payload: {
					placeholder: '我来说说...',
					parentCommentName: '',
					parentCommentId: 0
				},

				isAPP: false
			}
		},
		computed: {
			... mapState({
				uid: "uid",
				prefix: "prefix",
				suffix: "suffix",
				detail: "testingDetail",
				detailComment: "testingDetailComment",
				testingDetailCollect: "testingDetailCollect",
				testingDetailIsTesting: "testingDetailIsTesting"
			})
		},
		components: {
			comment,
			commentItem
		},
		asyncData({store, route}) {
			if (store.state.uid) {
				return store.dispatch("getTestingDetail", {
					id: route.params.id,
					uid: store.state.uid
				}).catch((error) => {
					console.log(error)
				})
			} else {
				return store.dispatch("getTestingDetailNoLogin", {
					id: route.params.id
				}).catch((error) => {
					console.log(error)
				})
			}


		},
		beforeMount() {
			//alert(document.cookie)
			//alert(this.uid)
			const isWX = navigator.userAgent.match(/MicroMessenger/i)
			if (isWX) {
				let parameterString = decodeURIComponent(window.location.href).split('?')[2];
				let parameters = parameterString.split('&');
				let parameter={};
				for (const key in parameters) {
					let item = parameters[key].split('=')
					parameter[item[0]]=item[1]
				}
				this.$store.commit('setUid',parameter.uid)
			}
			if (this.detail.id === + this.$route.params.id) {
				return
			}

			this.loading = true

			if (this.uid) {
				return this.$store.dispatch("getTestingDetail", {
					id: this.$route.params.id,
					uid: this.uid
				}).then(() => {
					this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			} else {
				return this.$store.dispatch("getTestingDetailNoLogin", {
					id: this.$route.params.id
				}).then(() => {
					this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			}
		},
		mounted() {
			//this.$testingDetailCollect = this.testingDetailCollect

			// if (this.testingDetailCollect) {
			// 	this.collectStatus = true
			// }

			//this.$currentDetailID = this.$route.params.id

			this.isAPP = navigator.userAgent.match(/xinmao/)

			if (this.uid) {
				document.cookie = `mid=${this.uid}; expires=${new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toUTCString()}; path=/`

				// this.getUserInfo()

				//this.isTesting()
			}
		},
		methods: {
			forReply(e) {
				let target = e.target
				let parentNode

				if (target.className !== 'comment-item') {
					while (parentNode = target.parentNode) {
						if (parentNode.className === 'comment-item') {
							target = parentNode

							break
						}

						target = parentNode
					}
				}

				this.focus++
				this.payload.placeholder = `回复${target.dataset.name}：`

				this.payload.parentCommentId = target.dataset.id
				this.payload.parentCommentName = target.dataset.name

				this.$parentCommentId = target.dataset.id
				this.$parentCommentName = target.dataset.name
			},
			blur() {
				this.payload.placeholder = '我来说说...'
			},
			async isTesting() {
				//try {
					const data = await getResponse("orderCenter/testScaleOrder/isHaveTestOrder", {
						relateTestScaleId: this.$route.params.id, userId: this.uid
					})

					if (data.code === 0) {
						//alert(data.testScaleOrderNum)
						this.$store.commit("setTestingDetailIsTesting", data.testScaleOrderNum > 0)
					}
				// } catch (e) {
				// 	this.$toast(e.msg)
				// }
			},
			view() {
				//alert()
				this.$router.push(`/result/${this.detail.latestOrderId}`)
			},
			changeIndex(value) {
				this.index = value
			},
			async collect() {
				try {
					this.collectDisabled = true

					const data = await getResponse("userOperationCenter/commonCollection/collectionTestScale", {
						mid: this.uid,
						articleId: this.$route.params.id,
						isCollected: this.testingDetailCollect === 0 ? 1 : 0
					})

					if (data.code === 0) {
						this.collectDisabled = false
						//this.collectStatus = this.$testingDetailCollect === 0 ? 1 : 0
						this.$store.commit("setTestingDetailCollect", this.testingDetailCollect === 0 ? 1 : 0)

						//this.$testingDetailCollect = this.$testingDetailCollect === 0 ? 1 : 0

						return
					}

					this.$toast(data.msg)
				} catch (e) {
					this.$toast(e.msg)
				}
			},
			share() {
				const options = {
					type: 0,
					mid: this.$route.params.id,
					title: this.detail.name,
					result: this.detail.description,
					img: `${this.prefix}${this.detail.relatePicSrc}${this.suffix}`
				}
				const ua = navigator.userAgent
				const isIOS = /iPhone/i.test(ua)
				const isAndroid = /Android/i.test(ua)

				isIOS && window.webkit.messageHandlers.NativeMethod.postMessage(options)

				isAndroid && window.Android.showShare(JSON.stringify(options))
			},
			commentHandler(value, id) {
				const options = {
					mName: this.$root.user.nickname,
					commentContent: value,
					mHeadPortrait: this.$root.user.avatar,
					commentTime: Date.now(),
					commentId: id,
					parentCommentId: 0
				}

				if (this.$parentCommentId) {
					options.parentCommentName = this.$parentCommentName
					options.parentCommentId = this.$parentCommentId
				}

				//console.log(options)
				//return
				this.$store.commit('addComment', options)

				this.$parentCommentName = ''
				this.$parentCommentId = 0

				this.payload.parentCommentId = 0
				this.payload.parentCommentName = ''
			},
			async getTestingComment() {
				const data = await getResponse("comment", {
					page: this.page
				})

				this.commentLoading = false

				this.comment = data.list
			},
			start() {
				const ua = navigator.userAgent
				const isIOS = /iPhone/i.test(ua)
				const isAndroid = /Android/i.test(ua)

				if (!this.uid) {
					// if (this.isAPP) {
					// 	if (isAndroid) {
					// 		window.Android.needLogin()
					// 	} else {
					// 		window.webkit.messageHandlers.NeedLogin.postMessage('login')
					// 	}
					// } else {
					// 	const isWX = navigator.userAgent.match(/MicroMessenger/i)
					//
					// 	//this.getOpenID()
					// 	//return
					// 	if (isWX) {
					// 		this.getOpenID()
					// 	} else {
					// 		location.href = `/signup?next=${encodeURIComponent(location.href)}`
					// 	}
					// }
					//如果uid为空，跳转到登录页面
					this.$router.push(`/login`)
				}else{
				  this.$router.push(`/topic/${this.$route.params.id}`)
				}
			},
			async getUserInfo() {
				try {
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
				} catch (e) {
					this.$toast(e.msg)
				}
			},

			async getOpenID() {
				try {
					const params = {
						notifyUrl: location.href
					}
					const data = await getResponseGeneral("weixinCore/getCurriculumAuthUrl", params)
					if (data.url) {
						location.href = decodeURIComponent(data.url)

						return
					}

					// if (data.code === 0 && data.member && data.member.mid) {
					// 	//alert(data.mid)
					// 	//alert(data.member.mid)
					// 	document.cookie = `mid=${data.member.mid}; expires=${new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toUTCString()}; path=/`
					// 	this.$store.commit('setUid', data.member.mid)

					// 	this.$root.user = {
					// 		uid: data.member.mid,
					// 		avatar: data.member.avatar ? data.member.avatar : '',
					// 		nickname: data.member.nickname,
					// 		//phone: data.mobilePhone
					// 	}

					// 	this.$router.push(`/topic/${this.$route.params.id}`)

					// 	return
					// }

					this.$toast('获取 openid 出错')
				} catch (e) {
					this.$toast(e.msg || e.message)
				}
			}
		}
	}
</script>
