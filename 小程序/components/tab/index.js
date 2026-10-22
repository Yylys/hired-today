Component({
    properties: {
        active: {
            type: Number,
            value: 0,
        },
        data: {
            type: Array,
            value: [],
        },
        key: String,
    },
    data: {
        scrollLeft: 0, //横向滚动的位置
        navRectWidth: undefined,
    },
    observers: {
        active: function(newValue) {
            this.data.data.length === 0 ?
                this.setData({
                    scrollLeft: 0,
                }) :
                this.scrollTo(newValue);
        },
    },
    methods: {
        //点击每项
        onBarItemChange({ mark }) {
            const { index } = mark;
            let { active } = this.data;
            if (index == undefined || index === active) return;
            this.triggerEvent('change', index);
        },
        //触底事件，如果列表需要分页加载
        scrolltolower() {
            this.triggerEvent('scrolltolower');
        },
        //滚动到适合位置
        async scrollTo(index) {
            let that = this;
            const navRectWidth = await this.getNavRectWidth();

            that.getAllRect(this, '.default_item').then(function(tabRects) {
                if (tabRects.length === 0) return that.setData({ scrollLeft: 0 });
                var tabRect = tabRects[index];
                var offsetLeft = tabRects.slice(0, index).reduce(function(prev, curr) {
                    return prev + curr.width;
                }, 0);

                that.setData({
                    scrollLeft: offsetLeft - (navRectWidth - tabRect.width) / 2,
                });
            });
        },
        getRect(context, selector) {
            return new Promise(function(resolve) {
                wx.createSelectorQuery()
                    .in(context)
                    .select(selector)
                    .boundingClientRect()
                    .exec(function(rect) {
                        if (rect === void 0) {
                            rect = [];
                        }
                        return resolve(rect[0]);
                    });
            });
        },
        getAllRect(context, selector) {
            return new Promise(function(resolve) {
                wx.createSelectorQuery()
                    .in(context)
                    .selectAll(selector)
                    .boundingClientRect()
                    .exec(function(rect) {
                        if (rect === void 0) {
                            rect = [];
                        }
                        return resolve(rect[0]);
                    });
            });
        },
        getNavRectWidth() {
            return new Promise(resolve => {
                let navRectWidth = this.data.navRectWidth;
                if (navRectWidth === undefined) {
                    this.getRect(this, '.scroll_content').then(res => {
                        this.setData({ navRectWidth: res.width });
                        resolve(res.width);
                    });
                } else {
                    resolve(navRectWidth);
                }
            });
        },
    },
});