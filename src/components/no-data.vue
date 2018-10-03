<style scoped>
.no-data {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	color: #80A8CC;
	font-size: .28rem;
	pointer-events: none;
	background: url(~assets/no-data.png) center no-repeat;
	background-size: 1.28rem 1.08rem;
}
.no-data p {
	margin-top: 1.8rem;
}
</style>

<template>
	<div class="no-data">
		<p v-text="text"></p>
	</div>
</template>

<script>
	export default {
		props: {
			text: {
				default: "暂无测试题目"
			}
		}
	}
</script>