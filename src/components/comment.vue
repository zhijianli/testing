<style scoped>
.to-reply-input-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 7.5rem;
	padding: .24rem;
	position: fixed;
	bottom: 0;
	box-shadow: 0 0 5px rgba(0, 0, 0, .2);
	box-sizing: border-box;
	background-color: #FFF;
}
.to-reply-input {
	flex: 1;
	max-height: 2rem;
	min-height: .5rem;
	margin-right: .2rem;
	font-size: .3rem;
	text-align: left;
	border: none;
	resize: none;
	outline: none;
	-webkit-user-modify: read-write-plaintext-only;
	box-sizing: border-box;
	line-height: 1.5;
	word-break: keep-all;
	word-wrap: break-word;
	overflow: hidden;
	overflow-y: auto;
	border-bottom: 1px solid #999;

	&::before {
		content: attr(data-placeholder);
		display: none;
		color: #999;
	}
}
.to-reply-input:empty::before {
	display: block;
}
.to-reply-input::placeholder {
	color: #999;
}
.to-reply-input.c-actived::before {
	display: none;
}

.send-comment-btn {
	display: block;
	color: #333;
}
.comment-loading {
	opacity: .5;
}

.comment-label {
	padding: .02rem .2rem;
	color: #608FDB;
	font-size: .22rem;
	border-radius: 4px;
	border: 1px solid;
}
</style>

<template>
	<div class="to-reply-input-wrapper">
		<div class="to-reply-input" :class="{'c-actived': commentContent}" :data-placeholder="placeholder" ref="comment" @compositionstart="compositionstart" @compositionend="compositionend" @blur="blur"></div>
		<span class="btn send-comment-btn" @click="toComment" v-if="! commentLoading">发送</span>
		<span class="comment-loading" v-else>发送中...</span>
	</div>
</template>

<script>
	import {getResponse} from "api"

	export default {
		props: {
			payload: {
				type: Object,
				required: true
			},
			focus: {
				type: Number
			}
		},
		data() {
			return {
				status: true,
				commentContent: "",
				commentLoading: false,

				meta: null,
				paramsObj: null
			}
		},
		watch: {
			focus(value) {
				//if (value) {
					this.$refs.comment.focus()
				//}
			}
		},
		computed: {
			mid() {
				return this.$store.state.user.mid
			},
			isActived() {
				return this.status && this.commentContent.length
			},
			maxlength() {
				return this.payload.maxlength || 9999
			},
			placeholder() {
				return this.payload.placeholder || "添加评论"
			},
			params() {
				return this.paramsObj || this.payload.params
			}
		},
		mounted() {
			const target = this.$refs.comment
			const observer = new MutationObserver((mutations) => {
				const textContent = target.textContent
				let length = textContent.length
				let doubleByteNum = 0

				for (let str of textContent) {
					if (! isNaN(str.charCodeAt(1))) {
						// 不是 NaN 说明这个字符码点大于 \uFFFF
						doubleByteNum++
					}
				}

				if (length - doubleByteNum < this.maxlength + 1) {
					this.commentContent = textContent
				} else {
					target.textContent = textContent.slice(0, this.maxlength + doubleByteNum)

					// 处理光标跑到前面的问题
					const selection = getSelection()
					const range = document.createRange()

					range.setStart(target.firstChild, this.maxlength + doubleByteNum)

					selection.removeAllRanges()
					selection.addRange(range)
				}
			})

			observer.observe(target, {
				childList: true,
				subtree: true,
				characterData: true
			})
		},
		methods: {
			compositionstart(e) {
				// 处理 PC 键盘非直接输入文字
				! this.commentContent.length && (this.status = false)
			},
			compositionend(e) {
				// 处理 PC 键盘非直接输入文字
				this.status = true
			},
			blur() {
				//console.log(this.payload.params)
				this.paramsObj = this.payload.params
				this.meta = this.payload.meta

				this.$emit("blur")
			},
			async toComment() {
				let commentContent = this.commentContent

				if (! commentContent) {
					return
				}

				commentContent = commentContent.replace(/[<>]/g, (match) => {
					if (match === "<") {
						return "&lt;"
					}

					if (match === ">") {
						return "&gt;"
					}
				})

				// 带上小尾巴
				// if (this.mid == 9506 || this.mid == 49310) {
				// 	commentContent += `<span class="tail-wrapper"><span class="tail">本评论来自泰山小霸王</span><img src="https://tb2.bdstatic.com/tb/editor/images/face/i_f25.png?t=20140803"><img src="https://tb2.bdstatic.com/tb/editor/images/face/i_f25.png?t=20140803"><img src="https://tb2.bdstatic.com/tb/editor/images/face/i_f25.png?t=20140803"><span>`
				// }

				this.commentLoading = true
				//this.params[this.payload.commentContentField] = commentContent

				const options = {
					mid: this.$root.user.uid,
					parentCommentId: 0,

					mName: this.$root.user.nickname,
					mHeadPortrait: this.$root.user.avatar,
					articleId: this.$route.params.id,
					commentContent,
				}

				if (this.payload.parentCommentId) {
					options.parentCommentId = this.payload.parentCommentId
					options.parentCommentName = this.payload.parentCommentName
				}

				const data = await getResponse('userOperationCenter/commonComment/add', options)

				this.commentLoading = false

				if (data.code === 0) {
					this.$toast("评论成功")

					this.$emit('comment', commentContent, data.commentId)

					this.commentContent = ""
					this.$refs.comment.textContent = ""

					return
				}

				this.$toast(data.msg)
			}
		}
	}
</script>