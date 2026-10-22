<template>
  <!-- 头部功能 -->
  <div class="white-box">

    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="created" label="创建时间"
          width="190"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="time" label="面试时间"
          width="190"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="title" label="面试主题"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="detail" label="面试细节	"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="interviewer" label="面试官"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="platform" label="面试平台"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="userInfo.userInfo.userName" label="被邀请账号" min-width="130"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="account" label="邀请者账号">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="state" label="面试结果">
          <template #default="{ row }">
            <div v-if="row.state == 0">未反馈</div>
            <div v-if="row.state == 1">不合适</div>
            <div v-if="row.state == 2">邀请面试</div>
            <div v-if="row.state == 3">面试通过</div>
            <div v-if="row.state == 4">面试中</div>
            <div v-if="row.state == 5">已入职</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="reason" label="拒绝理由"> </el-table-column>

      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
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
    ascended: false,
    sortFieldName: 'created'
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
  getdata("/v1/interview/system-interview", params)
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
