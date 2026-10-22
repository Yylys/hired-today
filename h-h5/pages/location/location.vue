<template>
	<!--pages/jsCase/scList/index.wxml-->
	<view class="head">
		<view class="title">Choose a country</view>
		<view class="head_search flex-row">
			<uni-icons type="search" class="head_s_icon"></uni-icons>
			<input placeholder="Enter the Country" placeholder-class="p_class" :value="country" @confirm="search"
				@input="onInput" class="head_ipt" />
		</view>
	</view>

	<view class="container">
		<scroll-view class="scroll-view" scroll-y @scrolltolower="onScrollToLower" 
			:lower-threshold="50"
			>
		<view class="con flex">
		<view class="c_left">
			<block v-for="item in theme_list" key="item.sid">
				<view @click="choseTab(item)" :class="['flex-row', 'tab_item', chosed_tab === item.sid ? 'ative' : '']">
					<image :src="item.nationalFlagUrl"
						style="width: 60rpx; height: 60rpx; margin:18rpx 30rpx;" mode="aspectFit" />
					<span>{{item.countriesName}}</span>
				</view>
			</block>
		</view>
	</view>

			<!-- 加载更多提示 -->
			<view v-if="loading" class="loading">
				<text>正在加载...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// type: null,
				countriesName: null,
				theme_list: [],
				chosed_tab: '',
				theme_list: [], // 数据列表
				loading: false, // 加载状态
				current: 1, // 当前页码
				size: 20, // 每页数据量
				countriesName: '', // 搜索的国家名
			}
		},
		methods: {
			onInput(event) {
				this.countriesName = event.detail.value
				this.current= 1 // 当前页码
				this.size=20 // 每页数据量
			},
			search(e) {
				console.log('搜索');

				this.getlist(this.countriesName)
			},
			// getlist(val) {
			// 	let data = {
			// 		countriesName: ''
			// 	}
			// 	if (val) {
			// 		data.countriesName = val
			// 	}
			// 	uni._req('/countries', 'GET', data)
			// 		.then(res => {
			// 			if (res.code == 200) {
			// 				console.log(res.data, 'res.data');
			// 				this.theme_list = res.data.records
			// 			} else {
			// 				uni.showToast({
			// 					title: res.msg,
			// 					icon: 'none'
			// 				});
			// 			}
			// 		})
			// 		.catch(err => {
			// 			console.error('Request Failure', err);
			// 		});
			// },
			choseTab(item) {
				const eventChannel = this.getOpenerEventChannel()
				// let {index} = item.sid;
				console.log(this.chosed_tab, item.sid, '2222222');
				if (this.chosed_tab == item.sid) {
					console.log('跳转');
					// console.log(item, 'e.currentTarget.dataset.item');
					eventChannel.emit('acceptDataFromOpenedPage', {
						data: item
					});
					uni.navigateBack({
						delta: 1,
						fail(e) {
							console.log(e, '33333');
						}
					})
					// return false;
				} else {
					// this.setData({
					// console.log(this);
					this.chosed_tab = item.sid
					console.log(this.chosed_tab, 'this.chosed_tab');
					// })
				}
			},
			getlist(val = this.countriesName) {
				let data = {
					countriesName: val,
					current: this.current,
					size: this.size,
				};

				if (val) {
					data.countriesName = val;
				}

				// 请求数据
				uni._req('/countries', 'GET', data)
					.then(res => {
						if (res.code === 200) {
						
							// 如果是第一页，直接设置数据；否则，追加数据
							if (this.current == 1) {
									console.log(res.data.records, '第一页');
								this.theme_list = res.data.records;
							} else {
								this.theme_list = [...this.theme_list, ...res.data.records];
							}
							// 如果返回的记录数小于pageSize，说明没有更多数据了
							if (res.data.records.length < this.size) {
								this.loading = false;
							}
							console.log(this.theme_list,'this.theme_list');
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						console.error('Request Failure', err);
						this.loading = false; // 请求失败时也停止加载
					})
					.finally(() => {
						this.loading = false; // 请求结束后，停止loading状态
					});
			},

			// 触底加载更多
			onScrollToLower() {
				// 防止重复请求
				if (this.loading) return;
				this.loading = true;
				this.current++; // 增加页码
				this.getlist(); // 请求新一页的数据
			},
		},
		onLoad() {
			// console.log(222222);
			this.getlist()
		}
	}
</script>

<style>
	/* pages/jsCase/scList/index.wxss */
	page {
		background: #F8F8F8;
		height: 100vh;
	}

	.flex {
		display: flex;
		align-items: flex-start;
	}


	.head_s_icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}

	.head_search {
		width: 670rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 0 31rpx;
		box-sizing: border-box;
		font-size: 26rpx;
		font-weight: 500;
		color: #333;
		margin: 0 auto 30rpx;
		display: flex;
		align-items: center;
	}

	.head_ipt {
		height: 100%;
		flex: 1;
	}

	.p_class {
		color: rgb(127, 127, 127, .63);
	}

	.con {
		/* padding-top: 170rpx; */
	}

	.c_left {
		width: 670rpx;
		margin: 0 auto;
		height: calc(100vh - 110rpx);
	}

	.c_right {
		flex: 1;
		height: calc(100vh - 110rpx);
	}

	.tab_item {
		background: #fff;
		/* border-radius: 40rpx; */
		margin: 30rpx 0;
		width: 100%;
		height: 96rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
		text-align: center;
	}

	.ative {
		color: #FFFFFF;
		background: #2623D1;
	}


	.t_title {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 9rpx;
		width: 100%;
	}

	.t_context {
		width: 462rpx;
		background: #F8F8F8;
		box-sizing: border-box;
		padding: 20rpx 12rpx;
		min-height: 193rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #666666;
	}

	radio {
		transform: scale(0.8);
		flex-shrink: 0;
	}

	radio .wx-radio-input {
		border: 1px solid #999999;
	}

	radio .wx-radio-input.wx-radio-input-checked {
		background: #db4e0c !important;
		border-color: #db4e0c !important;
	}

	.c_right_sc {
		height: calc(100% - 140rpx);
	}

	.c_right_bottom {
		width: 551rpx;
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 999;
		height: 140rpx;
	}



	.btn {
		width: 471rpx;
		height: 72rpx;
		background: rgb(177, 177, 177, .3);
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 72rpx;
		color: #999999;
		text-align: center;
		margin: 30rpx auto;
	}

	.btn_ative {
		background: #db4e0c;
		color: #FFFFFF;
	}

	.title {
		width: 670rpx;
		font-family: DM Sans, DM Sans;
		font-weight: 600;
		font-size: 26rpx;
		color: #150B3D;
		line-height: 44rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin: 0 auto 30rpx;
	}
</style>