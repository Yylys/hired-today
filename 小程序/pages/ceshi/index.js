Page({
  data: {
    activityCateList: [],
    zxcateId: '',
    active: 0,
    actives: 0, //高亮
    CateList: [{
        id: 1,
        name: "DM Sans-Regular"
      },
      {
        id: 2,
        name: "Designer"
      },
      {
        id: 3,
        name: "Full-time"
      },
      {
        id: 4,
        name: "Full-time"
      },
      {
        id: 5,
        name: "time"
      }
    ],
    h5Src: '',
    isHFive: false,
    params1() {
      return {
        // is_main: 0,//非主推
        // category_id: this.data.activityCateList[this.data.active].id,
      };
    },
  },

  onLoad(options) {},
  onShow() {
    // this.getActivity();
  },
  // 获取咨询分类
  getActivity() {
    this.request({
      url: 'common/dataSelect/zxFlSelect',
    }).then(res => {
       
      this.setData({
        activityCateList: res.data,
      });

      if (this.data.activityCateList.length > 0) {
        // 分类获取到再请求列表
        this.paging.reRequest();
      }
    });
  },
  togzh(e) {
    // 判断登录否
    if (!wx.getStorageSync('Authorization')) {
      wx.showModal({
        title: '提示',
        content: '是否登录小程序',
        confirmColor: '#0AA19A',
        complete: res => {
          if (res.cancel) {}

          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            });
          }
        },
      });
    } else {
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent(e.currentTarget.dataset.link),
      });
    }
  },
  onCateChange(e) {
     
    const index = e.detail.index;
    this.setData({
      active: index,
    });
    this.paging.reRequest();
  },
 
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
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
    const index = e.currentTarget.dataset.index;

    this.centerMenuItem(index - 1);

    this.setData({
      actives: e.currentTarget.dataset.index,
      acid: e.currentTarget.dataset.acid,
    });
    // this.paging.reRequest();
  },
});