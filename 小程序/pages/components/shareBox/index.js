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
          "background": "#FFFFFF",
          // "borderRadius": "100rpx",
          "views": [{
              "type": "image",
              "url": "/static/imgs/detail/dw.jpg",
              "css": {
                "width": "30rpx",
                "height": "30rpx",
                "top": "19%",
                "left": "38%",
                "rotate": "0",
                "borderRadius": "50%",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },

            {
              "type": "text",
              "text": this.data.info.publishType == 1 ? this.data.info.address : this.data.info.address,
              "css": {
                "color": "#000000",
                "background": "",
                "top": "19%",
                "left": "43%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center",
              }
            },
            {
              "type": "text",
              "text": this.data.info.jobName,
              "css": {
                "width": "100%",
                // "left": "4%",  // 使文本的左边缘位于容器的中点
                "textAlign": "center",
                "color": "#000000",
                "background": "",
                "top": "15%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "32rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            {
              "type": "image",
              "url": this.data.info.publishType == 1 ? this.data.imgurl + this.data.info.headhunterResultDTO.avatar : this.data.imgurl + this.data.info.enterprise.avatar,
              "css": {
                "width": "104rpx",
                "height": "104rpx",
                "top": "5%",
                "left": "43%",
                "rotate": "0",
                "borderRadius": "50%",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 线条
            {
              "type": "text",
              "text": ' ',
              "css": {
                "color": "#514B6B",
                "width": "90%",
                "background": "#F5F4F6",
                "top": "23%",
                "left": "5%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "lineHeight": "4rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },

            // 第一个目录
            {
              "type": "image",
              "url": "/static/imgs/detail/salary.png",
              "css": {
                "width": "100rpx",
                "height": "100rpx",
                "top": "25%",
                "left": "5%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": "Salary",
              "css": {
                "color": "#76777C",
                "background": "",
                "top": "26%",
                "left": "21%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": `${this.data.info.minSalary/1000}K-${this.data.info.maxSalary/1000}k`,
              "css": {
                "color": "#2623D1",
                "background": "",
                "top": "29%",
                "left": "21%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },

            // 第二个目录
            {
              "type": "image",
              "url": "/static/imgs/detail/job.png",
              "css": {
                "width": "100rpx",
                "height": "100rpx",
                "top": "25%",
                "left": "55%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": "Job type",
              "css": {
                "color": "#76777C",
                "background": "",
                "top": "26%",
                "left": "71%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.dictWork.memberName,
              "css": {
                "color": "#2623D1",
                "background": "",
                "top": "29%",
                "left": "71%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 第三个目录
            {
              "type": "image",
              "url": "/static/imgs/detail/experience.png",
              "css": {
                "width": "100rpx",
                "height": "100rpx",
                "top": "35%",
                "left": "5%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": "Experience",
              "css": {
                "color": "#76777C",
                "background": "",
                "top": "36%",
                "left": "21%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.dictDegree.memberName,
              "css": {
                "color": "#2623D1",
                "background": "",
                "top": "39%",
                "left": "21%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 第四个目录
            {
              "type": "image",
              "url": "/static/imgs/detail/interview.png",
              "css": {
                "width": "100rpx",
                "height": "100rpx",
                "top": "35%",
                "left": "55%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": "Interview",
              "css": {
                "color": "#76777C",
                "background": "",
                "top": "36%",
                "left": "71%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": `${this.data.info.interviewCount} rounds`,
              "css": {
                "color": "#2623D1",
                "background": "",
                "top": "39%",
                "left": "71%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 第五个目录
            {
              "type": "image",
              "url": "/static/imgs/detail/education.png",
              "css": {
                "width": "100rpx",
                "height": "100rpx",
                "top": "45%",
                "left": "5%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": "Education",
              "css": {
                "color": "#76777C",
                "background": "",
                "top": "46%",
                "left": "21%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.dictExperience.memberName,
              "css": {
                "color": "#2623D1",
                "background": "",
                "top": "49%",
                "left": "21%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 第六个目录
            {
              "type": "image",
              "url": "/static/imgs/detail/vacancies.png",
              "css": {
                "width": "100rpx",
                "height": "100rpx",
                "top": "45%",
                "left": "55%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": "Vacancies",
              "css": {
                "color": "#76777C",
                "background": "",
                "top": "46%",
                "left": "71%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": `${this.data.info.recruitsCount} people`,
              "css": {
                "color": "#2623D1",
                "background": "",
                "top": "49%",
                "left": "71%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
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
                "width": "90%",
                "background": "#F5F4F6",
                "top": "54%",
                "left": "5%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "lineHeight": "4rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 二维码
            {
              "type": "image",
              "url": this.data.imgurl + this.data.info.baseerm,
              "css": {
                "width": "300rpx",
                "height": "300rpx",
                "padding": "1rpx",
                "top": "57%",
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
              "url": this.data.userinfo ? this.data.imgurl + this.data.userinfo.avatar : '/static/imgs/avator.jpg',
              "css": {
                "width": "130rpx",
                "height": "130rpx",
                "top": "57%",
                "left": "55%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "borderRadius": "50%",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 昵称
            {
              "type": "text",
              "text": this.data.userinfo.fullName,
              "css": {
                "color": "#514B6B",
                "width": "160rpx",
                "background": "",
                "top": "61%",
                "left": "75%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "23rpx",
                "fontWeight": "bold",
                "maxLines": "1", // 设置为1行
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "overflow": "hidden", // 隐藏溢出内容
                "textOverflow": "ellipsis", // 使用省略号表示溢出部分
                "whiteSpace": "nowrap" // 不换行
              }
            },
            // 介绍
            {
              "type": "text",
              "text": "Shared a job openingwith you",
              "css": {
                "color": "#514B6B",
                "width": "270rpx",
                "background": "",
                "top": "72%",
                "left": "55%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",

              }
            },
            // 备注
            {
              "type": "text",
              "text": "Scan the QR code with WeChat to view job details",
              "css": {
                "color": "#808289",
                "width": "100%",
                "background": "",
                "top": "88%",
                "left": "5%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "bold",
                "maxLines": "2",
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
            icon: 'none'
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
    }
  }
})