<template>
	<view>
		<!--pages/expectations/expectations.wxml-->
		<view class="box">
			<view class="contaners">
				<form catchsubmit="onFormSubmit" catchreset="formReset" class="form">
					<!-- 					<view class="weui-cell__bd">
						<view class="title">Preferred Work Location</view>
						<input class="weui-input" name="desiredCity" v-model="expectations.desiredCity"
							:value="expectations.desiredCity" placeholder="Please Enter"
							placeholder-class="placeholder" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Desired Job Position</view>
						<input class="weui-input" name="desiredIndustry" v-model="expectations.desiredIndustry"
							:value="expectations.desiredIndustry" placeholder="Please Enter"
							placeholder-class="placeholder" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Monthly minSalary Exception</view>
						<input bindblur="onInput" class="weui-input" name="minSalary" v-model="expectations.minSalary"
							:value="expectations.minSalary" placeholder="Please Enter"
							placeholder-class="placeholder" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Monthly maxSalary Exception</view>
						<input bindblur="onInput" class="weui-input" name="maxSalary" v-model="expectations.maxSalary"
							:value="expectations.maxSalary" placeholder="Please Enter"
							placeholder-class="placeholder" />
					</view> -->
					<view class="weui-cell__bd" style="background-color: #fff; margin-top: 20rpx; border-radius: 20rpx;"
						v-for="(item, index) in expectations.cardList">
						<!-- 循环 -->
						<view class="card">
							<view class="title">Preferred City</view>
							<input class="weui-inputs" bindinput="handleInputChange(index)" v-model="item.desiredCity"
								:value="item.desiredCity" placeholder="Please Enter" placeholder-class="placeholder" />
						</view>
						<view class="card">
							<view class="title">Desired Position</view>
							<input class="weui-inputs" bindinput="handleInputChange1(index)"
								v-model="item.desiredIndustry" :value="item.desiredIndustry" placeholder="Please Enter"
								placeholder-class="placeholder" />
						</view>
						<view class="card">
							<view class="title">Expected Salary
								<view style="color: #9197AF;">(Please enter a whole number in CNY.)</view>
							</view>
							<view style="display: flex; align-items: center; justify-content: space-between;">
								￥<input class="weui-inputs1" bindblur="onInput" bindinput="handleInputChange2(index)"
									v-model="item.minSalary" :value="item.minSalary" placeholder="Min Salary" />
								-￥
								<input class="weui-inputs1" bindblur="onInput" bindinput="handleInputChange3(index)"
									v-model="item.maxSalary" :value="item.maxSalary" placeholder="Max Salary" />
							</view>
						</view>
						<view class="card">
							<view class="title">Desired Job Type</view>
							<!-- 							<input disabled bind:tap="shows" data-index="{{index}}" class="weui-inputs"
								name="companyName" value="{{item.workTypeName}}" placeholder="Please Enter"
								placeholder-class="placeholder" /> -->
							<picker @change="(event) => bindPickerChange(event,item)" :value="sid"
								range-key="memberName" :range="columns">
								<view class="weui-inputs">{{item.workTypeName || 'Please Choose'}}</view>
							</picker>
						</view>
						<view style="width: 520rpx; margin:50rpx auto;">
							<button v-if="expectations.cardList.length-1==index"
								style="color: #FF9228; display: flex; align-items: center; justify-content: center; box-shadow: 0px 2px 10px 0px rgba(153, 171, 198, 0.28);"
								@click="onAdd" block>
								<img src="/static/imgs/me/Add@2x.png"
									style="width: 50rpx; height: 50rpx; margin-right: 30rpx;" />Add position</button>
						</view>
					</view>
					<view style="margin: 78rpx auto; width: 60%; padding-bottom: 100rpx;">
						<button @click="onFormSubmit" type="primary" color="#2623D1" block>Submit</button>
					</view>
				</form>
			</view>
			<van-popup show="{{ show }}" bind:close="onClose" position="bottom">
				<van-picker columns="{{ columns }}" default-index="{{ 1 }}" bind:cancel="onClose"
					bind:confirm="onConfirm" show-toolbar title="Job Type" />
			</van-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sid: null,
				expectations: {
					candidateSid: wx.getStorageSync('userinfo').sid,
					cardList: [{
						desiredCity: "",
						desiredIndustry: "",
						maxSalary: '',
						minSalary: '',
						note: "",
						status: 0,
						workTypeSid: ""
					}],
					desiredCity: "",
					desiredIndustry: "",
					maxSalary: '',
					minSalary: '',
					note: "",
					status: 0
				},
				index: null,
				columns: [],
			}
		},
		methods: {
			getexperience() {
				uni._req('/dicts/by-key/workType', 'GET')
					.then(res => {
						if (res.code == 200) {
							this.columns = res.data

						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
					});
			},
			bindPickerChange(e, item) {
				console.log(e, 'e');
				console.log(item, 'item');
				// console.log('picker发送选择改变，携带值为', e.detail.value)
				// this.index = e.detail.value
				item.workTypeName = this.columns[e.detail.value].memberName; // 更新选中的 sid
				item.workTypeSid = this.columns[e.detail.value].sid; // 更新选中的 sid
			},
			onAdd() {
				// if (!wx.getStorageSync('Authorization')) return
				uni.showModal({
					title: '',
					content: 'Are you sure you want to add a second job preference?',
					confirmText: 'Cancel',
					cancelText: 'Add',
					confirmColor: '#9EA5B8',
					cancelColor: '#2623D1',
					complete: res => {
						if (res.cancel) {
							this.expectations.cardList.push({
								desiredCity: "",
								desiredIndustry: "",
								maxSalary: '',
								minSalary: '',
								note: "",
								status: 0,
								workTypeSid: ""
							});
						}
					},
				});
			},
			onFormSubmit(e) {
				// console.log(this.sid,'this.sid');
				// console.log( this.expectations,' this.expectations');

				if (!this.sid) {
					// 新增
					uni._req('/expectations', 'POST', this.expectations)
						.then(res => {
							if (res.code == 200) {
								uni.showToast({
									title: 'Submitted Successfully!',
									icon: 'success',
								});
								uni.navigateBack({
									delta: 1
								})
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							}
						})
						.catch(err => {
							console.error('Request Failure', err);
						});
				} else {
					// 编辑
					console.log('编辑');
					delete this.expectations.sid;
					uni._req(`/expectations/${this.sid}`, 'put', this.expectations)
						.then(res => {
							if (res.code == 200) {
								uni.showToast({
									title: 'Modified successfully！',
									icon: 'none',
									duration: 0, // 默认2秒
									complete: () => {
										setTimeout(() => {
											uni.navigateBack({
												delta: 1
											});
										}, 0); // 与 duration 保持一致
									}
								});

							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							}
						})
						.catch(err => {
							console.error('Request Failure', err);
						});
				}

			},
			getinfo() {
				let sid = uni.getStorageSync('userinfo').sid
				uni._req(`/expectations/${sid}`, 'GET')
					.then(res => {
						if (res.code == 200) {
							this.expectations.cardList = res.data
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
					});
			},
		},
		onLoad(options) {
			if (options.sid == null || options.sid == 'undefined' || options.sid == '') {} else {
				this.sid = options.sid
				this.getinfo(options.sid)
			}

			this.getexperience()
		}
	}
</script>

<style>
	.box {
		background-color: #F9F9F9;
		width: 100%;
		min-height: 100vh;
		padding: 1rpx 0;

		.contaners {
			margin: 20rpx auto;
			width: 694rpx;
			height: 97vh;
			border-radius: 20rpx 20rpx 20rpx 20rpx;

			.form {
				.weui-cell__bd {
					padding: 1rpx;
					font-size: 24rpx;

					.title {
						margin: 20rpx 10rpx;
						font-family: DM Sans, DM Sans;
						font-weight: 500;
						font-size: 24rpx;
						color: #150A33;
						line-height: 34rpx;
						text-align: left;
						font-style: normal;
						text-transform: none;
					}

					.weui-input {
						box-sizing: border-box;
						width: 100%;
						margin: 0 auto;
						min-height: 92rpx;
						background: #FFFFFF;
						border-radius: 20rpx;
						padding: 20rpx 20rpx;
						font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
						font-weight: 400;
						font-size: 28rpx;
						color: #9197AA;
						line-height: 32rpx;
						text-align: left;
						font-style: normal;
						text-transform: none;
					}
				}
			}
		}
	}

	.placeholder {
		font-family: DM Sans, DM Sans;
		font-weight: 400;
		font-size: 24rpx;
		color: #524B6B;
		line-height: 34rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.form-item {
		margin-bottom: 20rpx;
	}

	.error-msg {
		color: red;
		font-size: 14px;
	}

	.card {
		width: 95%;
		margin: 0 auto;

		.weui-inputs {
			min-height: 72rpx;
			background: #F7F7F7;
			border-radius: 30rpx;
			padding: 10rpx 20rpx;
			font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
			font-weight: 400;
			font-size: 24rpx;
			/* color: #9197AA; */
			line-height: 72rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}

		.weui-inputs1 {
			min-height: 72rpx;
			width: 35%;
			background: #F7F7F7;
			border-radius: 30rpx;
			padding: 10rpx 20rpx;
			font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
			font-weight: 400;
			font-size: 24rpx;
			/* color: #9197AA; */
			line-height: 72rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
	}

	.uni-icons {
		transform: rotate(45deg);
	}
</style>