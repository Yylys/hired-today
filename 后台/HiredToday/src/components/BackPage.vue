<template>
    <div :style="{ marginBottom: bottom }">
        <el-page-header @back="goBack" :title="title" :content="content"></el-page-header>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router"
/**
 * 返回上一页
 * @param {String} title 标题文字
 * @param {String} content 内容
 * @param {String} bottom 容器距离底部距离，默认0px
 */
const props = defineProps({
    title: {
        type: String,
        default: "返回",
    },
    content: {
        type: String,
        default: "",
    },
    bottom: {
        type: String,
        default: "0px",
    },
})

const router = useRouter()
const goBack = () => {
    router.go(-1)
}
</script>

<style lang="less" scoped>
.el-page-header {
    :deep(.el-page-header__left) {
        &:hover {
            i,
            div {
                color: #155bd4;
            }
        }
    }

    :deep(.el-page-header__content) {
        font-size: 14px;
    }
}
</style>
