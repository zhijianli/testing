<style scoped>
.slide-container {
	height: 2.12rem;
	position: relative;
	overflow: hidden;
}
.banner{
	width:7.5rem;
	height:2.12rem;
}
.slide-wrapper {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	transition: transform .3s;
}
.slide-item {
	width: 7.5rem;
	height: 3rem;
}
.slide-progress {
	display: flex;
	justify-content: space-between;
	position: absolute;
	bottom: .3rem;
	left: 50%;
	transform: translateX(-50%);

	& .point {
		width: .12rem;
		height: .12rem;
		margin-right: .1rem;
		border-radius: 50%;
		background-color: #FFF;
		transition: all .3s;
	}

	& .point.current {
		width: .4rem;
		border-radius: 20%;
	}


}
</style>

<template>

	<div class="slide-container">

	 <!-- <slide-base class="slide-wrapper" :length="banner.length" :currentIndex="currentIndex" @changeIndex="changeIndex">
			<a :href="item.outsideLink" v-for="(item, index) of banner" @click="isWX">
				<img class="slide-item" :src="prefix + item.picPath + suffix" @touchstart="stopAnimation" @touchend="startAnimation">
			</a>
		</slide-base>
		<p class="slide-progress">
			<span class="point" :class="{current: currentIndex === n - 1}" v-for="n of banner.length"></span>
		</p> -->

	    <img class="banner"  src='https://image-testscale.oss-cn-hangzhou.aliyuncs.com/banner.jpg'>
	</div>


</template>

<script>
	import {mapState} from "vuex"

	import slideBase from "./slide-base"

	export default {
		props: {
			banner: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				currentIndex: 0
			}
		},
		computed: mapState(["prefix", "suffix"]),
		components: {
			slideBase
		},
		created() {
			this.play()
		},
		methods: {
			isWX(e) {
				if (window.__wxjs_environment === 'miniprogram') {
					e.preventDefault()
				}
			},
			changeIndex(value) {
				this.currentIndex = value
			},
			play() {
				const that = this

				this.timer = setTimeout(function animation() {
					if (that.currentIndex === that.banner.length - 1) {
						that.currentIndex = 0

						that.timer = setTimeout(animation, 2000)

						return
					}

					that.currentIndex++

					that.timer = setTimeout(animation, 2000)
				}, 2000)
			},
			startAnimation() {
				this.play()
			},
			stopAnimation() {
				clearTimeout(this.timer)
			}
		}
	}
</script>
