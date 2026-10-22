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
                "color": "",
                "top": "6%",
                "left": "5%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "32rpx",
                "fontWeight": "bold",
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
              "url": this.data.imgurl + this.data.info.candidateList[0].avatar,
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
            // 性别
            {
              "type": "image",
              "url": this.data.info.candidateList[0].sex == 0 ? '/static/imgs/detail/man.jpg' : '/static/imgs/detail/woman.jpg',
              "css": {
                "width": "20rpx",
                "height": "20rpx",
                "padding": "1rpx",
                "top": "18%",
                "left": "20%",
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
              "text": this.data.info.candidateList[0].fullName,
              "css": {
                "color": "#514B6B",
                "width": "250rpx",
                "background": "",
                "top": "18%",
                "left": "24%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "bold",
                "maxLines": "1",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "maxLines": "1", // 设置为1行
                "overflow": "hidden", // 隐藏溢出内容
                "textOverflow": "ellipsis", // 使用省略号表示溢出部分
                "whiteSpace": "nowrap" // 不换行
              }
            },
            // 地址
            {
              "type": "text",
              "text": this.data.info.candidateList[0].age + ' years old | ' + this.data.info.candidateList[0].desiredIndustry + ' | ' + this.data.info.candidateList[0].countriesName,
              "css": {
                "color": "#514B6B",
                "width": "73%",
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
                "fontWeight": "none",

                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "maxLines": "1", // 设置为1行
                "overflow": "hidden", // 隐藏溢出内容
                "textOverflow": "ellipsis", // 使用省略号表示溢出部分
                "whiteSpace": "nowrap" // 不换行
              }
            },
            // 昵称
            {
              "type": "text",
              "text": 'Shared a Talent ',
              "css": {
                "color": "#514B6B",
                "width": "200rpx",
                "background": "",
                "top": "76%",
                "left": "69%",
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
              "text": this.data.info.candidateList[0].tag && this.data.info.candidateList[0].tag.length >= 1 ? this.data.info.candidateList[0].tag[0].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "27%",
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
              "text": this.data.info.candidateList[0].tag && this.data.info.candidateList[0].tag.length >= 2 ? this.data.info.candidateList[0].tag[1].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "27%",
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
              "text": this.data.info.candidateList[0].tag && this.data.info.candidateList[0].tag.length >= 3 ? this.data.info.candidateList[0].tag[2].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "27%",
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
              "text": this.data.info.candidateList[0].tag && this.data.info.candidateList[0].tag.length >= 4 ? this.data.info.candidateList[0].tag[3].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "130rpx",
                "background": "#F5F4F6",
                "top": "27%",
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
                "top": "32%",
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
            // 申请人数
            {
              "type": "text",
              "text": this.data.info.candidateList[0].content,
              "css": {
                "color": "#808289",
                "width": "84%",
                "background": "",
                "top": "33%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 金额
            {
              "type": "text",
              "text": "￥" + (this.data.info.candidateList[0].minSalary / 1000).toFixed(0) + "K-￥" + (this.data.info.candidateList[0].maxSalary / 1000).toFixed(0) + "K",
              "css": {
                "color": "#2623D1",
                "width": "370rpx",
                "background": "",
                "top": "17%",
                "left": "40%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "36rpx",
                "fontWeight": "bold",
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
              "url": this.data.imgurl + this.data.info.candidateList[1].avatar,
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
            // 性别
            {
              "type": "image",
              "url": this.data.info.candidateList[1].sex == 0 ? '/static/imgs/detail/man.jpg' : '/static/imgs/detail/woman.jpg',
              "css": {
                "width": "20rpx",
                "height": "20rpx",
                "padding": "1rpx",
                "top": "43%",
                "left": "20%",
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
              "text": this.data.info.candidateList[1].fullName,
              "css": {
                "color": "#514B6B",
                "width": "250rpx",
                "background": "",
                "top": "43%",
                "left": "24%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "bold",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "maxLines": "1", // 设置为1行
                "overflow": "hidden", // 隐藏溢出内容
                "textOverflow": "ellipsis", // 使用省略号表示溢出部分
                "whiteSpace": "nowrap" // 不换行
              }
            },
            // 地址
            {
              "type": "text",
              "text": this.data.info.candidateList[1].age + ' years old | ' + this.data.info.candidateList[1].desiredIndustry + ' | ' + this.data.info.candidateList[1].countriesName,
              "css": {
                "color": "#514B6B",
                "width": "73%",
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
                "fontWeight": "none",
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
            // 标签
            {
              "type": "text",
              "text": this.data.info.candidateList[1].tag && this.data.info.candidateList[1].tag.length >= 1 ? this.data.info.candidateList[1].tag[0].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "52%",
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
              "text": this.data.info.candidateList[1].tag && this.data.info.candidateList[1].tag.length >= 2 ? this.data.info.candidateList[1].tag[1].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "52%",
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
              "text": this.data.info.candidateList[1].tag && this.data.info.candidateList[1].tag.length >= 3 ? this.data.info.candidateList[1].tag[2].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "150rpx",
                "background": "#F5F4F6",
                "top": "52%",
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
              "text": this.data.info.candidateList[1].tag && this.data.info.candidateList[1].tag.length >= 4 ? this.data.info.candidateList[1].tag[3].memberName : '',
              "css": {
                "color": "#514B6B",
                "width": "130rpx",
                "background": "#F5F4F6",
                "top": "52%",
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
                "top": "57%",
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
            // 申请人数
            {
              "type": "text",
              "text": this.data.info.candidateList[1].content,
              "css": {
                "color": "#808289",
                "width": "83%",
                "background": "",
                "top": "58%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
                "fontWeight": "normal",
                "maxLines": "2",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 金额
            {
              "type": "text",
              "text": "￥" + (this.data.info.candidateList[1].minSalary / 1000).toFixed(0) + "K-￥" + (this.data.info.candidateList[1].maxSalary / 1000).toFixed(0) + "K",
              "css": {
                "color": "#2623D1",
                "width": "370rpx",
                "background": "",
                "top": "42%",
                "left": "40%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "36rpx",
                "fontWeight": "bold",
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
              "text": `The total number of talents is ${this.data.info.collectionCount}`,
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
              "url": this.data.userinfo ? this.data.imgurl + this.data.userinfo.avatar : '/static/imgs/avator.jpg',
              "css": {
                "width": "130rpx",
                "height": "130rpx",
                "top": "72%",
                "left": "49%",
                "rotate": "0",
                "borderWidth": "",
                "borderColor": "#000000",
                "borderRadius": "52%",
                "shadow": "",
                "mode": "scaleToFill"
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
                "left": "69%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "22rpx",
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
            // 昵称
            {
              "type": "text",
              "text": 'Shared a Talent ',
              "css": {
                "color": "#514B6B",
                "width": "200rpx",
                "background": "",
                "top": "76%",
                "left": "69%",
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
            {
              "type": "text",
              "text": 'Collection with you',
              "css": {
                "color": "#514B6B",
                "width": "220rpx",
                "background": "",
                "top": "79%",
                "left": "69%",
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
            // 介绍
            {
              "type": "text",
              "text": "Scan the QR code on",
              "css": {
                "color": "#514B6B",
                "width": "350rpx",
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
              "text": "WeChat to view talent details",
              "css": {
                "color": "#514B6B",
                "width": "350rpx",
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
    },
    setimg1() {
      let arr = []
      if (this.data.info.candidateList[0].userList) {
        this.data.info.candidateList[0].userList.forEach((jobData, index) => {
          let data = {
            "type": "image",
            // "url": this.data.imgurl + this.data.info.candidateList[0].userList[0].avatar,
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
          // "url": this.data.imgurl + this.data.info.candidateList[0].userList[0].avatar,
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

      if (this.data.info.candidateList[1].userList) {

        this.data.info.candidateList[1].userList.forEach((jobData, index) => {
          let data = {
            "type": "image",
            // "url": this.data.imgurl + this.data.info.candidateList[0].userList[0].avatar,
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
          // "url": this.data.imgurl + this.data.info.candidateList[0].userList[0].avatar,
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