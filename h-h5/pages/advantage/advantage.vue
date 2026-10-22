<template>
	<view>
		<!--pages/advantage/advantage.wxml-->
		<view style="width: 670rpx; margin:0 auto;">
			<view class="title">{{title}}</view>
			<textarea maxlength="-1" v-if="personalStrengths!==null" auto-height="{{true}}" v-model="personalStrengths"
				:value="personalStrengths" class="weui-input" 
				style="padding: 30rpx 20rpx;min-height: 300rpx; max-height: 800rpx; border-radius: 30rpx;" name="need"
				type="text" placeholder="Please Enter" bindinput="handleInputChange"></textarea>
			<textarea maxlength="-1" v-if="content!==null" auto-height="{{true}}" v-model="content" :value="content" class="weui-input"
				style="padding: 30rpx 20rpx;min-height: 300rpx; max-height: 800rpx; border-radius: 30rpx;" name="need"
				type="text" placeholder="Please Enter" bindinput="handleInputChange"></textarea>
			<view style=" width: 426rpx; position: absolute; bottom: 300rpx; left: 50%; translate:-50% ; ">
				<!-- <button  color="#2623D1" @click="setdata"> Submit </button> -->
				<button @click="setdata" class="btn" hover-class="is-hover">Submit</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				personalStrengths: null,
				content: null,
			}
		},
		methods: {
			setdata() {
				const eventChannel = this.getOpenerEventChannel()
				if (this.personalStrengths != null) {
					eventChannel.emit('setadvantage', {
						data: this.personalStrengths
					});
					wx.navigateBack({
						delta: 1
					})
				} else {
					eventChannel.emit('setcontent', {
						data: this.content
					});
					wx.navigateBack({
						delta: 1
					})
				}

			}
		},
		onLoad(options) {
			console.log(options, 'options');
			if (options.personalStrengths != null) {
				this.personalStrengths = options.personalStrengths,
					this.title = 'Personal Advantage'

			} else {
				this.content = options.content,
					this.title = 'Self-Evaluation'
			}
		}
	}
</script>

<style>
	.btn {
		background-color: #2623D1;
		color: #ffffff
	}

	.is-hover {
		color: #FFFFFF;
		background-color: #2623D1;
		border-color: #179b16;
	}

	/* pages/advantage/advantage.wxss */
	.weui-input {
		width: 94%;
		min-height: 72rpx;
		background: #FFFFFF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		padding: 10rpx 20rpx;
		font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
		font-weight: 400;
		font-size: 28rpx;
		color: #9197AA;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.title {
		font-family: DM Sans, DM Sans;
		font-weight: 600;
		font-size: 32rpx;
		color: #150B3D;
		line-height: 44rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin: 30rpx 0;
	}
</style>