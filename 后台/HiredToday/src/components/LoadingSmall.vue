<template>
    <div class="load-box">
        <div class="load-icon" v-loading="loading"></div>
        <p>{{ text }}</p>
    </div>
</template>

<script setup>
/**
 * 局部加载
 * @param {String} text 加载提示文字
 * @param {Boolean} loading 加载状态
 */
const props = defineProps({
    text: {
        type: String,
        default: "载入中...",
    },
    loading: {
        type: Boolean,
        default: true,
    },
})
</script>

<style lang="less" scoped>
.load-box {
    font-size: @font-size-md;
    color: #999;
    padding: @padding-xl 0px @padding-mdl;
    text-align: center;
    .load-icon {
        margin-bottom: @margin-md;
        padding: @padding-mdl 0px;
    }
}
</style>
