Component({
    /**
     * 列表加载状态（空提示，加载中图标，没有更多提示）
     * 组件的属性列表
     * property { Boolean } loading 是否显示加载中提示
     * property { Boolean } finished 是否显示没有更多提示
     * property { Boolean } des 空提示文字
     * property { Boolean } image 空提示图片
     */
    properties: {
        loading: Boolean,
        empty: {
            type: Boolean,
        },
        finished: Boolean,
        emptyTip: {
            type: String,
        },
        noMoreTip: String,
        image: {
            type: String,
            value: '/assets/img/empty.png',
        },
        showNoMoreTip: {
            type: Boolean,
            value: true,
        },
    },
});
