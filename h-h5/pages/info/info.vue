<template>
	<view>
		<!--pages/information/information.wxml-->
		<view class="box">
			<view class="contaners">
				<view style="text-align: center;">
					<!-- 头像 -->
					<view class="upload_warp">
						<view class="head">
							<view class="avatar_pick" hover-class="tapstate_opacity">
								<button class="avatar_wrapper" @click="chooseImage">
									<image v-if="form.avatar" :src="uni_ImgbaseURL + form.avatar" class="uploadIcon"
										mode="aspectFill" />
									<image v-if="!form.avatar" src="/static/imgs/avator.jpg" class="uploadIcon"
										mode="aspectFill" />
								</button>
							</view>
						</view>
					</view>
				</view>
				<form catchsubmit="onFormSubmit" catchreset="formReset" class="form">
					<view class="weui-cell__bd">
						<view class="title">Full Name <span class="icon">*</span></view>
						<input class="weui-input" name="fullName" v-model="form.fullName" :value="form.fullName"
							placeholder="Please Enter" placeholder-class="placeholder" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Gender <span class="icon">*</span></view>
						<view class="bac">
							<view class="bacs" @click="setsex(0)">
								<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
									:src="form.sex==0 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
									mode="aspectFill" /><span>Male</span>
							</view>
							<view class="bacs" @click="setsex(1)">
								<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
									:src="form.sex==1 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
									mode="aspectFill" /><span>Female</span>
							</view>
						</view>
					</view>
					<view class="weui-cell__bd" style="position: relative;">
						<view class="title">Date Of Birth <span class="icon">*</span></view>
						<view class="uni-list-cell-db">
							<picker mode="date" :value="date" @change="bindDateChange">
								<view class="weui-input"> {{ form.birth? form.birth: 'Please Choose'}}</view>
								<image
									style="width: 40rpx; height: 40rpx; position:absolute; bottom: 30rpx; right: 30rpx;"
									src="/static/imgs/me/rl.jpg" />
							</picker>
						</view>
					</view>

					<view class="weui-cell__bd">
						<view class="title">Email Address <span class="icon">*</span></view>
						<input class="weui-input" name="email" v-model="form.email" :value="form.email" type="text"
							placeholder="Please Enter" placeholder-class="placeholder" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Phone Number <span class="icon">*</span></view>
						<input class="weui-input" name="phone" v-model="form.phone" :value="form.phone" type="text"
							placeholder="Please Enter" placeholder-class="placeholder" bindblur="onPhoneInput" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">WeChat ID/Account <span class="icon">*</span>
						 <view style="color: #9197AF;">Searchable WeChat ID (not your nickname)</view> 
						</view>
						<input class="weui-input" name="weChat" v-model="form.weChat" :value="form.weChat" type="text"
							placeholder="Please Enter" placeholder-class="placeholder" bindblur="onPhoneInput" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Nationality <span class="icon">*</span></view>
						<view @click="goinfo" class="weui-input">{{form.countriesName || 'Please Choose'}}</view>
					</view>
					<view class="weui-cell__bd">
						<view class="title">Educational Background <span class="icon">*</span></view>
						<picker @change="bindPickerChange" :value="index" range-key="memberName" :range="columns1">
							<view class="weui-input">{{form.degreeName || 'Please Choose'}}</view>
						</picker>
					</view>
					<view class="weui-cell__bd">
						<view class="title">Work Experience <span class="icon">*</span></view>
						<picker @change="bindPickerChange2" :value="index" range-key="memberName" :range="columns2">
							<view class="weui-input">{{form.workName || 'Please Choose'}}</view>
						</picker>
					</view>

					<view style="margin: 78rpx auto; width: 60%; padding-bottom: 100rpx;">
						<!-- <uni-button @click="onFormSubmit" type="primary" color="#2623D1" block>Submit</uni-button> -->
						<button @click="onFormSubmit" type="primary" class="custom-button" block>Submit</button>
					</view>
				</form>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				uni_ImgbaseURL: uni._ImgbaseURL,
				date: currentDate,
				sid: null,
				columns1: [],
				columns2: [],
				form: {
					createType: 2,
					ascriptionUserId: '',
					recruiter: 1,
					recommendPrice: 0,
					avatar: null,
					fullName: '',
					sex: 0,
					birth: null,
					email: null,
					phone: null,
					weChat: null,
					countriesName: null,
					degreeName: null,
					workName: null,
					countriesSid: null,
					degreeSid: null,
					workSid: null,
				},
			}
		},
		methods: {
			setsex(e) {
				this.form.sex = e
			},
			onFormSubmit() {
				if (!this.sid) {
					uni._req('/candidate/save', 'POST', this.form)
						.then(res => {
							if (res.code == 200) {
								this.getinfo(res.data)
								uni.showToast({
									title: 'Submitted Successfully!',
									icon: 'none',
									duration: 2000, // 默认2秒
									complete: () => {
										setTimeout(() => {
											wx.navigateBack({
												delta: 1
											});
										}, 2000); // 与 duration 保持一致
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
				} else {
					uni._req(`/candidate/${this.sid}/update`, 'put', this.form)
						.then(res => {
							if (res.code == 200) {
								this.getinfo(res.data)
								uni.showToast({
									title: 'Submitted Successfully!',
									icon: 'none',
									duration: 2000, // 默认2秒
									complete: () => {
										setTimeout(() => {
											wx.navigateBack({
												delta: 1
											});
										}, 2000); // 与 duration 保持一致
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
			showPopup() {
				// console.log(this, 'this');
				this.$refs.popup.open()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			bindDateChange: function(e) {
				this.form.birth = e.detail.value
			},

			bindPickerChange: function(e) {
				// console.log(e, 'e');
				// console.log('picker发送选择改变，携带值为', e.detail.value)
				// this.index = e.detail.value
				this.form.degreeName = this.columns1[e.detail.value].memberName; // 更新选中的 sid
				this.form.degreeSid = this.columns1[e.detail.value].sid; // 更新选中的 sid
			},

			bindPickerChange2: function(e) {
				// console.log(e, 'e');
				// console.log('picker发送选择改变，携带值为', e.detail.value)
				// this.index = e.detail.value
				this.form.workName = this.columns2[e.detail.value].memberName; // 更新选中的 sid
				this.form.workSid = this.columns2[e.detail.value].sid; // 更新选中的 sid
			},

			geteducational() {
				uni._req('/dicts/by-key/degree', 'GET')
					.then(res => {
						if (res.code == 200) {
							console.log(res.data);
							// for (let i = 0; i < res.data.length; i++) {
							// 	res.data[i].text = res.data[i].memberName;
							// }
							this.columns1 = res.data
						} else {
							wx.showToast({
								title: res.msg,
								icon: 'error'
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
					});
			},
			getexperience() {
				uni._req('/dicts/by-key/Experience', 'GET')
					.then(res => {
						if (res.code == 200) {
							console.log(res.data);
							// for (let i = 0; i < res.data.length; i++) {
							// 	res.data[i].text = res.data[i].memberName;
							// }
							this.columns2 = res.data
						} else {
							wx.showToast({
								title: res.msg,
								icon: 'error'
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
					});
			},
			getinfo(candidateSid) {
				uni._req(`/candidate/${candidateSid}/candidate-h5`, 'GET')
				// v1/candidate/196-920210eec9fd4ce385080be486ef6de2/candidate-info
					.then(res => {
						if (res.code == 200) {
							// console.log(res.data, '个人信息');
							uni.setStorageSync('userinfo', res.data)
							// this.setData({
							this.form.avatar = res.data.avatar,
								this.form.birth = res.data.birth,
								this.form.email = res.data.email,
								this.form.fullName = res.data.fullName,
								this.form.phone = res.data.phone,
								this.form.sex = res.data.sex,
								this.form.weChat = res.data.weChat,
								this.form.degreeSid = res.data.degree.sid,
								this.form.workSid = res.data.work.sid,
								this.form.countriesSid = res.data.countries.sid,
								this.form.degreeName = res.data.degree.memberName,
								this.form.workName = res.data.work.memberName,
								this.form.countriesName = res.data.countries.countriesName,
								this.sid = res.data.sid
							// });
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'error'
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
					});
			},
			goinfo() {
				uni.navigateTo({
					url: "/pages/location/location", // 路由地址
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						acceptDataFromOpenedPage: (data) => {
							console.log(data, 'data');
							this.form.countriesSid = data.data.sid; // 设置国家的 SID
							this.form.countriesName = data.data.countriesName; // 设置国家的名称
						},
					},
				});
			},
			chooseImage() {
				// 选择图片
				uni.chooseImage({
					count: 1, // 默认选择一张图片
					sizeType: ['original', 'compressed'], // 指定原图或者压缩图
					sourceType: ['album', 'camera'], // 指定来源是相册还是摄像头
					success: (res) => {
						// 获取选中的图片临时路径
						// this.avatarUrl = res.tempFilePaths[0];
						console.log(res, ' res.tempFilePaths');

						// 可以在这里上传图片到服务器
						this.uploadImage(res.tempFilePaths[0]);
					},
					fail: (err) => {
						console.error(err);
					}
				});
			},

			uploadImage(filePath) {
				// 图片上传逻辑
				const uploadTask = uni.uploadFile({
					url: this.uni_ImgbaseURL + '/public',
					filePath: filePath,
					name: 'file', // 服务器要求的字段名
					header: {
						// 'Content-Type': 'multipart/form-data'
					},
					success: (uploadFileRes) => {
						console.log(JSON.parse(uploadFileRes.data).data, 'url');

						this.form.avatar = JSON.parse(uploadFileRes.data).data.url
						console.log(this.form, 'this');
					},
					fail: (err) => {
						console.error('上传失败', err);
					}
				});
			},


		},
		onLoad(options) {
			console.log(uni.getStorageSync('userinfo').sid, '5555555');
			if (uni.getStorageSync('userinfo')) {
				this.getinfo(uni.getStorageSync('userinfo').sid)
			}
			this.form.ascriptionUserId=options.sid
			this.geteducational()
			this.getexperience()
			console.log(this.form.ascriptionUserId,'this.ascriptionUserId');
		}
	}
</script>

<style>
	.box {
		background-color: #F9F9F9;
		width: 100%;
		min-height: auto;
		padding: 1rpx 0;

		.contaners {
			margin: 20rpx auto;
			width: 694rpx;
			/* height: 97vh; */
			border-radius: 20rpx 20rpx 20rpx 20rpx;

			.form {
				.weui-cell__bd {
					padding: 1rpx;
					font-size: 24rpx;
					margin: 0rpx 24rpx;

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
						width: 94%;
						min-height: 72rpx;
						background: #FFFFFF;
						border-radius: 30rpx;
						padding: 10rpx 20rpx;
						font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
						font-weight: 400;
						font-size: 28rpx;
						color: #9197AA;
						line-height: 72rpx;
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

	.bac {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.bacs {
			display: flex;
			align-items: center;
			padding: 5rpx 10rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			width: 45%;
			height: 80rpx;

			.act {
				width: 3vw;
				height: 3vw;
				background-color: #FFB237;
				border-radius: 50%;
				margin: 10rpx 25rpx;
				border: 2px solid white;
				position: relative;

				/* 设置为相对定位，以便子元素绝对定位 */
				/* 第二层圆环 */
				&::after {
					content: "";
					position: absolute;
					width: 4vw;
					height: 4vw;
					border: 6rpx solid #FFB237;
					/* 设置中间圆环的颜色和宽度 */
					border-radius: 50%;
					top: 50%;
					/* 将元素的顶部定位在父元素的中间位置 */
					left: 50%;
					/* 将元素的左侧定位在父元素的中间位置 */
					transform: translate(-50%, -50%);
					/* 使用负的50%平移来使元素居中 */
				}
			}

			/* 第一层圆环 */
			.noe {
				width: 3vw;
				height: 3vw;
				border-radius: 50%;
				margin: 10rpx 25rpx;
				border: 2px solid #524B6B;
				position: relative;
			}
		}
	}


	.head {
		position: relative;
		height: 170rpx;

		.avatar_pick {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
		}

		.avatar_wrapper {
			padding: 0 !important;
			width: 162rpx !important;
			height: 162rpx !important;
			border-radius: 50% !important;
		}

		.uploadIcon {
			position: absolute;
			right: 0;
			bottom: 0rpx;
			border-radius: 50%;
			width: 162rpx !important;
			height: 162rpx !important;
		}
	}

	.hqyzm {
		color: #ef6826;
		font-size: 30rpx;
	}

	.get_phone {
		color: #fff;
		border-radius: 50rpx;
		background: #0AA19A;
	}

	.imgwarp {
		position: relative;

		.xiangji {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 55rpx;
			height: 55rpx;
		}
	}

	.upload_s {
		width: 142rpx;
		height: 144rpx;
	}

	.getCallNumber {
		font-size: 30rpx;
		height: 62rpx;
		line-height: 62rpx;
		background: var(--themeColor);
		border-radius: 55rpx;
		color: #fff;
	}
	.icon{
	  color: red;
	  margin-left: 5rpx;
	}
</style>