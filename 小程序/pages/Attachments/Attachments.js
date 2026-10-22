// pages/advantage/advantage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    deletable:true,
    imgs: [],
    fileList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    if (!options.images) {} else {
      let img = JSON.parse(options.images)
       
      for (let i = 0; i < img.length; i++) {
        let data = {
          fileType: "image",
          type: "image",
          url: ""
        }
        data.url = img[i].cover
        this.data.fileList.push(data)
      }
      this.setData({
        fileList: this.data.fileList
      })
       

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  delimg(event){
     
    this.data.fileList.splice(event.detail.index, 1);
    this.setData({
      fileList:this.data.fileList
    })
  },

  setdatas() {
    const eventChannel = this.getOpenerEventChannel()
     
    for (let i = 0; i < this.data.fileList.length; i++) {
      this.data.imgs.push({
        cover: this.data.fileList[i].url,
        type:4
      })
    }
    // wx.setStorageSync('images', this.data.imgs)
    eventChannel.emit('setimgs', {
      data: this.data.imgs
    });
    wx.navigateBack({
      delta: 1
    })
  },

  afterRead(event) {
    const filelist = this.data.fileList
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: wx._baseURL + '/v1/resources/public', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      // formData: {
      //   user: 'test'
      // },
      success: (res) => {
        // 上传完成需要更新 fileList
        const data = JSON.parse(res.data);
        filelist.push({
          ...file,
          url: wx._ImgbaseURL + data.data.url
        });
         
        this.setData({
          fileList: filelist
        });
      },
    });
  }
  // afterRead(event) {
  //   const filelist = this.data.fileList;
  //   const { file } = event.detail;
  
  //   // 判断是否是多个文件上传
  //   const files = Array.isArray(file) ? file : [file]; // 确保 file 是数组格式
  
  //   files.forEach(f => {
  //     // 使用 wx.compressImage 对每张图片进行压缩
  //     wx.compressImage({
  //       src: f.url, // 原始图片路径
  //       quality: 80, // 压缩质量，0-100，数值越小压缩率越高
  //       success: (res) => {
  //         // 获取压缩后的图片路径
  //         const compressedFilePath = res.tempFilePath;
  
  //         // 使用压缩后的图片路径进行上传
  //         wx.uploadFile({
  //           url: wx._baseURL + '/v1/resources/public', // 替换为实际上传接口
  //           filePath: compressedFilePath,  // 上传压缩后的图片
  //           name: 'file',
  //           success: (uploadRes) => {
  //             // 上传成功，更新文件列表
  //             const data = JSON.parse(uploadRes.data);
  //             filelist.push({
  //               ...f,  // 保留原文件的其他信息
  //               url: wx._ImgbaseURL + data.data.url // 处理上传返回的图片地址
  //             });
  
  //             // 更新页面的文件列表
  //             this.setData({
  //               fileList: filelist
  //             });
  //           },
  //           fail: (uploadError) => {
  //             console.error('上传失败', uploadError);
  //           }
  //         });
  //       },
  //       fail: (compressError) => {
  //         console.error('图片压缩失败', compressError);
  //       }
  //     });
  //   });
  // }
})