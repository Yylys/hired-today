<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div style="margin-bottom: 20px;">
      <el-descriptions class="margin-top" title="个人基础信息" :column="3" size="large" border v-if="info.candidate">
        <el-descriptions-item label="姓名" min-width="100px">{{ info.candidate.fullName }}</el-descriptions-item>
        <el-descriptions-item label="年龄	">{{ info.candidate.age }}</el-descriptions-item>
        <el-descriptions-item label="性别	"> {{ info.candidate.sex == 0 ? "男" : info.candidate.sex == 1 ? '女' : '未知'
          }}</el-descriptions-item>
        <el-descriptions-item label="求职状态	" v-if="info.jobStatus == 0">离职</el-descriptions-item>
        <el-descriptions-item label="求职状态	" v-if="info.jobStatus == 1">在职</el-descriptions-item>
        <el-descriptions-item label="求职状态	" v-if="info.jobStatus == 2">已就业在职</el-descriptions-item>
        <el-descriptions-item label="求职状态	" v-if="info.jobStatus == 4">已就业不求职</el-descriptions-item>
        <el-descriptions-item label="个人优势	">{{ info.personalStrengths }}</el-descriptions-item>
        <el-descriptions-item label="自我评价	">{{ info.content }}</el-descriptions-item>
        <el-descriptions-item label="个人标签" width="200px"><el-tag v-for="item in info.candidate.tag" :type='success'
            type="primary" style="margin: 5px;">{{
              item.memberName }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="附件图片">
          <el-image v-for="item in info.images" :key="item.id" style="width: 100px; height: 100px"
            :src="item.cover" />
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div style="margin-bottom: 20px;">
      <el-descriptions class="margin-top" title="求职期望" :column="3" size="large" border v-if="info.expectations">
        <el-descriptions-item label="期望工作城市" min-width="100px">{{ info.expectations.desiredCity
          }}</el-descriptions-item>
        <el-descriptions-item label="期望工作行业"> {{ info.expectations.desiredIndustry }}</el-descriptions-item>
        <el-descriptions-item label="期望薪资"> {{ info.expectations.minSalary }} - {{ info.expectations.maxSalary
          }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="margin-bottom: 20px;">
      <div style="margin-bottom: 20px;">更多期望</div>
      <el-descriptions class="margin-top" title="" :column="3" size="large" border v-if="info.expectations">
        <div v-for="(item, index) in info.expectations.cardList" :key="item.id">
          <el-descriptions-item label="期望工作城市" min-width="100px">{{ item.desiredCity }}</el-descriptions-item>
          <el-descriptions-item label="期望工作行业"> {{ item.desiredIndustry }}</el-descriptions-item>
          <el-descriptions-item label="期望薪资"> {{ item.minSalary }} - {{ item.maxSalary }}</el-descriptions-item>
        </div>
      </el-descriptions>
    </div>


    <div style="margin-bottom: 20px;" v-if="info.work" v-for="(item, index) in info.work" :key="item.id">
      <el-descriptions class="margin-top" :title="'工作经验' + (index + 1)" :column="3" size="large" border>
        <el-descriptions-item label="公司名称	">{{ item.companyName
          }}</el-descriptions-item>
        <el-descriptions-item label="公司所在国家"> {{ item.companyCountry }}</el-descriptions-item>
        <el-descriptions-item label="公司所在行业"> {{ item.industry }}</el-descriptions-item>
        <el-descriptions-item label="所属部门"> {{ item.department }}</el-descriptions-item>
        <el-descriptions-item label="职位名称"> {{ item.postsName }}</el-descriptions-item>
        <el-descriptions-item label="在职时间"> {{ item.startDate }}__{{ item.endDate }}</el-descriptions-item>
        <el-descriptions-item label="工作内容"> {{ item.descriptionContent }}</el-descriptions-item>
        <el-descriptions-item v-if="item.achievementsContent" label="工作业绩"> {{ item.achievementsContent }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="margin-bottom: 20px;" v-if="info.project">
      <el-descriptions class="margin-top" title="项目经验" :column="3" size="large" border>
        <el-descriptions-item label="项目名称	">{{ info.project.projectName }}</el-descriptions-item>
        <el-descriptions-item label="项目角色"> {{ info.project.projectName }}</el-descriptions-item>
        <el-descriptions-item label="项目时间"> {{ info.project.startDate }}__{{ info.project.endDate
          }}</el-descriptions-item>
        <el-descriptions-item label="项目说明"> {{ info.project.descriptionContent }}</el-descriptions-item>
        <el-descriptions-item label="项目业绩"> {{ info.project.achievementsContent }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div style="margin-bottom: 20px;" v-if="info.school" v-for="(item, index) in info.school" :key="item.id">
      <el-descriptions class="margin-top" :title="'教育经历' + (index + 1)" :column="3" size="large" border>
        <el-descriptions-item label="学校名称	">{{ item.school }}</el-descriptions-item>
        <el-descriptions-item label="学位"> {{ item.schoolName }}</el-descriptions-item>
        <el-descriptions-item label="专业"> {{ item.major }}</el-descriptions-item>
        <el-descriptions-item label="就读时间"> {{ item.startDate }}__{{ item.endDate }}</el-descriptions-item>
        <el-descriptions-item label="教育经历"> {{ item.content}}</el-descriptions-item>
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
    .get(`/v1/resume/${sid}/me`)
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
