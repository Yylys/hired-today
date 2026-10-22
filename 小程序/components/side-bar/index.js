Component({
    relations: {
        '../side-bar-item/index': {
            type: 'child',
            linked: function (target) {
                // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
            },
            linkChanged: function (target) {
                // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
            },
            unlinked: function (target) {
                // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
            },
        },
    },
    properties: {
        active: {
            type: Number,
            value: 0,
        },
        safe_area_inset_bottom: {
            type: Boolean,
            value: true,
        },
    },
    observers: {
        active: function (newValue) {
            wx.nextTick(() => {
                this.scrollTo(newValue);
            });
        },
    },
    created() {
        let _this = this;
        Object.defineProperty(this, 'children', {
            get() {
                return _this.getRelationNodes('../side-bar-item/index');
            },
        });
    },
    data: {
        scrollTop: 0, //竖向滚动的位置
    },
    methods: {
        //滚动到适合位置
        scrollTo(index) {
            var children = this.children;
            if (!Array.isArray(children) || !children.length) {
                return;
            }

            let that = this;
            that.getRect(this, '.side_bar_c').then(res => {
                var tabRects = this.children,
                    navRect = res;

                var tabRect = tabRects[index];
                var offsetTop = tabRects.slice(0, index).reduce(function (prev, curr) {
                    return prev + curr.data.height;
                }, 0);

                that.setData({
                    scrollTop: offsetTop - (navRect.height - tabRect.data.height) / 2,
                });
            });
        },
        //触底事件，如果列表需要分页加载
        scrolltolower() {
            this.triggerEvent('scrolltolower');
        },
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
        getAllRect(context, selector) {
            return new Promise(function (resolve) {
                wx.createSelectorQuery()
                    .in(context)
                    .selectAll(selector)
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
});
