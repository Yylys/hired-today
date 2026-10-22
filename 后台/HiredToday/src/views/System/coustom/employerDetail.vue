<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div style="margin-bottom: 20px;">
      <el-descriptions class="margin-top" title="岗位信息" :column="3" size="large" border>
        <el-descriptions-item label="岗位名称" min-width="100px">{{ info.jobName }}</el-descriptions-item>
        <el-descriptions-item label="岗位地址">{{ info.address }}</el-descriptions-item>
        <el-descriptions-item label="薪资范围">
          <span>{{ info.minSalary }}-{{ info.maxSalary }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="工作部门">{{info.department}}</el-descriptions-item>
        <el-descriptions-item label="工作类型" v-if="info.dictWork">{{info.dictWork.memberName}}</el-descriptions-item>
        <el-descriptions-item label="所需工作年限" v-if="info.dictDegree">{{info.dictDegree.memberName}}</el-descriptions-item>
        <el-descriptions-item label="所需学历	"v-if="info.dictExperience">{{ info.dictExperience.memberName }}</el-descriptions-item>
        <el-descriptions-item label="招聘数量	">{{ info.recruitsCount }}</el-descriptions-item>
        <el-descriptions-item label="面试轮数	">{{ info.interviewCount }}</el-descriptions-item>
        <el-descriptions-item label="猎头佣金	">{{ info.recommendPrice }}</el-descriptions-item>
        <el-descriptions-item label="个人标签" width="200px">
          <el-tag v-for="item in info.skill" :type='success' type="primary" style="margin: 5px;">{{ item }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核状态" width="200px">
          <div v-if="info.audit	== 0">未通过</div>
            <div v-if="info.audit	== 1">已通过</div>
            <div v-if="info.audit	== 2">审核中</div>
            <div v-if="info.audit	== 3">已下架</div>
        </el-descriptions-item>
        <el-descriptions-item label="职位描述	">{{ info.content }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

var sid = route.query.sid || ""

const { proxy } = getCurrentInstance()



onActivated(() => {

})

onMounted(() => {

  getDetail()
})





const info = ref([])
const valueHtml = ref(null)
function getDetail() {
  proxy.$axios
    .get(`/v1/job/${sid}/job-info`)
    .then((res) => {
      info.value = res.data.data
      valueHtml.value = res.data.data.lineDescribe.replace(/<img [^>]*src=['"]/g, `<img src="${proxy.$urls}/`), // 往图片追加根域名和'/'
        console.log(info.value, ' info.value')
    })
    .catch((err) => { })
}







</script>

<!-- <script>
export default {
  name: "Home",
}
</script> -->

<style lang="less" scoped>
.home-box {
  display: flex;
}

.home-main {
  flex: 1;
  padding: 0 20px 0 0;
}

.home-aside {
  flex: none;
  width: 240px;
}

.text {
  text-wrap: nowrap;
}
</style>
