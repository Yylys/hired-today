// pages/Jobrecord/Jobrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    actives: 1, //高亮
    actives1: 1, //高亮
    num: null,
    imgurl: wx._ImgbaseURL,
    params2() {
      return {
        delivery: this.data.actives1
      };
    },
    params1() {
      return {
        status: this.data.actives
      };
    },
    CateList: [{
        id: 1,
        name: "Confirmed"
      },
      {
        id: 0,
        name: "Unconfirmed"
      },
    ],
    CateList1: [
      {
        id: 1,
        name:"Feedback"
      },
      {
        id: 0,
        name: "Pending Feedback"
      },
    ]
  },


  clear(){
    this.setData({
      list3:[],
      list2:[]
    })
  },

  onChange(event) {
     
    this.clear()
    if (event.detail.index == 0) {
      this.post.reRequest()
    } else {
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


    // 点击分类项
    onCateItem1(e) {
      this.clear()
       
      const index = e.currentTarget.dataset.index;
      // this.centerMenuItem(index - 1);
      this.setData({
        actives1: e.currentTarget.dataset.index,
        acid: e.currentTarget.dataset.acid,
      });
      this.post.reRequest()
    },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.post.reRequest()
  },

  onReady() {

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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
      if (this.data.actives1==0) {
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid+'&type=1',
        })
      }else{
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
        })
      }
    }else{
    if(e.currentTarget.dataset.id){
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid +'&id='+ e.currentTarget.dataset.id,
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid ,
      })
    }
  }

  },
  goinfos(e){
    if(e.currentTarget.dataset.type==1 || e.currentTarget.dataset.type==3){
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid  + '&id=' + e.currentTarget.dataset.id,
      })
    }
  },

  dellist(e) {
     
    if (e.detail == 'right') {
      // 收藏
      wx._request(`/v1/job/${e.currentTarget.dataset.sid}/preference`, 'POST')
        .then(res => {
          if (res.code == 200) {
            this.paging.reRequest();
          } else {}
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
})