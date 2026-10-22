Page({
  data: {
    type: null,
    chosed_tab: '',
    chosed_theme: "", //选中的主题
    theme_list: [],
    countriesName:'',
    // 需要再data中写
    params() {
      return {
        countriesName:this.data.countriesName
        // is_main: 1,
        // search_str: this.data.searchValue,
      };
    },
  },
  choseTab(e) {
    const eventChannel = this.getOpenerEventChannel()
    let {
      index
    } = e.currentTarget.dataset;
    if (this.data.chosed_tab === index || index === undefined) {
      if (!this.data.type) {

        eventChannel.emit('acceptDataFromOpenedPage', {
          data: e.currentTarget.dataset.item
        });
        wx.navigateBack({
          delta: 1
        })
      } else {

        eventChannel.emit('acceptDataFromOpenedPage', {
          data: e.currentTarget.dataset.item
        });
        wx.navigateBack({
          delta: 1
        })
      }

      return false;
    } else {
      this.setData({
        chosed_tab: index,
      })
    }
  },
  search(e) {
    this.setData({
      countriesName:e.detail.value
    })
   
    this.paging.reRequest()
  },

  getlist(val) {
    let data = {
      countriesName: '',
      current: 1,
      size: 10
    }
    if (val) {
      data.countriesName = val
    }
    wx._request('/v1/countries', 'GET', data)
      .then(res => {
        if (res.code == 200) {
          this.setData({
            theme_list: res.data.records
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


  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    // this.getlist()

  },


  onShow: function () {
    this.paging.reRequest()
  },

  /**
   * 确认选择按钮
   */



})