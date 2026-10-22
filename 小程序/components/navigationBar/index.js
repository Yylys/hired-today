Component({
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        back: {
            type: Boolean,
            value: true,
        },
        text: {
            type: String,
        },
        textColor: {
            type: String,
            value: '#fff',
        },
        placeholder: {
            type: Boolean,
            value: true,
        },
        background: {
            type: String,
            value: 'transparent',
        },
        navigationBarColor: {
            type: String,
            value: '#ffffff',
        },
    },
    lifetimes: {
        attached() {
            const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
            const height = menuButtonInfo.bottom + 8;
            const paddingBottom = 8 + (menuButtonInfo.height - 24) / 2 - 1;

            var res = wx.getSystemInfoSync();
            let isIOS = false;
            if (res.platform == 'ios') {
                isIOS = true;
            } else if (res.platform === 'devtools' && res.model.includes('iPhone')) {
                isIOS = true;
            }
            this.setData({
                height,
                paddingBottom,
                isIOS,
            });

            wx.setNavigationBarColor({
                frontColor: this.data.navigationBarColor,
                backgroundColor: '',
            });
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        height: 0,
        paddingBottom: 0,
        isIOS: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onNavigateBack() {
            if (!this.data.back) return;
            wx.navigateBack({
                fail() {
                    wx.reLaunch({
                        url: '/pages/index/index',
                    });
                },
            });
        },
    },
});
