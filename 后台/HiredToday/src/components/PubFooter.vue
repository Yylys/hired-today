<template>
    <div class="app-foot">
        <p class="foot-info">© {{ years }} {{ company }} , Inc. All rights reserved.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
/**
 * 底部版本信息
 * @param {date} years 自动获取当前年份
 * @param {String} company 公司
 */
const props = defineProps({
    company: {
        type: String,
        default: "",
    },
})

const years = ref("")
onMounted(() => {
    let date = new Date()
    years.value = date.getFullYear()
})
</script>

<style lang="less" scoped>
.app-foot {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px;
    .foot-info {
        color: #888;
        font-size: 14px;
        margin-left: @margin-xs;
    }
}
</style>
