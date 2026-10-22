Page({
  data: {
    activeNames: ['1'],
    faActive: 0, // 当前激活的索引
    chiActive: 1 ,// 元素的索引
    list:{
      a:{
        id:'a',
        value:[1,2,3]
      },
      b:{
        id:'b',
        value:[1,2,3]
      },
      c:{
        id:'c',
        value:[1,2,3]
      }
    }
  },
  onChange(event) {
    this.setData({
      loading: false,
      activeNames: event.detail,
    });
  },

  onLoad() {

  },


  setactive(event){
         
    this.setData({
      chiActive: event.currentTarget.dataset.id,
    });
  },

  setactives(event){
         
    this.setData({
      faActive: event.currentTarget.dataset.id,
    });
  },

});
