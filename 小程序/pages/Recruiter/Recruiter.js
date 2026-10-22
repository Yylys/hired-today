// pages/information/information.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wx_ImgbaseURL: wx._ImgbaseURL,
    imgurl: wx._ImgbaseURL,
    sid: null,
    form: [{
      avatar: null,
      name: null,
      sex: null,
      position: null,
      fileList: [],
    }],
  },
  setsex(e) {
     
    this.setData({
      [`form[${e.currentTarget.dataset.index}].sex`]: e.currentTarget.dataset.sex
    })
  },

  onFormSubmit(e) {
    for (let i = 0; i < this.data.form.length; i++) {
      if (this.data.form[i].fileList.length > 0) {
        this.data.form[i].avatar = this.data.form[i].fileList[0].path
      }
    }
    this.setData({
      form: this.data.form
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('upimage', {
      data: this.data.form
    });
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let img = JSON.parse(options.images)
    if (img.length==0) { } else {
      for (let i = 0; i < img.length; i++) {
        let data = [{
          fileType: "image",
          type: "image",
          url: "",
          path:''
        }]
        data[0].path =  img[i].avatar
        data[0].url = this.data.imgurl + img[i].avatar
        img[i].fileList=data
      }
      this.setData({
        form: img
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
  delimg(event) {
    this.data.form[event.detail.index].fileList.splice(event.detail.index, 1);
    this.setData({
      [`form[${event.detail.index}].fileList`]:this.data.form[event.detail.index].fileList
    })
  },



  afterRead(event) {
     
    const filelist = this.data.form[event.currentTarget.dataset.index].fileList
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
          [`form[${event.currentTarget.dataset.index}].fileList`]: filelist
        });
      },
    });
  },
  onAdd() {
    const data = {
      avatar: null,
      name: null,
      sex: null,
      position: null,
      fileList: []
    }
    this.data.form.push(
      data
    )
    this.setData({
      form: this.data.form
    })
  },
  // 处理输入事件
  handleInput(event) {
    const title = event.currentTarget.dataset.title
    const value = event.detail.value;
    const index = event.currentTarget.dataset.index
    this.setData({
      [`form[${index}].${title}`]: value
    });
  },
})