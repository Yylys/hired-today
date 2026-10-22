<template>

	<div class="box" style="background-color: #F9F9F9; min-height: 100vh;">
		<div style="width: 120rpx; height: 120rpx; margin: 0rpx auto 50rpx; position: relative; padding-top: 50rpx;"
			@click="goinfo({path:'/pages/info/info',sid:userId})">
			<image style="width: 100%; height: 100%; border-radius: 50%;"
				:src="userinfo ?  uni_ImgbaseURL + userinfo.avatar : '/static/imgs/deavator.jpg'" mode="aspectFill" />
			<image style="width: 30rpx; height: 30rpx; position: absolute;bottom: 0; right: 10rpx;"
				src='/static/imgs/edimg.jpg' mode="aspectFill" />
		</div>
		<div class="titles">
			Submitting a complete and detailed resume can help me understand your situation and job expectations more
			quickly, allowing me to better assist you in starting your career.
		</div>
		<!--pages/myresume/myresume.wxml-->
		<div class="box">
			<div class="container">
				<!-- About me -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/组 711119@2x.png" mode="aspectFill" />
							<span class="title">About Me</span>
						</div>
						<div class="right">
							<!-- <image src="/static/imgs/me/hg.jpg" mode="aspectFill" /> -->
							<image @click="goinfo({path:'/pages/info/info',sid:userId})" src="/static/imgs/me/Edit.png"
								mode="aspectFill" />
						</div>
					</div>
					<div class="btm" v-if="userinfo">
						<div class="card2">
							<div class="weui-cell__bd">
								<div class="title">Full Name</div>
								<input disabled class="weui-input" name="fullName" :value="userinfo.fullName"
									placeholder="Please Enter" placeholder-class="placeholder" />
							</div>
							<div class="weui-cell__bd" v-if="userinfo">
								<div class="title">Gender</div>
								<div class="bac">
									<view class="bacs">
										<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
											:src="userinfo.sex==0 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
											mode="aspectFill" /><span>Male</span>
									</view>
									<view class="bacs">
										<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
											:src="userinfo.sex==1 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
											mode="aspectFill" /><span>Female</span>
									</view>

								</div>
							</div>
						</div>
						<div @click="goinfo({path:'/pages/info/info',sid:userId})" class="more">See more
						</div>
					</div>
				</div>
				<!-- Job searching status -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/组 711141@2x.png" mode="aspectFill" />
							<span class="title">Job Searching Status</span>
						</div>
						<div class="right">
						</div>
					</div>
					<div class="btm">
						<div class="card2">
							<div class="weui-cell__bd">
								<div class="bac" style="margin: 20rpx 0">
									<div class="bacs2" @click="setstatus(0)">
										<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
											:src="form.jobStatus==0 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
											mode="aspectFill" /><span>Resignation - Arrive at any time</span>
									</div>
									<div class="bacs2" @click="setstatus(1)">

										<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
											:src="form.jobStatus==1 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
											mode="aspectFill" /><span>On the job -
											Arrive within the month</span>
									</div>
									<div class="bacs2" @click="setstatus(2)">
										<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
											:src="form.jobStatus==2 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
											mode="aspectFill" /><span>Employed -
											Consider Opportunities</span>
									</div>
									<div class="bacs2" @click="setstatus(4)">

										<image style="width: 36rpx; height: 36rpx; margin:0 10rpx ;"
											:src="form.jobStatus==4 ? '/static/imgs/Select@2x.png' : '/static/imgs/Select@2x-2.png'"
											mode="aspectFill" /><span>Employed - not
											considered yet</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Personal Label -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon Skill@2x.png" mode="aspectFill" />
							<span class="title">Personal Tags</span>
						</div>
						<div class="right">
							<image @click="open" src="/static/imgs/me/Add@2x.png" mode="aspectFill" />
							<image @click="open" src="/static/imgs/me/Edit.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm">
						<div class="card2" v-if="taglist">
							<div class="weui-cell__bd">
								<div style="display: flex; flex-wrap: wrap; align-items: center;">
									<div style="background: #F5F4F6; padding: 20rpx 30rpx; border-radius: 20rpx; margin:15rpx 5rpx"
										v-for="(item,index) in taglist.slice(0, 5)">
										{{item.memberName}}
									</div>
									<span v-if="taglist.length>5"
										style="font-size: 24rpx;color: #524B6B;margin-left: 10rpx;">+5 more</span>
								</div>
							</div>
						</div>
						<div @click="open" class="more">See More</div>
					</div>
				</div>
				<!-- Personal advantage -->
				<!-- 				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon@2x-2.png" mode="aspectFill" />
							<span class="title">Personal Advantage</span>
						</div>
						<div class="right">
							<image
								@click="goinfo({path:'/pages/advantage/advantage',data:'Personal advantage',item:form.personalStrengths})"
								src="/static/imgs/me/Edit.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm">
						<div v-if="form.personalStrengths"
							style="padding: 30rpx 0; font-size: 28rpx;color: #524B6B;  word-wrap: break-word; overflow-wrap: break-word;">
							{{form.personalStrengths}}
						</div>
					</div>
				</div> -->

				<!-- Self-evaluation -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon@2x-2.png" mode="aspectFill" />
							<span class="title">Self-Evaluation</span>
						</div>
						<div class="right">
							<image
								@click="goinfo({path:'/pages/advantage/advantage',data:'Self-evaluation',item:form.content})"
								src="/static/imgs/me/Edit.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm" v-if="form.content">
						<div
							style="padding: 30rpx 0; font-size: 28rpx;color: #524B6B; word-wrap: break-word; overflow-wrap: break-word;">
							{{ form.content }}
						</div>
					</div>
				</div>


				<!-- Job search expectations -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon resume@2x.png" mode="aspectFill" />
							<span class="title">Job Search Expectations</span>


						</div>
						<div class="right">
							<image
								@click="goinfo({path:'/pages/expectations/expectations',sid:expectations.sid ? expectations.sid : ''})"
								src="/static/imgs/me/Edit.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm">
						<div class="tit1" v-if="expectations.desiredCity">Preferred City ·
							{{ expectations.desiredCity }}
						</div>
						<div class="tit2" v-if="expectations.desiredIndustry">Desired Position ·
							{{ expectations.desiredIndustry }}
						</div>
						<div class="tit2" v-if="expectations.minSalary">Expected Salary ·
							￥{{ expectations.minSalary }}-{{ expectations.maxSalary }}</div>
					</div>
				</div>
				<!-- Work experience -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon@2x.png" mode="aspectFill" />
							<span class="title">Work Experience</span>
						</div>
						<div class="right">
							<image @click="goinfo({path:'/pages/experience/experience'})"
								src="/static/imgs/me/Add@2x.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm" v-for="(item,index) in work">
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<span class="tit1">{{item.companyName}}</span>
							<div>
								<image @click="delwork(item.sid)" src="/static/imgs/me/Icon Remove@2x.png"
									mode="aspectFill" />
								<image @click="goinfo({path:'/pages/experience/experience',sid:item.sid})"
									src="/static/imgs/me/Edit.png" mode="aspectFill" />
							</div>
						</div>
						<div class="tit2">{{ item.companyCountry }}</div>
						<div class="tit2">{{ item.industry }} · {{ item.startDate }} —— {{ item.endDate }}</div>
						<div class="tit2">{{ item.postsName }}</div>
						<div class="tit2">{{ item.department }}</div>
						<div class="tit2">{{ item.descriptionContent }}</div>
					</div>
				</div>
				<!-- Project experience -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon@2x.png" mode="aspectFill" />
							<span class="title">Project Experience</span>
						</div>
						<div class="right">
							<image @click="goinfo({path:'/pages/project/project',sid:project ?  project.sid : null})"
								src="/static/imgs/me/Edit.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm" v-if="project">
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<span class="tit1">{{ project.projectName }}</span>
						</div>
						<div class="tit2">{{ project.projectRole }}</div>
						<div class="tit2" v-if="project.startDate">{{ project.startDate }} —— {{ project.endDate }}
						</div>
						<div class="tit2">{{ project.descriptionContent }}</div>
					</div>
				</div>
				<!--Education -->
				<div class="card">
					<div class="top">
						<div class="left">
							<image src="/static/imgs/me/Icon Education@2x.png" mode="aspectFill" />
							<span class="title">Education</span>
						</div>
						<div class="right">
							<image @click="goinfo({path:'/pages/Educational/Educational'})"
								src="/static/imgs/me/Add@2x.png" mode="aspectFill" />
						</div>
					</div>
					<div class="btm" v-for="item in school">
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<span class="tit1" wx:if="{{item.school}}">{{ item.school }}</span>
							<div>
								<image @click="deledu(item.sid)" src="/static/imgs/me/Icon Remove@2x.png"
									mode="aspectFill" />
								<image @click="goinfo({path:'/pages/Educational/Educational',sid:item.sid})"
									src="/static/imgs/me/Edit.png" mode="aspectFill" />
							</div>
						</div>
						<div class="tit2" v-if="item.degree">{{ item.degree.memberName }}</div>
						<div class="tit2" v-if="item.major">{{ item.major }}</div>
						<div class="tit2" v-if="item.startDate">{{ item.startDate }} —— {{ item.endDate }}</div>
						<div class="tit2" v-if="item.content">{{ item.content }}</div>
					</div>
				</div>
				<!--Attachments -->
				<div class="card">
					<div class="tops">
						<div class="left">
							<image src="/static/imgs/me/Icon Education@2x.png" mode="aspectFill" />
							<span class="title">Attachments</span>
						</div>
						<div class="right">
							<image @click="goinfo({path:'/pages/Attachments/Attachments',item:form.images})"
								data-item="{{form.images}}" src="/static/imgs/me/Add@2x.png" mode="aspectFill" />
						</div>
					</div>
					<div
						style="color: #9197AF; border-bottom: 1px solid #DEE1E7; font-size: 24rpx; padding-bottom: 10rpx;">
						(Profile Photo, Certificates, etc.)</div>
					<div class="btm" v-if="form.images.length>0">
						<div style="display: flex; justify-content: space-between; padding:20rpx 0;">
							<image v-if="form.images.length>0" :src="form.images[0].cover"
								style="width: 47%; height: 204rpx;" mode="aspectFill" />
							<div v-if="form.images.length>1" style="width: 47%; height: 204rpx;position: relative;">
								<image :src="form.images[1].cover"
									style="width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.5); "
									mode="aspectFill" />
								<div v-if="form.images.length>2"
									style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: 700;font-size: 24rpx;color: #FFFFFF;">
									+5 pictures</div>
							</div>
						</div>
					</div>
				</div>
				<div class="titles">
					By submitting your resume, you agree to authorize me to use the information you provide to assist
					you in your job search and to share it with relevant individuals who may offer you job opportunities
					during the process.
				</div>
				<div style="margin: 78rpx auto; width: 60%; padding-bottom: 100rpx;">
					<!-- <van-button @click="submit" type="primary" color="#2623D1" block>Save and Publish</van-button> -->
					<button @click="submit" type="primary" class="custom-button" block>Save and Publish</button>
				</div>
			</div>


		</div>
		<uni-popup ref="popup" type="center" :animation="true">
			<div class="card" style="width:620rpx; margin: 0 auto;">
				<div class="top">
					<div class="left">
						<image src="/static/imgs/me/Icon Skill@2x.png" mode="aspectFill" />
						<span class="title">Personal Label</span>
					</div>
					<div class="right">
					</div>
				</div>
				<div class="btm">
					<div class="card2">
						<div class="weui-cell__bd">
							<div style="display: flex; flex-wrap: wrap; align-items: center;">
								<div style="background: #F5F4F6; padding: 20rpx 30rpx; border-radius: 20rpx; margin:15rpx 5rpx"
									v-for="item in taglist">
									{{ item.memberName }}

									<uni-icons @click="deltag(item.sid)" type="closeempty" size="10"></uni-icons>
								</div>
							</div>
						</div>
						<div>
							<div class="title">New</div>
							<div style="display: flex; align-items: center;">
								<input class="weui-inputs" v-model="tagName" :value="fullName" placeholder=""
									placeholder-class="placeholder" />
								<button @click="settag()" style="margin-left: 20rpx;" color="#2623D1" plain
									type="info">Confirm</button>
							</div>
							<div style="margin: 50rpx 0;">
								<button @click="onClose" type="primary" class="custom-button" block>Submit</button>

							</div>
						</div>
					</div>
				</div>
			</div>

		</uni-popup>

	</div>


