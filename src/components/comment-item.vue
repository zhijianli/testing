<template>
	<li class="comment-item" :data-name="item.mName" :data-id="item.commentId">
		<div class="comment-info">
			<template v-if="item.mHeadPortrait && item.mHeadPortrait !== 'undefined' && item.mHeadPortrait !== 'null'">
				<template v-if="item.mHeadPortrait.startsWith('http')">
					<img :src="item.mHeadPortrait">
				</template>
				<template v-else>
					<img :src="prefix + item.mHeadPortrait">
				</template>
			</template>
			<template v-else>
				<img src="//picture.120xinmao.com/default-avatar.png">
			</template>


			<div>
				<span class="nickname" v-text="item.mName"></span>
				<span class="time">{{item.commentTime | timeFormat}}</span>
			</div>
		</div>
		<p class="comment-content" v-if="item.parentCommentId === 0">{{item.commentContent}}</p>
		<p class="comment-content" v-else>回复 {{item.parentCommentName}}： {{item.commentContent}}</p>
	</li>
</template>

<script>
	import {mapState} from "vuex"

	import {timeFormat} from "utils"

	export default {
		props: ["item"],
		computed: mapState(["prefix", "suffix"]),
		filters: {
			timeFormat(value) {
				return timeFormat(value)
			}
		}
	}
</script>