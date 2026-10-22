const getCurrentPage = function () {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
};
Component({
    options: {
        styleIsolation: 'shared',
    },
    properties: {
        active: {
            type: [Number, String],
            value: 0,
        },
        placeholder: {
            type: Boolean,
            value: true,
        },
    },
    pageObj: null,
    data: {
        showReceiveSuccessPopup: false,
        receiveSuccessTitle: '',
    },
    lifetimes: {
        attached() {
            const pages = getCurrentPages();
            this.pageObj = pages[pages.length - 1];
        },
    },
    methods: {
        onChange(e) {
            const active = e.detail.value;
            wx.switchTab({
                url: ['/pages/index/index', '/', '/', '/', '/pages/user/user'][active],
            });
        },
        onSaoma() {
            let that = this;
            wx.scanCode({
                success: ({ result }) => {
                    if (!result.includes('{')) {
                        //扫药品条形码
                        this.getDrugInformation(result);
                    } else {
                        const data = JSON.parse(result);
                        if (data.qrcodeType === '2') {
                            that.claimOfflineRewards(data.data, data.requestMethod);
                        }
                    }
                },
                fail() {
                    wx.showToast({
                        title: '扫码参数失败，请重试',
                        icon: 'none',
                    });
                },
            });
        },
        //扫商品码
        getDrugInformation(data) {
            this.pageObj
                .request({
                    url: `/system/medicines/info-by-code/${data}`,
                    loadingTip: '加载中',
                })
                .then(res => {
                    if (res.data.uid) {
                        wx.navigateTo({
                            url: '/pages/drugdescription/drugdescription',
                            success: result => {
                                result.eventChannel.emit('acceptDataFromOpenerPage', { data: res.data });
                            },
                        });
                    } else {
                        wx.showToast({
                            title: '暂无相关信息',
                            icon: 'none',
                        });
                    }
                });
        },
        //领取线下奖励
        claimOfflineRewards(reqUrl, method) {
            this.pageObj
                .request({
                    url: reqUrl,
                    method,
                    loadingTip: '加载中',
                })
                .then(result => {
                    this.pageObj
                        .request({
                            url: `/system/commodities/ScanCode/${result.data.uid}`,
                            method: 'POST',
                        })
                        .then(() => {
                            this.setData({ receiveSuccessTitle: result.data.title, showReceiveSuccessPopup: true });
                        });
                });
        },
        closeReceiveSuccessPopup() {
            this.setData({ showReceiveSuccessPopup: false, receiveSuccessTitle: '' });
            getCurrentPage().onShow();
        },
    },
});
