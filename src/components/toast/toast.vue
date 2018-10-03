<style scoped>
.toast-wrap {
	display: flex;
	width: 100%;
	position: fixed;
	bottom: 20%;
	z-index: 7;
	pointer-events: none;
	transition: all 0.3s;
}
.toast {
	max-width: 80%;
	padding: .2rem .2rem;
	margin: auto;
	color: #FFF;
	font-size: .28rem;
	text-align: center;
	border-radius: .1rem;
	background-color: rgba(0, 0, 0, 0.5);
}
.toast-enter, .toast-leave-active {
	opacity: 0;
	transform: scale(1.1);
}
</style>

<template>
	<transition name="toast">
		<div class="toast-wrap" v-if="isVisible">
			<div class="toast" v-text="message"></div>
		</div>
	</transition>
</template>

<script>
	export default {
		data() {
			return {
				isVisible: false,
				message: "",
				duration: 2000
			}
		},
		mounted() {
			this.isVisible = true

			this.startTimer()
		},
		methods: {
			startTimer() {
				setTimeout(() => {
					this.hiddenToast()
				}, this.duration)
			},
			hiddenToast() {
				this.isVisible = false
			}
		}
	}
</script>