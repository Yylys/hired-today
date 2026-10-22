// components/index/index/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
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
    // 需要再data中写
    getParams1() {
      return {
        // is_main: 1,
        // search_str: this.data.searchValue,
      };
    },
  },
  ready() {
    this.getZxCate()
     
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    // 获取一级分类
    getZxCate() {

    },




  }
})