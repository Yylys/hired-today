<template>
    <div :class="{ showPadding: showpd, 'bg-color': bgcolor }">
        <div class="pub-title flexs" :style="{ marginBottom: bottom }">
            <div class="pub-title-left line-one" :style="{ fontSize: titleSize, color: titleColor }">
                {{ title }}
                <span class="title-left__sub" v-if="subtitle">{{ subtitle }}</span>
            </div>
            <div class="pub-title-right">
                <span class="pub-title-text" :style="{ fontSize: textSize }" v-if="text" @click="onClick">{{ text }}</span>
                <el-icon v-if="arrow"><arrow-right /></el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowRight } from "@element-plus/icons-vue"

/**
 * 容器内头部标题
 * @param {String} title 左侧标题文字
 * @param {String} subtitle 左侧副标题文字
 * @param {String} titleSize 标题文字大小，默认16px
 * @param {String} textSize 标题文字大小，默认14px
 * @param {String} bottom 底部外边距，默认20px
 * @param {String} title 标题文字颜色，默认#323233
 * @param {String} text 右侧文字
 * @param {Boolean} arrow = [true|false] 开启/关闭右侧箭头
 * @param {Boolean} bgcolor = [true|false] 开启/关闭标题背景颜色
 * @param {Boolean} showpd = [true|false] 默认关闭，开启标题左右内边距10px
 */
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    subtitle: {
        type: String,
        default: "",
    },
    text: {
        type: String,
        default: "",
    },
    titleSize: {
        type: String,
        default: "16px",
    },
    bottom: {
        type: String,
        default: "20px",
    },
    textSize: {
        type: String,
        default: "14px",
    },
    titleColor: {
        type: String,
        default: "#323233",
    },
    arrow: {
        type: Boolean,
        default: false,
    },
    showpd: {
        type: Boolean,
        default: false,
    },
    bgcolor: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits(["click"])
const onClick = () => {
    emits("click")
}
</script>

<style lang="less" scoped>
.pub-title {
    .pub-title-left {
        flex: 1;
        font-weight: 900;
        .title-left__sub {
            margin-left: 8px;
            font-size: 14px;
            color: @gray-6;
            font-weight: 400;
        }
    }

    .pub-title-right {
        margin-left: 10px;
        flex: none;
        display: flex;
        align-items: center;
        font-weight: 500;
        .pub-title-text,
        .el-icon {
            color: #175ddb;
            &:hover {
                cursor: pointer;
                color: #0543b2;
            }
        }
    }
}
.showPadding {
    padding: 0px 10px;
}
.bg-color {
    background: #fff;
}
</style>
