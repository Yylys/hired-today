Component({
    options: {
        styleIsolation: 'apply-shared',
    },
    /**
     * 组件的属性列表
     */
    properties: {
        value: {
            type: Number,
            value: 1,
        },
        min: {
            type: [Number, String],
            value: 0,
        },
        max: {
            type: [Number, String],
        },
    },
    observers: {
        value: function (newValue) {
            this._value = newValue;
        },
    },
    _value: 1, //组件内部值

    /**
     * 组件的初始数据
     */
    data: {},
    /**
     * 组件的方法列表
     */
    methods: {
        onMinus() {
            if (this._value <= Number(this.data.min)) {
                return;
            }
            this._value -= 1;
            this.publicTriggerEvent('minus');
            this.publicTriggerEvent('change');
        },
        onPlus() {
            if (this.data.max != undefined && this._value >= Number(this.data.max)) {
                return;
            }
            this._value += 1;
            this.publicTriggerEvent('plus');
            this.publicTriggerEvent('change');
        },
        onInputBlur(e) {
            let value = Number(e.detail.value);
            if (value === this._value) return;
            value = Math.max(this.data.min, value);
            if (this.data.max != undefined) {
                value = Math.min(this.data.max, value);
            }
            this._value = value;
            this.publicTriggerEvent('change');
        },
        publicTriggerEvent(eventName) {
            this.triggerEvent(eventName, {
                value: this._value,
            });
        },
    },
});
