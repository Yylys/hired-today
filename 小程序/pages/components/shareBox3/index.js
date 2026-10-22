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
      value: {

      } // 默认值应为对象
    }
  },
  data: {
    // info: {
    //   headhunter: {
    //     address: "222222",
    //     avatar: "/public/20240923_5Sw0sxD5RThY1abd841ffc0a82c1aec128da5fd5cc85_a76a440b1e7b4be58d9ab2abe8dff096.jpeg",
    //     created: "2024-09-23 17:44:55",
    //     createdBy: "61",
    //     createdMilli: "1727084695474",
    //     delFlag: 0,
    //     deposit: 0,
    //     email: "9797@qq.com",
    //     infoTag: ["1111", "2222", "3333", "4444"],
    //     name: "严玉霖",
    //     phone: "13430111111",
    //     sid: "39-a91f947d67274b459b87066814b77e01",
    //     skillTag: ["555", "666"],
    //     status: 0,
    //     updated: "2024-10-08 10:47:08",
    //     updatedBy: "61",
    //     updatedMilli: "1728355628122",
    //     weChat: "Qq",
    //   },
    //   qrcode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAIAAAAhotZpAAACRElEQVR42u3aQW6EMBAEQP7/6eQFkSB02wPUHKPsLrgs2dP28aPG12EIIClIkBQkBQmSgqQgQVKQIP31T4U681tnnuHq8199r13jAAkSJEiQrr3k5QXwxvecGbjUgE4bB0iQIEGC1F14GwPa3pi0xwESJEiQIM1CioWSBWxIkCBBgvRdpEYAeie0hQQJEiRIc5HaIWksoEwdvn05BYcECRKkgUiNCxhP/PvnbgtBggQJ0hCkdqWazUYgO2J8IEGCBAlSdSFtN4ONA8Zt7wsJEiRIkOJgqUFsH+g1Dg9vTQ5IkCBBghR5iMYFktTkaBwAjtjdQYIECdKLkRp4dxbV1KXGXQ370kM/SJAgQXox0i6MVAC6sqHedjILCRIkSC9GenpgmpoE7UkMCRIkSJAyDWyj0WtfYmn8VuP7IUGCBAlSPnxsN8XtydH4fkiQIEGC1A1Y2yFsCnJXEDwiBYcECRKkhyK1F/kUxsrAdHQKDgkSJEgfR0o1to3LJ+3Qtj1pIEGCBAnSno1DKqhtbEAen4JDggQJ0seRGot8G/go17iNAyRIkCA9CKld05rKxv9DggQJEqT8xmHlJcI7g964MNNociFBggQJUqaZTW0QGs1yKjxtH4pCggQJEqR8wNpekFOHeKnPtg8JIUGCBAnSfqRGI9wIfBuhMCRIkCBBmrtxWBnyrnxmSJAgQYI0N2Cd8NnYgN6YEJAgQYIE6f8/vHLRToWbqXdsBKmQIEGCBElNL0iQFCRICpKCBElBUpAgKUifrF9EQ1PNniFBkQAAAABJRU5ErkJggg=="
    // },
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
          "height": "1250rpx",
          "background": "#FFFFFF",
          "views": [
            // 头像
            {
              "type": "image",
              "url": this.data.imgurl + this.data.info.headhunter.avatar,
              "css": {
                "width": "70rpx",
                "height": "70rpx",
                "padding": "1rpx",
                "top": "5%",
                "left": "8%",
                "rotate": "0",
                // "borderWidth": "5rpx",
                "borderRadius": "50%",
                // "borderColor": "#2623D1",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 岗位名称
            {
              "type": "text",
              "text": this.data.info.headhunter.name,
              "css": {
                "color": "#514B6B",
                "width": "100%",
                "background": "",
                "top": "5%",
                "left": "20%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "30rpx",
                "fontWeight": "bold",
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
              "text": 'Entrust me to help you find a job quickly',
              "css": {
                "color": "#514B6B",
                "width": "100%",
                "background": "",
                "top": "9%",
                "left": "20%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "27rpx",
                "fontWeight": "normal",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },
            // 标签介绍
            // 介绍
            {
              "type": "text",
              "text": 'Industries Of Expertise',
              "css": {
                "color": "#514B6B",
                "width": "100%",
                "background": "",
                "top": "16%",
                "left": "7%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "bold",
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
              "text": this.data.info.headhunter.infoTag && this.data.info.headhunter.infoTag.length >= 1 ? this.data.info.headhunter.infoTag[0] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "21%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.headhunter.infoTag && this.data.info.headhunter.infoTag.length >= 2 ? this.data.info.headhunter.infoTag[1] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "21%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.headhunter.infoTag && this.data.info.headhunter.infoTag.length >= 3 ? this.data.info.headhunter.infoTag[2] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "26%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "fontSize": "25rpx",
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
              "text": this.data.info.headhunter.infoTag && this.data.info.headhunter.infoTag.length >= 4 ? this.data.info.headhunter.infoTag[3] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "26%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.headhunter.infoTag && this.data.info.headhunter.infoTag.length >= 5 ? this.data.info.headhunter.infoTag[4] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "31%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "fontSize": "25rpx",
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
              "text": this.data.info.headhunter.infoTag && this.data.info.headhunter.infoTag.length >= 6 ? this.data.info.headhunter.infoTag[5] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "31%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            // 标签介绍
            // 介绍
            {
              "type": "text",
              "text": 'Skills',
              "css": {
                "color": "#514B6B",
                "width": "100%",
                "background": "",
                "top": "35%",
                "left": "7%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "bold",
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
              "text": this.data.info.headhunter.skillTag && this.data.info.headhunter.skillTag.length >= 1 ? this.data.info.headhunter.skillTag[0] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "40%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.headhunter.skillTag && this.data.info.headhunter.skillTag.length >= 2 ? this.data.info.headhunter.skillTag[1] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "40%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.headhunter.skillTag && this.data.info.headhunter.skillTag.length >= 3 ? this.data.info.headhunter.skillTag[2] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "45%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "fontSize": "25rpx",
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
              "text": this.data.info.headhunter.skillTag && this.data.info.headhunter.skillTag.length >= 4 ? this.data.info.headhunter.skillTag[3] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "45%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "text",
              "text": this.data.info.headhunter.skillTag && this.data.info.headhunter.skillTag.length >= 5 ? this.data.info.headhunter.skillTag[4] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "50%",
                "left": "8%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "fontSize": "25rpx",
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
              "text": this.data.info.headhunter.skillTag && this.data.info.headhunter.skillTag.length >= 6 ? this.data.info.headhunter.skillTag[5] : '',
              "css": {
                "color": "#514B6B",
                "width": "300rpx",
                "background": "#F5F4F6",
                "top": "50%",
                "left": "54%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "fontSize": "25rpx",
                "fontWeight": "normal",
                "maxLines": "1",
                "padding": "10rpx 5rpx",
                "lineHeight": "30.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },

            // 介绍
            {
              "type": "text",
              "text": 'Service Slogan',
              "css": {
                "color": "#514B6B",
                "width": "100%",
                "background": "",
                "top": "56%",
                "left": "7%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "bold",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
              }
            },

            // 服务口号
            {
              "type": "text",
              "text": this.data.info.headhunter.address,
              "css": {
                "color": "#524B6B",
                "width": "100%",
                "background": "",
                "top": "61%",
                "left": "7%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "24rpx",
                "fontWeight": "400",
                "maxLines": "3",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
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
                "top": "13%",
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
                "lineHeight": "2rpx",
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
                "top": "68%",
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
                "lineHeight": "2rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },

            // 二维码
            {
              "type": "image",
              "url": this.data.info.qrcode,
              "css": {
                "width": "300rpx",
                "height": "300rpx",
                "padding": "1rpx",
                "top": "72%",
                "left": "5%",
                "rotate": "0",
                "borderWidth": "5rpx",
                "borderRadius": "16rpx",
                "borderColor": "#F5F4F6",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            // 介绍
            {
              "type": "text",
              "text": "Scan the QR code to",
              "css": {
                "color": "#908C9E",
                "width": "280rpx",
                "background": "",
                "top": "72%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            // 介绍
            {
              "type": "text",
              "text": "fill in your job search",
              "css": {
                "color": "#908C9E",
                "width": "283rpx",
                "background": "",
                "top": "75%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            {
              "type": "text",
              "text": "information. I will",
              "css": {
                "color": "#908C9E",
                "width": "280rpx",
                "background": "",
                "top": "78%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            {
              "type": "text",
              "text": "act as your agent to",
              "css": {
                "color": "#908C9E",
                "width": "280rpx",
                "background": "",
                "top": "81%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            {
              "type": "text",
              "text": "help you find your",
              "css": {
                "color": "#908C9E",
                "width": "290rpx",
                "background": "",
                "top": "84%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            {
              "type": "text",
              "text": "desired job and stay",
              "css": {
                "color": "#908C9E",
                "width": "280rpx",
                "background": "",
                "top": "87%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            {
              "type": "text",
              "text": "in touch with you",
              "css": {
                "color": "#908C9E",
                "width": "280rpx",
                "background": "",
                "top": "90%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            },
            {
              "type": "text",
              "text": "at all times.",
              "css": {
                "color": "#908C9E",
                "width": "280rpx",
                "background": "",
                "top": "93%",
                "left": "53%",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28rpx",
                "fontWeight": "normal",
                "maxLines": "9",
                "lineHeight": "37.74rpx",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflowWrap": "break-word",
                "wordBreak": "break-all", // 允许单词在任何地方换行
                "whiteSpace": "normal" // 默认换行
              }
            }

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