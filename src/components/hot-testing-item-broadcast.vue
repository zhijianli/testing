

<template >

	<li class="hot-testing-item" @click="go(item.id)">
		<!-- <h2 class="ellipsis" v-text="item.name"></h2> -->
		<!-- <p>{{item.numberOfTest}}已测</p> -->
		  <img class="broadcastImg" :src="'https://image-testscale.oss-cn-hangzhou.aliyuncs.com/'+item.relatePicSrc">
			<div class="page-cover">
				<div class="item-name">
          {{item.name}}
				</div>
				<div class="numberOfTest">
					已测{{item.numberOfTest}}人
				</div>
			</div>
<!-- swiper -->

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


<style scoped>
.hot-testing-item {
	/* display: flex;
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
	} */
	width: 100%;
	height: 2.5rem;
	display: inline-block;
}
.broadcastImg{
	width:3rem;
	height:2.2rem;
	margin-right: .3rem;
	border-radius: .1rem;
}
.page-cover{
	/* 黑色遮罩大小与位置 */
	position: relative;
	width:3rem;
	height:1rem;
	top: -1rem;
	/* border-radius: 4px; */
	width:300rpx;
	height:99rpx;

	/* 黑色遮罩颜色调节 */
	background: #000000;
	opacity:0.6;
	border-radius: .1rem;
}
.item-name{
	padding-left: 0.2rem;
	padding-top: 0.1rem;
  color: #FFFFFF;
	font-size: .26rem;
}
.numberOfTest{
  top:0.2rem;
	padding-left: 0.2rem;
	font-size:.22rem;
	color:#EDEDED;

}

.hot-testing-item:last-child {
	border-bottom: none;
}



</style>
