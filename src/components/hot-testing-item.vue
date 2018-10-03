<style scoped>
.hot-testing-item {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: .24rem 0;
	color: #999;
	font-size: .24rem;
	box-sizing: border-box;
	border-bottom: 1px solid #EEE;

	& h2 {
		padding-right: .3rem;
		margin-bottom: .26rem;
		color: #333;
		font-size: .3rem;
	}
}
.hot-testing-item:last-child {
	border-bottom: none;
}
</style>

<template>
	<li class="hot-testing-item" @click="go(item.id)">
		<h2 class="ellipsis" v-text="item.name"></h2>
		<p>{{item.numberOfTest}}已测</p>
	</li>
</template>

<script>
	export default {
		props: ["item"],
		methods: {
			go(id) {
				this.$router.push({
					path: `/detail/${id}`
				})
			}
		}
	}
</script>