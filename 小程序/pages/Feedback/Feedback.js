// pages/experience/experience.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      content: "",
      dictTypeSid: "",
      imgList:[]
    },
    schoolName:null,
    columns:[],
    showeducational: false,
    fileList:[]
  },

  goinfo(e){
    wx.navigateTo({
      url: '/pages/History/History'
    })
  },


  onClose() {
    this.setData({
      showeducational: false
    });
  },


  onInput(event) {
     
    this.setData({
      currentDate: event.detail,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.geteducational()
     
    if (options.sid == null || options.sid == 'undefined') {} else {
      this.setData({
        sid: options.sid
      })
      this.getinfo(options.sid)
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
  onFormSubmit(e) {
    const eventChannel = this.getOpenerEventChannel()
    this.setData({
      "form.content": e.detail.value.content,
    });
    for (let i = 0; i < this.data.fileList.length; i++) {
      this.data.form.imgList.push({
        cover: this.data.fileList[i].path,
        type:8
      })
    }
    if (this.data.sid == null || this.data.sid == 'undefined') {
      // 新增
      wx._request('/v1/feedback', 'POST', this.data.form)
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Submitted successfully！',
              icon: 'none',
              duration: 0, // 默认2秒
              complete: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 0); // 与 duration 保持一致
              }
            });
          } else {
             wx.showModal({
              content: res.msg,
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
          }
        })
        .catch(err => {
          console.error('请求失败', err);
        });
    } 
  },
  showeducational() {
    this.setData({
      showeducational: true
    });
  },
  geteducational() {
    wx._request('/v1/dicts/by-key/feedbackType', 'GET')
      .then(res => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].text = res.data[i].memberName;
          }
          this.setData({
            columns: res.data
          });
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
      })
      .catch(err => {
        console.error('请求失败', err);
      });
  },
  onConfirm1(event) {
    this.setData({
      "schoolName": event.detail.value.memberName,
      "form.dictTypeSid": event.detail.value.sid,
      showexperience: false,
      showeducational: false
    });
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
          url: wx._ImgbaseURL + data.data.url,
          path: data.data.url
        });
         
        this.setData({
          fileList: filelist
        });
        console.log(this.data.fileList,'fileList');
      },
    });
  },
  delimg(event){
     
    this.data.fileList.splice(event.detail.index, 1);
    this.setData({
      fileList:this.data.fileList
    })
  },
  
})