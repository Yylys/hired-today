<template>
	<view v-if="!type" style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center; color:#524B6B">
		Your resume has been successfully entrusted to me, and I will contact you as soon as possible!
	</view>
	<view v-else style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center; color:#524B6B">
		Thanks!
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: null,
			}
		},
		onLoad(options) {
			console.log(options, 'options');
			if (options.type) {
				this.type = options.type
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>