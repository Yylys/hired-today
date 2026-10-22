Component({
    properties: {
        width: {
            type: String,
            value: '100%',
        },
    },
    data: {
        height: 0,
        visibility: false,
    },
    heightCorrect: false, //已是正确高度
    lifetimes: {
        attached() {
            var _this = this;
            Object.defineProperty(this, 'parent', {
                get: function () {
                    return _this.getRelationNodes('../virtual-list/index')[0];
                },
            });
            Object.defineProperty(this, 'index', {
                get: function () {
                    var _a, _b;
                    return (_b = (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.indexOf(_this);
                },
            });
        },
    },
    relations: {
        '../virtual-list/index': {
            type: 'parent', // 关联的目标节点应为父节点
            linked: function (target) {
                // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后

                if (!target.visibilityList) return;
                if (target.visibilityList.includes(this.index)) {
                    this.setData({ visibility: true }, () => {
                        if (this.heightCorrect) return;
                        if (target.data.heightEquation) {
                            this.setData({ height: target.singleHeight });
                            this.heightCorrect = true;
                        } else {
                            this.getSelfHeight(target.gap).then(() => {
                                this.heightCorrect = true;
                            });
                        }
                    });
                } else {
                    this.setData({ height: target.singleHeight });
                    if (target.data.heightEquation) this.heightCorrect = true;
                }
            },
            linkChanged: function (target) {
                // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
            },
            unlinked: function (target) {
                // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
            },
        },
    },
    methods: {
        getSelfHeight(gap) {
            return new Promise(resolve => {
                this.getRect(this, '.virtual-list-item').then(res => {
                    const height = res.height + gap;
                    this.setData({ height });
                    this.heightCorrect = true;
                    resolve(height);
                });
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
