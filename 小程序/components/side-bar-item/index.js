Component({
    relations: {
        '../side-bar/index': {
            type: 'parent', // 关联的目标节点应为父节点
            linked: function (target) {
                // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
                this.getSelfHeight();
            },
            linkChanged: function (target) {
                // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
                this.getSelfHeight();
            },
            unlinked: function (target) {
                // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
            },
        },
    },
    /**
     * 组件的属性列表
     */
    properties: {},
    created: function () {
        var _this = this;
        Object.defineProperty(this, 'parent', {
            get: function () {
                return _this.getRelationNodes('../side-bar/index')[0];
            },
        });
        Object.defineProperty(this, 'index', {
            get: function () {
                var _a, _b;
                return (_b = (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.indexOf(_this);
            },
        });
    },
    /**
     * 组件的初始数据
     */
    data: {
        height: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClick() {
            const parent = this.parent;
            if (!parent) return;
            const index = this.index;

            const parentData = parent.data;

            if (parentData.active !== index) {
                parent.triggerEvent('change', index);
            }
        },
        getSelfHeight() {
            this.getRect(this, '.side_bar_item').then(res => {
                this.data.height = res.height;
            });
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
    },
});
