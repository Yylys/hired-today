Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    },
    info: {
      type: Object,
      value: {} // 默认值应为对象
    }
  },
  data: {
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    imgurl: wx._ImgbaseURL,
    visible: false,
    userinfo: wx.getStorageSync('userinfo'),
    user: wx.getStorageSync('user')
  },

  methods: {
    handleClose() {
       
      this.setData({
        visible: false
      })
      this.triggerEvent('close')
    },
    drawPic() {
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData')
        return
      }
      wx.showLoading({
        title: 'Loading'
      })
       
      this.setData({
        imgDraw: {
          "width": "725rpx",
          "height": "1280rpx",
          "background": "#F5F4F6",
          "views": [
            // 标题
            {
              "type": "text",
              "text": this.data.info.collectionName,
              "css": {
                "color": "#150B3D",
                "top": "6%",
                "left": "10%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "32rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "50rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "width": "80%",
                "height": "300rpx",
              }
            },
            // 第一个卡片
            {
              "type": "text",
              "text": ' ',
              "css": {
                "color": "#76777C",
                "top": "16%",
                "left": "5%",
                "background": "#fff",
                "rotate": "0",
                "borderRadius": "20rpx",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "32rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "300rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center",
                "width": "90%",
                "height": "300rpx",
              }
            },
            // 头像
            {
              "type": "image",
              "url": this.data.imgurl + this.data.info.jobList[0].publish.avatar,
              "css": {
                "width": "70rpx",
                "height": "70rpx",
                "padding": "1rpx",
                "top": "18%",
                "left": "8%",
                "rotate": "0",
                // "borderWidth": "5rpx",
                "borderRadius": "16rpx",
                // "borderColor": "#2623D1",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 岗位名称
            {
              "type": "text",
              "text": this.data.info.jobList[0].jobName,
              "css": {
                "color": "#514B6B",
                "width": "600rpx",
                "background": "",
                "top": "18%",
                "left": "20%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "bold",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 地址
            {
              "type": "text",
              "text": this.data.info.jobList[0].address,
              "css": {
                "color": "#514B6B",
                "width": "500rpx",
                "background": "",
                "top": "21%",
                "left": "20%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 标签
            {
              "type": "text",
              "text": this.data.info.jobList[0].showTag.length >= 1 ? this.data.info.jobList[0].showTag[0].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "25%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobList[0].showTag.length >= 2 ? this.data.info.jobList[0].showTag[1].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "25%",
                "left": "31%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobList[0].showTag.length == 3 ? this.data.info.jobList[0].showTag[2].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "25%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobList[0].showTag.length >= 4 ? this.data.info.jobList[0].showTag[3].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "130rpx",
                "background": "#F5F4F6",
                "top": "25%",
                "left": "77%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 线条
            {
              "type": "text",
              "text": ' ',
              "css": {
                "color": "#514B6B",
                "width": "80%",
                "background": "#F5F4F6",
                "top": "30%",
                "left": "10%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "lineHeight": "2rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            ...this.setimg1(),
            // 申请人数
            {
              "type": "text",
              "text": this.data.info.jobList[0].userList ? this.data.info.jobList[0].cnt + ' Applicants' : 0 + ' Applicants',
              "css": {
                "color": "#808289",
                "width": "170rpx",
                "background": "",
                "top": "36%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 金额
            {
              "type": "text",
              "text": "￥" + (this.data.info.jobList[0].minSalary / 1000).toFixed(0) + "K-￥" + (this.data.info.jobList[0].maxSalary / 1000).toFixed(0) + "K",
              "css": {
                "color": "#2623D1",
                "width": "370rpx",
                "background": "",
                "top": "34%",
                "left": "30%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "36rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "right"
              }
            },
            // 月薪
            {
              "type": "text",
              "text": "/Month",
              "css": {
                "color": "#808289",
                "width": "110rpx",
                "background": "",
                "top": "35%",
                "left": "79%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "24rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "right"
              }
            },

            // 第二个卡片
            {
              "type": "text",
              "text": ' ',
              "css": {
                "color": "#76777C",
                "top": "41%",
                "left": "5%",
                "background": "#fff",
                "rotate": "0",
                "borderRadius": "20rpx",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "32rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "300rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center",
                "width": "90%",
                "height": "300rpx",
              }
            },
            // 头像
            {
              "type": "image",
              "url": this.data.imgurl + this.data.info.jobList[1].publish.avatar,
              "css": {
                "width": "70rpx",
                "height": "70rpx",
                "padding": "1rpx",
                "top": "43%",
                "left": "8%",
                "rotate": "0",
                // "borderWidth": "5rpx",
                "borderRadius": "16rpx",
                // "borderColor": "#2623D1",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 岗位名称
            {
              "type": "text",
              "text": this.data.info.jobList[1].jobName,
              "css": {
                "color": "#514B6B",
                "width": "600rpx",
                "background": "",
                "top": "43%",
                "left": "20%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "bold",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 地址
            {
              "type": "text",
              "text": this.data.info.jobList[1].address,
              "css": {
                "color": "#514B6B",
                "width": "500rpx",
                "background": "",
                "top": "46%",
                "left": "20%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 标签
            {
              "type": "text",
              "text": this.data.info.jobList[1].showTag.length >= 1 ? this.data.info.jobList[1].showTag[0].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "50%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobList[1].showTag.length >= 2 ? this.data.info.jobList[1].showTag[1].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "50%",
                "left": "31%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobList[1].showTag.length == 3 ? this.data.info.jobList[1].showTag[2].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "50%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobList[1].showTag.length >= 4 ? this.data.info.jobList[1].showTag[3].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "130rpx",
                "background": "#F5F4F6",
                "top": "50%",
                "left": "77%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 线条
            {
              "type": "text",
              "text": ' ',
              "css": {
                "color": "#514B6B",
                "width": "80%",
                "background": "#F5F4F6",
                "top": "55%",
                "left": "10%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "lineHeight": "2rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            ...this.setimg2(),
            // 申请人数
            {
              "type": "text",
              "text": this.data.info.jobList[1].userList ? this.data.info.jobList[1].cnt + ' Applicants' : 0 + ' Applicants',
              "css": {
                "color": "#808289",
                "width": "170rpx",
                "background": "",
                "top": "61%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 金额
            {
              "type": "text",
              "text": "￥" + (this.data.info.jobList[1].minSalary / 1000).toFixed(0) + "K-￥" + (this.data.info.jobList[1].maxSalary / 1000).toFixed(0) + "K",
              "css": {
                "color": "#2623D1",
                "width": "370rpx",
                "background": "",
                "top": "59%",
                "left": "30%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "36rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "right"
              }
            },
            // 月薪
            {
              "type": "text",
              "text": "/Month",
              "css": {
                "color": "#808289",
                "width": "110rpx",
                "background": "",
                "top": "60%",
                "left": "79%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "24rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "right"
              }
            },
            // 岗位合计
            {
              "type": "text",
              "text": `There are ${this.data.info.collectionCount} combined positions`,
              "css": {
                "color": "#808289",
                "width": "700rpx",
                "background": "",
                "top": "66%",
                "left": "5%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "24rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },







            // 二维码
            {
              "type": "image",
              "url": this.data.imgurl + this.data.info.url,
              "css": {
                "width": "300rpx",
                "height": "300rpx",
                "padding": "1rpx",
                "top": "72%",
                "left": "5%",
                "rotate": "0",
                "borderWidth": "2rpx",
                "borderRadius": "16rpx",
                "borderColor": "#808080",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 头像
            {
              "type": "image",
              "url": this.data.userinfo ? this.data.imgurl + this.data.info.avatar : '/static/imgs/avator.jpg',
              "css": {
                "width": "130rpx",
                "height": "130rpx",
                "top": "72%",
                "left": "49%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "borderRadius": "50%",
                "shadow": "",
                "mode": "aspectFill"
              }
            },
            // 昵称
            {
              "type": "text",
              "text": this.data.user.nickName,
              "css": {
                "color": "#514B6B",
                "width": "200rpx",
                "background": "",
                "top": "73%",
                "left": "68%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "23rpx",
                "fontWeight": "bold",
                "maxLines": "1",  // 设置为1行
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "overflow": "hidden",    // 隐藏溢出内容
                "textOverflow": "ellipsis", // 使用省略号表示溢出部分
                "whiteSpace": "nowrap"    // 不换行
              }
            },
            // 昵称
            {
              "type": "text",
              "text": 'Shared a job',
              "css": {
                "color": "#514B6B",
                "width": "200rpx",
                "background": "",
                "top": "76%",
                "left": "68%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "23rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                // "textAlign": "center"
              }
            },
            // 昵称
            {
              "type": "text",
              "text": 'collection with you',
              "css": {
                "color": "#514B6B",
                "width": "220rpx",
                "background": "",
                "top": "79%",
                "left": "68%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "23rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                // "textAlign": "center"
              }
            },
            // 介绍
            {
              "type": "text",
              "text": "Scan the QR code with",
              "css": {
                "color": "#514B6B",
                "width": "360rpx",
                "background": "",
                "top": "87%",
                "left": "49%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
              }
            },
            {
              "type": "text",
              "text": "WeChat to view job details",
              "css": {
                "color": "#514B6B",
                "width": "360rpx",
                "background": "",
                "top": "90%",
                "left": "49%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
              }
            },

          ]
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: 'Failed to generate shared image'
      })
    },
    onImgOK(e) {
       
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData')
    },
    preventDefault() {},
    // 保存图片
    handleSavePhoto() {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      wx.saveImageToPhotosAlbum({
        filePath: this.data.sharePath,
        success: () => {
          wx.showToast({
                        title: 'Successfully saved',
            icon:'none'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
            this.triggerEvent('close')
          }, 300)
        },
        fail: () => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting['scope.writePhotosAlbum']) {
                wx.showModal({
                  title: '提示',
                  content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting()
                    }
                  }
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
            this.triggerEvent('close')
          }, 300)
        }
      })
    },
    setimg1() {
      let arr = []
      if (this.data.info.jobList[0].userList) {
        this.data.info.jobList[0].userList.forEach((jobData, index) => {
          let data = {
            "type": "image",
            // "url": this.data.imgurl + this.data.info.jobList[0].userList[0].avatar,
            "url": this.data.imgurl + jobData.avatar,
            "css": {
              "width": "40rpx",
              "height": "40rpx",
              "padding": "1rpx",
              "top": "32%",
              "left": `${8+2*index}%`,
              "rotate": "0",
              // "borderWidth": "1rpx",
              "borderRadius": "16rpx",
              // "borderColor": "#2623D1",
              "shadow": "",
              "mode": "scaleToFill"
            }
          }
          arr.push(data)
        });
         
        return arr
      } else {
        arr.push({
          "type": "image",
          // "url": this.data.imgurl + this.data.info.jobList[0].userList[0].avatar,
          "url": '',
          "css": {
            "width": "40rpx",
            "height": "40rpx",
            "padding": "1rpx",
            "top": "57%",
            "left": "8%",
            "rotate": "0",
            // "borderWidth": "1rpx",
            "borderRadius": "16rpx",
            // "borderColor": "#2623D1",
            "shadow": "",
            "mode": "scaleToFill"
          }
        })
        return arr
      }

    },
    setimg2() {
      let arr = []
       
      if (this.data.info.jobList[1].userList) {
         
        this.data.info.jobList[1].userList.forEach((jobData, index) => {
          let data = {
            "type": "image",
            // "url": this.data.imgurl + this.data.info.jobList[0].userList[0].avatar,
            "url": this.data.imgurl + jobData.avatar,
            "css": {
              "width": "40rpx",
              "height": "40rpx",
              "padding": "1rpx",
              "top": "57%",
              "left": `${8+2*index}%`,
              "rotate": "0",
              // "borderWidth": "1rpx",
              "borderRadius": "16rpx",
              // "borderColor": "#2623D1",
              "shadow": "",
              "mode": "scaleToFill"
            }
          }
          arr.push(data)
        });
        return arr
      } else {
        arr.push({
          "type": "image",
          // "url": this.data.imgurl + this.data.info.jobList[0].userList[0].avatar,
          "url": '',
          "css": {
            "width": "40rpx",
            "height": "40rpx",
            "padding": "1rpx",
            "top": "57%",
            "left": "8%",
            "rotate": "0",
            // "borderWidth": "1rpx",
            "borderRadius": "16rpx",
            // "borderColor": "#2623D1",
            "shadow": "",
            "mode": "scaleToFill"
          }
        })
        return arr
      }
    }
  },
  ready() {
    // this.setimg1()
    // this.setimg2()
  }
})