Component({
    options: {
        styleIsolation: 'shared',
    },
    /**
     * 组件的属性列表
     */
    properties: {
        loading: Boolean,
        disabled: Boolean,
        block: Boolean,
        shape: {
            type: String,
            value: 'round',
        },
        customStyle: {
            type: Object,
            value: {},
        },
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        tap() {
            this.triggerEvent('tap');
        },
    },
});
