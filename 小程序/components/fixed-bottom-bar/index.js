Component({
    options: {
        styleIsolation: 'apply-shared',
    },
    behaviors: ['wx://component-export'],
    properties: {
        braceColor: {
            type: String,
        },
    },
    data: {
        height: 0,
    },
    lifetimes: {
        ready() {
            this.updateHeight();
        },
    },
    methods: {
        updateHeight() {
            this.getRect(this, '.fixed_bottom_bar').then(res => {
                this.setData({ height: res.height });
            });
        },
        //获取节点位置信息
        getRect(context, selector) {
            return new Promise(function (resolve) {
                wx.createSelectorQuery()
                    .in(context)
                    .select(selector)
                    .boundingClientRect()
                    .exec(function (rect) {
                        if (rect === void 0) {
                            rect = [];
                        }
                        return resolve(rect[0]);
                    });
            });
        },
    },
    export() {
        return { height: this.data.height };
    },
});
