<template>
	<li class="testing-item" @click="go(item.id)">
		<div class="testing-info-wrapper">
			<div class="testing-info">
				<h2 class="line-overflow" v-text="item.name || item.relateTestScaleName"></h2>
				<p class="line-overflow" v-text="item.abstractStr"></p>
			</div>
			<img :src="prefix + item.relatePicSrc + suffix" v-if="typeof item.relatePicSrc !== 'undefined'">
			<img :src="prefix + item.tsiMessage.relatePicSrc + suffix" v-else>
		</div>

		<slot name="footer"></slot>



	</li>
</template>

<script>
	import {mapState} from "vuex"

	export default {
		props: ["item", "type"],
		computed: mapState(["prefix", "suffix"]),
		methods: {
			go(id) {
				if (this.type === 1) {
					this.$router.push({
						path: `/result/${id}`
					})
					return
				}
				console.log(55555)
				this.$router.push({
					path: `/detail/${id}`
				})
			}
		}
	}
</script>

<style scoped>
.testing-item {
	padding: .42rem .3rem .32rem 0;
	border-bottom: 1px solid #EEE;
}
.testing-item:last-child {
	border-bottom: none;
}
.testing-info-wrapper {
	display: flex;
	justify-content: space-between;
	margin-bottom: .2rem;

	& img {
		width: 1.8rem;
		height: 1.8rem;
		margin-left: .6rem;
		border-radius: 8px;
		object-fit: cover;
	}
}
.testing-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& h2 {
		color: #333;
		font-size: .36rem;
	}

	& p {
		color: #666;
		font-size: .26rem;
		line-height: .4rem;
		word-break: break-all;
	}
}
.testing-count {
	display: flex;
	color: #BFBFBF;
	font-size: .24rem;
	line-height: .42rem;

	& span {
		margin-left: auto;
	}
}
</style>
