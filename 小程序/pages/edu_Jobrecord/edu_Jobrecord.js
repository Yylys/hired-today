// pages/Jobrecord/Jobrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    actives: 1, //高亮
    num: null,
    imgurl: wx._ImgbaseURL,
    params1() {
      return {
        status:this.data.actives
      };
    },
    CateList: [
      {
        id: 1,
        name: "Confirmed"
      },
      {
        id: 0,
        name: "Unconfirmed"
      },
    ]
  },

  onChange(event) {
    this.clear()
    if(event.detail.index==0){
      this.paging.reRequest()
    }else{
      this.delivery.reRequest()
    }
  },
  centerMenuItem: function (index) {
    // 将选中的菜单项尽可能居中
    const itemId = `item-${index}`;

    this.setData({
      scrollIntoView: itemId,
    });
  },

  // 点击分类项
  onCateItem(e) {
    this.clear()
     
    const index = e.currentTarget.dataset.index;
    // this.centerMenuItem(index - 1);
    this.setData({
      actives: e.currentTarget.dataset.index,
      acid: e.currentTarget.dataset.acid,
    });
this.delivery.reRequest()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  
  onReady() {

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
    this.paging.reRequest()
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
  goinfo(e) {
    if (e.currentTarget.dataset.path=='/pages/TalentDetails/TalentDetails') {
      if (this.data.actives==0) {
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid+'&type=1',
        })
      }else{
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
        })
      }
    }
    
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
    // wx.navigateTo({
    //   url: '/pages/Jobrecordinfo/Jobrecordinfo'
    // })
  },

  dellist(e) {
     
    if (e.detail == 'right') {
      // 收藏
      wx._request(`/v1/resume/${e.currentTarget.dataset.sid}/preference`, 'POST')
        .then(res => {
          if (res.code == 200) {
            this.paging.reRequest();
          } else {
          }
        })
    }
  },




  openbox(e) {
    this.setData({
      num: e.currentTarget.dataset.sid
    });
  },

  closebox(event) {
     
    this.setData({
      num: null
    });
  },

  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },
  clear(){
    this.setData({
      list:[],
      list2:[]
    })
  }
})