<template>
	<view>
		<!--pages/advantage/advantage.wxml-->
		<view style="width: 670rpx; margin:0 auto;">
			<view class="title">Attachments</view>
			<view style="background-color: #fff; border-radius: 36rpx; padding: 20rpx 20rpx;">
				<view>
					<view style="display: flex; flex-wrap: wrap; justify-content: space-between;">
						<view v-for="(item,index) in imgs" :key="index" style="position: relative;"
							:style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1rpx dashed #9D97B5', borderRadius: '36rpx', width: '49%' ,height:'172rpx',  marginBottom: '20rpx' }">
							<image style="width: 100%; height: 100%;" :src="item" mode="aspectFill"></image>
							<uni-icons @click="delimg(index)" style="position: absolute; top: 5rpx; right: 10rpx;" type="closeempty"
								size="15"></uni-icons>
						</view>
					</view>
					<view>
						<span v-if="imgs.length<5"
							:style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1rpx dashed #9D97B5', borderRadius: '36rpx', width: '610rpx' ,height:'75rpx', padding: '60rpx 0', marginBottom: '5rpx' }"
							style="color: #150A33; font-size: 24rpx; margin-left: 10rpx;" @click="chooseImage">Upload
							Image</span>
					</view>
				</view>
			</view>
			<view style="margin: 78rpx auto; width: 60%; padding-bottom: 100rpx;">
					<button @click="setdatas" type="primary" class="custom-button" block>Submit</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uni_ImgbaseURL: uni._ImgbaseURL,
				imgs: [],
				images:[]
			}
		},
		methods: {
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
			  delimg(index){
			    this.imgs.splice(index, 1);

			  },
			    setdatas() {
			      const eventChannel = this.getOpenerEventChannel()
			      for (let i = 0; i < this.imgs.length; i++) {
			        this.images.push({
			          cover: this.imgs[i],
			          type:4
			        })
			      }
			      // console.log(this.data.imgs, 'this.data.imgs');
			      eventChannel.emit('setimgs', {
			        data: this.images
			      });
			      wx.navigateBack({
			        delta: 1
			      })
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
						console.log(JSON.parse(uploadFileRes.data).data.url,
							'JSON.parse(uploadFileRes.data).data.url');
						this.imgs.push(uni._ImgbaseURL + JSON.parse(uploadFileRes.data).data.url)
					},
					fail: (err) => {
						console.error('上传失败', err);
					}
				});
			},
		},
		  onLoad(options) {
		    console.log(JSON.parse(options.images));
		    if (!options.images) {} else {
		      let img = JSON.parse(options.images)
		      for (let i = 0; i < img.length; i++) {
		        let data = {
		          fileType: "image",
		          type: "image",
		          url: ""
		        }
		        data =img[i].cover
		        this.imgs.push(data)
		      }

		      // console.log(this.data.fileList,'fileList');
		
		    }
		  },
	}
</script>

<style>
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

	.van-uploader__wrapper {
		display: flex;
		justify-content: space-between;
	}

	.van-uploader__preview-image {
		width: 290rpx !important;
		height: 204rpx !important;
		border-radius: 11rpx;
	}
</style>