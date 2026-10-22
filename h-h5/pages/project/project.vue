<template>
	<view>
		<!--pages/form/form.wxml-->
		<view class="box">
			<view class="contaners">
				<form catchsubmit="onFormSubmit" catchreset="formReset" class="form">
					<view style="font-weight: 600;font-size: 32rpx;color: #150B3D;margin-left: 10rpx;">Project
						experience</view>
					<view class="weui-cell__bd">
						<view class="title">Project name</view>
						<input class="weui-input" name="projectName" v-model="form.projectName"
							:value="form.projectName" placeholder="Please Enter" placeholder-class="placeholder" />
					</view>
					<view class="weui-cell__bd">
						<view class="title">Role Played</view>
						<input class="weui-input" name="projectRole" v-model="form.projectRole"
							:value="form.projectRole" placeholder="Please Enter" placeholder-class="placeholder" />
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
								<view class="title">Project Description</view>
								<textarea maxlength="-1" class="weui-input" style="padding: 30rpx 20rpx;min-height: 200rpx;" name="content"
									v-model="form.descriptionContent" :value="form.descriptionContent"
									placeholder="Please Enter" placeholder-class="placeholder" />
							</view>
						</view>
<!-- 						<view class="title">Project Perfomance</view>
						<textarea maxlength="-1" class="weui-input" style="padding: 30rpx 20rpx;min-height: 150rpx;" name="performance"
							v-model="form.achievementsContent" :value="form.achievementsContent"
							placeholder="Please Enter" placeholder-class="placeholder" /> -->
					</view>
					<view style="margin: 78rpx auto; width: 60%; padding-bottom: 100rpx;">
						<button @click="submit" type="primary" class="custom-button" block>Submit</button>
					</view>
				</form>
			</view>
			<van-popup show="{{ show }}" bind:close="onClose" position="bottom">
				<van-datetime-picker type="date" value="{{ currentDate }}" bind:input="onInput" bind:confirm="onsucces"
					bind:cancel="onClose" min-date="{{ minDate }}" formatter="{{ formatter }}" />
			</van-popup>
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
				sid:null,
				date: currentDate,
				form: {
					achievementsContent: "",
					candidateSid: uni.getStorageSync('userinfo').sid,
					descriptionContent: "",
					endDate: "",
					note: "",
					projectName: "",
					projectRole: "",
					startDate: "",
					status: 0
				},
			}
		},
		methods: {
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
				return `${year}-${month}`;
			},
			bindDateChange: function(e) {
				this.form.startDate = e.detail.value
			},
			bindDateChange2: function(e) {
				this.form.endDate = e.detail.value
			},
			submit() {
			  console.log(this.form, 'form');
			  const eventChannel = this.getOpenerEventChannel()
			
			  if (this.sid ==null || this.sid=='undefined') {
			    // 新增
			    uni._req('/project', 'POST', this.form)
			      .then(res => {
			        if (res.code == 200) {
			          uni.showToast({
			            title: 'Modified successfully！',
			            icon: 'success',
			            duration: 2000, // 默认2秒
			            complete: () => {
			              setTimeout(() => {
			                uni.navigateBack({
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
			    // 修改
			    delete this.form.sid;
			    uni._req(`/project/${this.sid}`, 'put', this.form)
			      .then(res => {
			        if (res.code == 200) {
			          uni.showToast({
			            title: 'Modified successfully！',
			            icon: 'none',
			            duration: 1000, // 默认2秒
			            complete: () => {
			              setTimeout(() => {
			                uni.navigateBack({
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
			getinfo(sid) {
			  uni._req(`/project/${sid}`, 'GET')
			    .then(res => {
			      if (res.code == 200) {
			        console.log(res.data, '详情');
					// res.companyCountry=res.companyCountry
			         this.form=res.data
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
				console.log(options.sid=='null' || options.sid=='undefined' || options.sid =='' ,'33333');
			    if (options.sid==null || options.sid=='undefined' || options.sid =='' ||  options.sid=='null') { } else {
			        this.sid=options.sid
			      this.getinfo(options.sid)
			    }
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
			font-size: 28rpx;
			color: #9197AA;
			line-height: 32rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
	}
	.custom-button {
	  background-color: #2623D1; /* 设置自定义背景颜色 */
	  color: white; /* 设置文字颜色 */
	  border: none; /* 去掉默认边框 */
	}
	
	/* 添加点击效果 */
	.custom-button:active {
	  background-color: #1D1A8D; /* 点击时的背景颜色 */
	}
</style>