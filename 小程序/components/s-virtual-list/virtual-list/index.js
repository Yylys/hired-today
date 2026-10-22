import pageScrollMixin from '../mixin/pageScroll';
import { rpx2px, debounce } from '../utils.js';

Component({
    properties: {
        heightEquation: {
            type: Boolean,
            value: true,
        },
        gap: {
            type: [Number, String],
            value: '20rpx',
        },
        visibilityNum: {
            type: [Number, String],
            value: 10,
        },
        bufferSize: {
            type: [Number, String],
        },
        //偏移量
        scrollTopOffset: {
            type: Number,
            value: 0,
        },
        columns: {
            type: [Number, String],
            value: 1,
        },
        //scroll-view时需要使用scroll-top设置滚动位置
        scrollViewTop: Number,
    },
    behaviors: [pageScrollMixin('onPageScroll'), 'wx://component-export'],
    lifetimes: {
        attached() {
            let _this = this;
            Object.defineProperty(this, 'children', {
                get() {
                    return _this.getRelationNodes('../virtual-list-item/index');
                },
            });
            this.lastScrollTop = 0;
            this.gap = this.getGap();

            this.visibilityNum = Number(this.data.visibilityNum);
            if (this.data.bufferSize != null) {
                this.bufferSize = Number(this.data.bufferSize);
            } else {
                this.bufferSize = this.visibilityNum;
            }
            this.columns = Number(this.data.columns);
        },
    },
    data: {},
    init: false,
    visibilityList: [],
    lastVisibilityList: [],
    lastScrollTop: 0,
    gap: 0,
    lastCurrent: 0,
    singleHeight: 0, //每项高度 heightEquation===false时为预估高度
    latestTasks: void 0, //最新待渲染任务
    looping: false,
    bufferSize: 0,
    visibilityNum: 10,
    columns: 1,
    methods: {
        getGap() {
            if (typeof this.data.gap === 'number') {
                return this.data.gap;
            } else if (Number(this.data.gap) == this.data.gap) {
                return Number(this.data.gap);
            } else if (this.data.gap.includes('rpx')) {
                return rpx2px(Number(this.data.gap.split('rpx')[0]));
            } else if (this.data.gap.includes('px')) {
                return Number(this.data.gap.split('px')[0]);
            }
        },
        initVisibilityList() {
            wx.nextTick(async () => {
                const childrens = this.children;
                const childrensLength = childrens.length;
                if (childrensLength === 0) return;

                const { end } = this.getStartAndEnd(0);
                const sliceEndIndex = Math.min(end, childrensLength - 1);

                for (var i = 0; i < childrensLength; i++) {
                    const children = childrens[i];
                    if (this.data.heightEquation) {
                        if (i === 0) {
                            const firstChildrenHeight = await this.getChildrenHeight(children);
                            this.singleHeight = firstChildrenHeight;
                        } else {
                            let patchObj = { height: this.singleHeight };
                            if (i <= sliceEndIndex) {
                                Object.assign(patchObj, { visibility: true });
                            }
                            children.setData(patchObj);
                            children.heightCorrect = true;
                        }
                    } else {
                        if (i <= sliceEndIndex) {
                            await this.getChildrenHeight(children);
                            if (i === sliceEndIndex) this.getAvgHeight(childrens.slice(0, sliceEndIndex + 1));
                        } else {
                            //补全剩余的未显示的子项预估高度
                            childrens.slice(sliceEndIndex + 1, childrensLength).forEach(instance => {
                                instance.setData({ height: this.singleHeight });
                            });
                        }
                    }
                }

                this.visibilityList = this.getVisibility(0);
                this.lastVisibilityList = this.visibilityList;
            });
        },
        getChildrenHeight(children) {
            let _this = this;
            return new Promise(resolve => {
                children.setData({ visibility: true }, () => {
                    children.getSelfHeight(_this.gap).then(height => {
                        children.heightCorrect = true;
                        resolve(height);
                    });
                });
            });
        },
        //取平均值作为预估高度
        getAvgHeight(childrens) {
            const totalHeight = childrens.reduce((c, i) => {
                return c + i.data.height;
            }, 0);
            this.singleHeight = totalHeight / childrens.length;
        },
        onPageScroll(e) {
            const scrollTop = e.scrollTop !== void 0 ? e.scrollTop : e.detail.scrollTop;
            if (Math.abs(scrollTop - this.lastScrollTop) > (this.singleHeight || 100)) {
                this.lastScrollTop = scrollTop;
                this.latestTasks = this.handler.bind(this, scrollTop);
                if (!this.looping) {
                    this.looping = true;
                    this.loop();
                }
            }
        },
        loop() {
            const fn = this.latestTasks;
            this.latestTasks = void 0;
            fn && fn();

            //准备下一轮
            const timeId = setTimeout(() => {
                if (this.latestTasks) {
                    this.loop();
                } else {
                    this.looping = false;
                }
                clearTimeout(timeId);
            }, 150);
        },
        handler(scrollTop) {
            const childrens = this.children;

            const current = this.getCurrentVisibilityIndex(scrollTop, childrens);
            if (current === this.lastCurrent) return;

            this.lastCurrent = current;
            const visibilityList = this.getVisibility(current);
            this.lastVisibilityList = this.visibilityList;
            this.visibilityList = visibilityList;

            const start = Math.min(this.lastVisibilityList[0], this.visibilityList[0]);
            const end = Math.max(this.lastVisibilityList[this.lastVisibilityList.length - 1], this.visibilityList[this.visibilityList.length - 1]);

            this.patch(start, end, childrens);
        },
        patch(start, end, childrens) {
            for (let i = start; i <= end; i++) {
                const children = childrens[i];
                if (!children) return;
                if (this.visibilityList.includes(i)) {
                    if (!children.data.visibility) {
                        children.setData({ visibility: true }, () => {
                            if (!children.heightCorrect) children.getSelfHeight(this.gap);
                        });
                    }
                } else if (children.data.visibility) {
                    children.setData({ visibility: false });
                }
            }
        },
        getCurrentVisibilityIndex(scrollTop, childrens) {
            let childrenHeightSum = 0;
            for (var i = 0, length = childrens.length; i < length; i = i + this.columns) {
                childrenHeightSum += childrens[i].data.height;
                if (childrenHeightSum >= scrollTop - this.data.scrollTopOffset) return i;
            }
        },
        getVisibility(current) {
            const { start, end } = this.getStartAndEnd(current);
            let visibilityList = [];
            for (let i = start; i <= end; i++) {
                visibilityList.push(i);
            }
            return visibilityList;
        },
        getStartAndEnd(current) {
            //前后多显示一页，防止滑动太快白屏
            const start = Math.max(0, current - this.bufferSize);
            const end = current + this.visibilityNum + this.bufferSize - 1;
            return { start, end };
        },
        reinitialize(scrollTop) {
            if (scrollTop !== void 0) {
                this.lastScrollTop = scrollTop;
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0,
                });
                this.setData({ scrollViewTop: scrollTop });
            }
            this.init = false;
        },
    },
    relations: {
        '../virtual-list-item/index': {
            type: 'child',
            linked: function(target) {
                // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
                if (!this.init) {
                    this.init = true;
                    this.initVisibilityList();
                }
            },
            linkChanged: debounce(function(target) {
                // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
                 
                this.handler(this.lastScrollTop);
            }, 1000),
            unlinked: function(target) {
                // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
            },
        },
    },
    export () {
        return { reinitialize: this.reinitialize.bind(this) };
    },
});