</template>

<script>
	export default {
		data() {
			return {
				uni_ImgbaseURL: uni._ImgbaseURL,
				taglist: null,
				work: null,
				project: null,
				school: null,
				userinfo: null,
				tagName: null,
				form: {
					candidateSid: null,
					content: "",
					images: [],
					jobStatus: 0,
					note: "",
					personalStrengths: "",
					status: 0
				},
				expectations: {
					cardList: [{
						desiredCity: "",
						desiredIndustry: "",
						maxSalary: '',
						minSalary: '',
						note: "",
						status: 0,
						workTypeSid: ""
					}],
					sid: null,
					desiredCity: "",
					desiredIndustry: "",
					maxSalary: '',
					minSalary: '',
					note: "",
					status: 0
				},
			}
		},
		onLoad() {
			// this.getinfo()
			// if (uni.getStorageSync('userinfo')) {
			// 	this.getdetail(uni.getStorageSync('userinfo').sid)
			// }
			const currentUrl = window.location.href;
			// 创建 URL 对象
			const url = new URL(currentUrl);

			// 获取 userId
			const userId = url.searchParams.get('userId');
			this.userId = userId; // 存储用户ID
			this.gettype(userId)
			// const {
			// 	userid
			// } = this.$route.query;
			// this.userId = userid; // 存储用户ID
			// console.log(this.userId);
		},

		onShow() {
			this.form.candidateSid = uni.getStorageSync('userinfo').sid
			// console.log(uni.getStorageSync('userinfo'),22222);
			if (uni.getStorageSync('userinfo')) {
				this.getdetail(uni.getStorageSync('userinfo').sid)
			}
		},
		methods: {
			gettype(userId) {
				uni._req(`/candidate/is-headhunter/${userId}`, 'GET')
					.then(res => {
						if (res.code == 200) {
							// 成功逻辑（如果有）
						} else {
							// 弹窗提示用户，点击确定后尝试关闭页面
							uni.showModal({
								title: 'Error',
								content: res.msg,
								showCancel: false, // 不显示取消按钮
								confirmText: 'confirm',
								success: (modalRes) => {
									if (modalRes.confirm) {
										// 用户点击“确定”后尝试关闭页面
										uni.navigateTo({
											url: '/pages/list/list?type=1',
										})
									}
								}
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
						// 错误时也弹窗提示

					});
			},


			open() {
				this.$refs.popup.open('center')
			},

			onClose() {
				this.$refs.popup.close()
			},

			settag() {
				if (!this.tagName) {
					uni.showToast({
						title: "Please fill in correctly",
						icon: 'none'
					});
					return
				}
				uni._req("/tag/create-tag", 'POST', {
						sid: this.userinfo.sid,
						tagName: this.tagName,
						type: 1
					})
					.then(res => {
						if (res.code == 200) {
							console.log(res.code, 'res');
							uni.showToast({
								title: 'New successfully added',
								icon: 'none',
							});
							this.tagName = null
							this.getdetail(this.userinfo.sid)
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					})

			},
			deltag(sid) {
				// console.log(e);
				// return
				uni._req(`/tag/${sid}/delete`, 'PUT')
					.then(res => {
						if (res.code == 200) {
							// console.log(res.code, 'res');
							uni.showToast({
								title: 'Deletion success！',
								icon: 'success',
							});
							this.getdetail(this.userinfo.sid)
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

			delwork(sid) {
				uni._req(`/work/${sid}/delete`, 'PUT')
					.then(res => {
						if (res.code == 200) {
							// console.log(res.code, 'res');
							uni.showToast({
								title: 'Deletion success！',
								icon: 'success',
							});
							this.getdetail(this.userinfo.sid)
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

			deledu(sid) {
				uni._req(`/school/${sid}/delete`, 'PUT')
					.then(res => {
						if (res.code == 200) {
							// console.log(res.code, 'res');
							uni.showToast({
								title: 'Deletion success！',
								icon: 'success',
							});
							this.getdetail(this.userinfo.sid)
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


			goinfo(val) {
				// console.log(val, 'data');
				// console.log(this.customsid, 'this.data');
				// return
				if (!this.userinfo && val.path != '/pages/info/info') {
					uni.showToast({
						title: 'Please complete your personal information first',
						icon: 'none'
					});
					return
				} else {
					if (val.path == "/pages/advantage/advantage") {
						if (val.data == 'Self-evaluation') {
							uni.navigateTo({
								url: val.path + '?content=' + val.item,
								events: {
									// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
									setcontent: (data) => {
										this.form.content = data.data
									},
								},
							})
						} else {
							uni.navigateTo({
								url: val.path + '?personalStrengths=' + val.item,
								events: {
									// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
									setadvantage: (data) => {
										console.log(this.form, '666666666')
										this.form.personalStrengths = data.data
										console.log(this.form, '23123123');
									},
								},
							})
						}
					} else if (val.path == "/pages/experience/experience" || val
						.path == "/pages/project/project" || val.path ==
						"/pages/expectations/expectations" || val.path ==
						"/pages/Educational/Educational") {
						uni.navigateTo({
							url: val.path + '?sid=' + val.sid,
							events: {
								// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								setinfo: () => {
									console.log('回来了');
									this.getdetail(this.userinfo.sid)
								},
							},
						})
					} else if (val.path == '/pages/Attachments/Attachments') {
						console.log('images', 22222);
						uni.navigateTo({
							url: val.path + '?images=' + JSON.stringify(val.item),
							events: {
								// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								setimgs: (data) => {
									this.form.images = data.data
								},
							},
						})
					} else if (val.path == '/pages/info/info') {
						uni.navigateTo({
							url: val.path + '?sid=' + this.userId,
						})
					} else {
						uni.navigateTo({
							url: val.path
						})
					}
				}
			},
			getinfo() {
				console.log(uni._req, 'uni._req');
				uni._req('/v1/candidate/me', 'GET')
					.then(res => {
						if (res.code == 200) {


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

			setstatus(val) {
				this.form.jobStatus = val

			},

			getdetail(sid) {
				uni._req(`/resume/${sid}/me-info`, 'GET')
					.then(res => {
						if (res.code == 200) {
							if (res.data.expectations) {
								this.expectations = res.data.expectations
							}
							if (res.data.tag) {
								this.taglist = res.data.tag
							} else {
								this.taglist = null
							}
							if (res.data.work) {
								this.work = res.data.work
							}
							if (res.data.project) {

								this.project = res.data.project
							}
							if (res.data.school) {
								this.school = res.data.school
							}
							if (res.data.candidate) {
								this.userinfo = res.data.candidate
							}
							console.log(this, 'this');
						} else {
							[]
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
			submit() {
				console.log(this.form, 'this.data.form');
				// return
				uni._req('/resume/save', 'POST', this.form)
					.then(res => {
						if (res.code == 200) {
							uni.removeStorageSync('userinfo');
							uni.showToast({
								title: 'success',
								icon: 'success',
								complete: () => {
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/list/list',
										})
									}, 1000); // 与 duration 保持一致
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
			},
		}
	}
</script>

<style>
	/* pages/myresume/myresume.wxss */
	.box {
		.container {
			width: 670rpx;
			margin: 0 auto;
			padding-top: 28rpx;
		}
	}

	.card {
		background-color: #FFFFFF;
		border-radius: 40rpx;
		margin: 28rpx 0;
		padding: 0 40rpx;

		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 0;
			border-bottom: 1px solid #DEE1E7;

			.left {
				/* 				display: flex;
				align-items: center; */

				image {
					width: 60rpx;
					height: 48rpx;
					margin-right: 30rpx;
				}

			}

			.right {
				display: flex;
				align-items: center;
			}


		}
	}

	.tops {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 0;

		.left {
			display: flex;
			align-items: center;

		}

		.right {
			display: flex;
			align-items: center;
		}


	}

	image {
		width: 48rpx;
		height: 48rpx;
		margin-right: 30rpx;

		&:last-child {
			margin: 0;
		}
	}

	.title {
		font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
		font-weight: 600;
		font-size: 28rpx;
		color: #150B3D;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.weui-cell__bd {
		font-size: 24rpx;

		.title {
			margin: 20rpx 10rpx;
			font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
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
			background: #F5F4F6;
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

	.bac {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;

		.bacs {
			display: flex;
			align-items: center;
			padding: 5rpx 10rpx;
			background: #F5F4F6;
			border-radius: 25rpx;
			width: 45%;
			height: 80rpx;
		}

		.bacs2 {
			display: flex;
			align-items: center;
			padding: 5rpx 10rpx;
			margin: 14rpx 0;
			background: #F5F4F6;
			border-radius: 25rpx;
			width: 100%;
			height: 80rpx;
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
	}

	.btm {
		border-bottom: 2rpx solid #DEE1E7;
		margin-bottom: 20rpx;

		&:last-child {
			border: none;
		}
	}

	.more {
		padding: 28rpx 0;
		text-align: center;
		font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
		font-weight: 400;
		font-size: 24rpx;
		color: #7551FF;
		line-height: 34rpx;
		font-style: normal;
		text-transform: none;
	}

	.card2 {
		display: flex;
		flex-direction: column;
	}

	.weui-inputs {
		width: 65%;
		min-height: 72rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
		font-weight: 400;
		font-size: 28rpx;
		color: #9197AA;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(153, 171, 198, 0.28);
	}

	.tit1 {
		font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
		font-weight: 700;
		font-size: 28rpx;
		color: #150B3D;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin: 16rpx 0;
	}

	.tit2 {
		font-family: Poppins, Poppins;
		font-weight: 400;
		font-size: 24rpx;
		color: #524B6B;
		line-height: 34rpx;
		margin: 16rpx 0;
		font-style: normal;
		text-transform: none;

		&:last-child {
			padding-bottom: 20rpx;
		}
	}

	.titles {
		width: 670rpx;
		margin: 0 auto;
		font-family: "KaiTi", "楷体", "SimKai", "Microsoft YaHei", Arial, sans-serif;
		font-size: 24rpx;
		font-weight: normal;
		/* line-height: 34px; */
		letter-spacing: 0px;
		color: #524B6B;
	}
</style>