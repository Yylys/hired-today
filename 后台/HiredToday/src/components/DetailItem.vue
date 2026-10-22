<template>
    <div class="detail-item" :style="{ marginBottom: bottom }" @click.stop="onClick">
        <div class="detail-item__left" :style="{ color: titleColor, fontSize: size, width: titleWidth, fontWeight: weight, textAlign: titleAlign }">
            {{ title }}
        </div>
        <div class="detail-item__right" :style="{ color: valueColor, fontSize: size, fontWeight: valueWeight }">
            <div :class="{ 'line-one': oneValue }" style="line-height: 20px" v-if="value !== ''">
                <em class="item-icon" v-if="priceIcon">￥</em>{{ value }}
            </div>
            <slot v-else />
        </div>
    </div>
</template>

<script setup>
/**
 * 详情的项-item
 * @param {String} title 标题
 * @param {String} titleAlign 标题对齐方式
 * @param {String} bottom 间距
 * @param {String,Number} weight 标题加粗数值
 * @param {String,Number} valueWeight 右侧文本加粗数值
 * @param {String} titleColor 标题颜色
 * @param {String} titleWidth 标题宽度
 * @param {Boolean} oneValue 是否右侧文本显示一行
 * @param {Boolean} priceIcon 价格符号
 * @param {String,Number} value 右侧内容
 * @param {String} valueColor 右侧颜色
 * @param {String} bottom 间距
 */
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    titleAlign: {
        type: String,
        default: "right",
    },
    titleWidth: {
        type: String,
        default: "120px",
    },
    bottom: {
        type: String,
        default: "16px",
    },
    titleColor: {
        type: String,
        default: "#646566",
    },
    oneValue: {
        type: Boolean,
        default: false,
    },
    priceIcon: {
        type: Boolean,
        default: false,
    },
    value: {
        type: [String, Number],
        default: "",
    },
    valueColor: {
        type: String,
        default: "#323233",
    },
    size: {
        type: String,
        default: "14px",
    },
    weight: {
        type: [String, Number],
        default: 500,
    },
    valueWeight: {
        type: [String, Number],
        default: 500,
    },
})

const emits = defineEmits(["click"])
const onClick = () => {
    emits("click")
}
</script>

<style lang="less" scoped>
.detail-item {
    width: 100%;
    display: flex;
    align-items: flex-start;

    .detail-item__left {
        flex: none;
        margin-right: 14px;
    }

    .detail-item__right {
        flex: 1;
        overflow: hidden;
        padding-right: 16px;
        .item-icon {
            font-size: 13px;
        }
    }
}
</style>
