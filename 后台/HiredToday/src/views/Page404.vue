<template>
    <div class="page-box">
        <div class="one-box">
            <el-image :src="not_img" fit="cover"></el-image>
            <p>抱歉，您访问的页面不存在</p>
            <el-button size="large" @click="handleHome">返回首页</el-button>
        </div>
    </div>
</template>

<script setup>
import not_img from "@images/404.png"
import { useRouter } from "vue-router"

const router = useRouter()

const handleHome = () => {
    router.push("/approval/approval")
}
</script>

<style lang="less" scoped>
.page-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 16px 0px;
}
.one-box {
    text-align: center;
    h1 {
        font-size: 26px;
        color: #111;
        font-weight: 500;
    }
    p {
        margin-top: @margin-xs;
        font-size: 14px;
        color: #555;
    }
    .el-button {
        margin-top: @margin-lg;
    }
}
</style>
