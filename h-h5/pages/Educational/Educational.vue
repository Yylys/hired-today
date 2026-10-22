<template>
	<view>
		<!--pages/form/form.wxml-->
		<view class="box">
			<view class="contaners">
				<form catchsubmit="onFormSubmit" catchreset="formReset" class="form">
					<view style="font-weight: 600;font-size: 32rpx;color: #150B3D;margin-left: 10rpx;">Educational
						experience</view>
					<view class="weui-cell__bd">
						<view class="title">School</view>
						<input class="weui-input" name="school" v-model="form.school" :value="form.school"
							placeholder="Please Enter" placeholder-class="placeholder" />
					</view>

					<view class="weui-cell__bd">
						<view class="title">Degree</view>
						<picker @change="bindPickerChange2" :value="index" range-key="memberName" :range="columns">
							<view class="weui-input">{{schoolName || 'Please Choose'}}</view>
						</picker>
					</view>
					<view class="weui-cell__bd">
						<view class="title">Major</view>
						<input class="weui-input" name="major" v-model="form.major" :value="form.major"
							placeholder="Please Enter" placeholder-class="placeholder" />
					</view>
					<view style="display: flex; ">
						<view class="weui-cell__bd" style="position: relative; width: 50%; margin-right: 30rpx;">
							<view class="title">Start Time</view>
							<picker mode="date" :value="date" @change="bindDateChange" :fields="'month'">
								<view class="weui-input">
									{{ form.startDate ? form.startDate: 'Please Choose'}}
								</view>
								<image
									style="width: 40rpx; height: 40rpx; position:absolute; bottom: 30rpx; right: 30rpx;"
									src="/static/imgs/me/rl.jpg" />
							</picker>

						</view>
						<view class="weui-cell__bd" style="position: relative; width: 50%;">
							<view class="title">End Time</view>
							<picker mode="date" :value="date" @change="bindDateChange2" :fields="'month'">
								<view class="weui-input">
									{{ form.endDate ? form.endDate: 'Please Choose'}}
								</view>
								<image
									style="width: 40rpx; height: 40rpx; position:absolute; bottom: 30rpx; right: 30rpx;"
									src="/static/imgs/me/rl.jpg" />
							</picker>
						</view>
					</view>
					<view class="weui-cell__bd">
						<view class="title">
							<view class="weui-cell__bd">
								<view class="title">Educational Experience</view>
								<textarea maxlength="-1" class="weui-input" style="padding: 30rpx 20rpx;height: 200rpx;" name="content"
									v-model="form.content" :value="form.content" placeholder="Please Enter"
									placeholder-class="placeholder" />
							</view>
						</view>
					</view>
					<view style="margin: 78rpx auto; width: 60%; padding-bottom: 100rpx;">
						<button @click="submit" type="primary" class="custom-button" block>Submit</button>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sid:null,
				columns: [],
				schoolName: null,
				form: {
					candidateSid: uni.getStorageSync('userinfo').sid,
					content: "",
					endDate: "",
					major: "",
					note: "",
					school: "",
					schoolSid: "",
					startDate: "",
					status: 0
				}

			}
		},
		methods: {
			bindPickerChange2: function(e) {

				this.schoolName = this.columns[e.detail.value].memberName; // 更新选中的 sid
				this.form.schoolSid = this.columns[e.detail.value].sid; // 更新选中的 sid
			},
			bindDateChange: function(e) {
				this.form.startDate = e.detail.value
			},
			bindDateChange2: function(e) {
				this.form.endDate = e.detail.value
			},
			geteducational() {
				uni._req('/dicts/by-key/degree', 'GET')
					.then(res => {
						if (res.code == 200) {
							// console.log(res.data);
							this.columns = res.data
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
			  submit(e) {
			    // console.log(this.data.form, 'form');
			    const eventChannel = this.getOpenerEventChannel()
			    if (this.sid == null || this.sid == 'undefined') {
			      // 新增
			      console.log(this.form,'this.data.form');
			      uni._req('/school', 'POST', this.form)
			        .then(res => {
			          if (res.code == 200) {
			            uni.showToast({
			              title: 'Submitted Successfully!',
			              icon: 'success',
			              duration: 500, // 默认2秒
			              complete: () => {
			                setTimeout(() => {
			                  uni.navigateBack({
			                    delta: 1
			                  });
			                }, 500); // 与 duration 保持一致
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
			      // 修改
			      delete this.form.sid;
			      uni._req(`/school/${this.sid}`, 'put', this.form)
			        .then(res => {
			          if (res.code == 200) {
			            uni.showToast({
			              title: 'Modified successfully！',
			              icon: 'none',
			              duration: 500, // 默认2秒
			              complete: () => {
			                setTimeout(() => {
			                  uni.navigateBack({
			                    delta: 1
			                  });
			                }, 500); // 与 duration 保持一致
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
			    getinfo(sid) {
			      uni._req(`/school/${sid}`, 'GET')
			        .then(res => {
			          if (res.code == 200) {
			              this.form=res.data
						  this.schoolName=res.data.schoolName
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
			console.log(options.sid, 'options.sid');
			if (options.sid==null || options.sid=='undefined'|| options.sid == '') {
			} else {
			    this.sid=options.sid
			  this.getinfo(options.sid)
			}
			this.geteducational()
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
						font-size: 24rpx;
						color: #9197AA;
						line-height: 36rpx;
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
			color: #9197AA;
			line-height: 32rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
	}
</style>