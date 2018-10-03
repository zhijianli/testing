<template>
	<div :style="{width: length * width + 'px', transform: 'translateX(-' + width * index + 'px) translateZ(0)'}" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
		<slot></slot>
	</div>
</template>

<script>
	//import {throttle} from "lodash"

	export default {
		props: {
			length: {
				type: Number,
				required: true
			},
			currentIndex: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				width: 0,
				index: this.currentIndex
			}
		},
		computed: {
			offset() {
				return this.width * this.index
			}
		},
		watch: {
			currentIndex(value) {
				this.index = value
			}
		},
		beforeMount() {
			this.width = Math.min(750, window.innerWidth)
		},
		mounted() {
			Object.defineProperty(this.$el, "translateX", {
				set(value) {
					this.style.transform = `translate3d(${value}px, 0, 0)`
				}
			})
		},
		methods: {
			touchstart(e) {
				this.$el.style.transition = "none"

				this.time = Date.now()
				this.max = (this.length - 1) * this.width

				this.startX = e.touches[0].clientX
				this.startY = e.touches[0].clientY

				this.$emit("start")
			},
			touchmove(e) {
				const touch = e.touches[0]
				const max = this.max
				const offset = this.offset

				let x = touch.clientX - this.startX
				let y = touch.clientY - this.startY

				if (typeof this.isX === "undefined") {
					this.isX = Math.abs(y) / Math.abs(x) < 1
				}

				if (this.isX) {
					// 向左滑动
					if (x < 0) {
						if (x > 0) {
							x = 0
						}

						if (Math.abs(x) + Math.abs(offset) > max) {
							this.$el.translateX = - ((Math.abs(x) / 5) + Math.abs(offset))

							e.preventDefault()

							return
						}

						this.$el.translateX = x + - offset

						this.$emit("move", x)
					} else {
						const result = - (offset - x)

						if (result > 0) {
							this.$el.translateX = x / 5

							e.preventDefault()

							return
						}

						this.$el.translateX = result

						this.$emit("move", x)
					}

					e.preventDefault()

				}
			},
			// touchmove(e) {
			// 	return throttle(this.tt, 100)(e)
			// },
			// touchmove: _.throttle((e) => {
			// 	bbb.tt(e)
			// }, 10),
			touchend(e) {
				const touch = e.changedTouches[0]
				const offset = this.offset
				const currentOffset = this.startX - touch.clientX
				const max = this.max
				const time = Date.now() - this.time

				let x = touch.clientX - this.startX
				let y = touch.clientY - this.startY

				this.$el.style.transition = "all .3s"

				if (! this.isX) {
					delete this.isX

					return
				}

				delete this.isX

				// x 小于10 说明发生的是单击事件
				if (Math.abs(x) < 10) {
					return
				}

				if (currentOffset > 0 && offset === max) {
					this.$el.translateX = - max

					return
				}

				if (currentOffset < 0 && offset === 0) {
					this.$el.translateX = 0

					return
				}

				// 滑动速度快
				if (time < 120) {
					if (currentOffset > 0) {
						this.setTransform(1)
					} else {
						this.setTransform()
					}
				} else {
					if (Math.abs(currentOffset) >= this.width / 3) {
						currentOffset > 0 ? this.setTransform(1) : this.setTransform()

					} else {
						this.$el.translateX = - offset

						this.$emit("end", this.index)
					}
				}
			},
			setTransform(direction) {
				direction ? this.index++ : this.index--

				this.offset = this.index * this.width

				this.$el.translateX = - this.width * this.index

				this.$emit("end", this.index)
				this.$emit("changeIndex", this.index)
			}
		}
	}
</script>