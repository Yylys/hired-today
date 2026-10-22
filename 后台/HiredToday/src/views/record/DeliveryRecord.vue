<template>
  <!-- 头部功能 -->
  <div class="white-box">

    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }" element-loading-background="rgba(255, 255, 255, 0.6)">
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="投递时间" width="190"></el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="jobInfo.jobName" label="岗位名称"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="userInfo.userName" label="投递人账号"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="jobInfo.publish.nickName" label="被投递人账号	"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="msg" label="是否猎头"> 
          <template #default="{ row }">
            <div v-if=" row.userInfo && row.userInfo.isHeadhunting==0">是</div>
            <div v-else>否</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="feedbackType" label="反馈结果">
          <template #default="{ row }">
            <div v-if="row.feedbackType==0">No Feedback</div>
            <div v-if="row.feedbackType==1">Candidate Unfit</div>
            <div v-if="row.feedbackType==2">Inviting</div>
            <div v-if="row.feedbackType==3">Passed</div>
            <div v-if="row.feedbackType==4">Pending Interview</div>
            <div v-if="row.feedbackType==5">Hired</div>
            <div v-if="row.feedbackType==6">Interview Invitation Failed</div>
            <div v-if="row.feedbackType==7">Candidate Unfit</div>
            <div v-if="row.feedbackType==8">Pending Confirmation</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="feedbackContent" label="反馈内容	"> </el-table-column>

      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum"
                :total="totalNums" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
  </div>

</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)


const state = reactive({
  queryForm: {
    ascended:false,
    sortFieldName:'created'
  },
})

onActivated(() => {
  // getList()
})

onMounted(() => {
  getList();
  // getroll()
})


const { current, sizeNum, size, loading, arr_data, totalNums, search_text, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

// 切换每页显示条数
watch(size, (val) => {
  // console.log('qiehuan')
  current.value = 1
  size.value = val
  pubParams(getList)
})
// 跳转第几页
watch(current, (val) => {
  current.value = val
  pubParams(getList)
})

function getList() {
  let params = {
    current: current.value,
    size: size.value,
     ...state.queryForm
  }
  getdata("/v1/job/job-user", params)
}




// 添加
const handleAdd = () => {
  centerDialogVisible.value = true
}
// 编辑
const handleEdit = (id, num) => {
  console.log(id, 'id')
  getDetail(id)
  centerDialogVisible.value = true
}

function getDetail(sid) {
  proxy.$axios
    .get(`/v1/logs/login-logs/${sid}`)
    .then((res) => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        let result = res.data.data
        menus.value = res.data.data.sids
        ruleNewsForm.menuSids = res.data.data.sids
        ruleNewsForm.sid = result.sid
        ruleNewsForm.roleName = result.roleName
        ruleNewsForm.roleKey = result.roleKey
        ruleNewsForm.level = result.level
        ruleNewsForm.note = result.note
        ruleNewsForm.is_stop = result.is_stop
        ruleNewsForm.status = result.status
        // console.log(res.data.data, 'res.data.data.records')
      } else {
        proxy.$message({ message: res.data.msg, type: "error" })
      }
    })
    .catch((err) => { })
}

</script>

<script>
// export default {
//   name: "Home",
// }
</script>

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
</style>
