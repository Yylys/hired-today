<template>
  <!-- 头部功能 -->
  <div class="white-box">

    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="jobName"  label="发布人"
        min-width="300">
        <template #default="{ row }">
            <span v-if="row.enterprise">企业：{{ row.enterprise.name }}</span>
            <span v-else>猎头：{{ row.headhunterResultDTO.name }}</span>
          </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="updated" label="提交时间"
      min-width="190"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="jobName" label="岗位名称"
      min-width="150"></el-table-column>


        <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="岗位地址"
          min-width="200"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="minSalary" label="薪资范围" min-width="200">
          <template #default="{ row }">
            <span>{{ row.minSalary }}-{{ row.maxSalary }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="birth" label="出生日期	"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dictExperience.memberName" label="所需工作年限"
          min-width="130">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dictWork.memberName" label="所需工作年限"
          min-width="130">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dictDegree.memberName" label="技能要求"
          min-width="130">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dictExperience.memberName" label="所需类型"
          min-width="130">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="department" label="工作部门" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="skill" label="技能要求" min-width="300">
          <template #default="{ row }">
            <el-tag v-for="item in row.skill" type="primary" style="margin: 5px;">{{
              item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="recruitsCount" label="招聘数量" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="interviewCount" label="面试轮数" min-width="90">
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="content" label="岗位描述"  min-width="90"> </el-table-column>  -->
        <el-table-column :show-overflow-tooltip="true" align="center" prop="recommendPrice" label="猎头佣金" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="audit	" label="审核状态" min-width="90">
          <template #default="{ row }">
            <div v-if="row.audit == 0">未通过</div>
            <div v-if="row.audit == 1">已通过</div>
            <div v-if="row.audit == 2">审核中</div>
            <div v-if="row.audit == 3">已下架</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="状态" fixed="right" min-width="90">
          <template #default="{ row }">
            <el-switch @change="setstate(row, 1)" v-model="row.status" inline-prompt size="large" active-text="正常"
              inactive-text="停用" :active-value="0" :inactive-value="1" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="是否推荐" fixed="right" min-width="90">
          <template #default="{ row }">
            <el-switch @change="setstate(row, 4)" v-model="row.recommend" inline-prompt size="large" active-text="是"
              inactive-text="否" :active-value="0" :inactive-value="1" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.audit == 2" class="theme-btn" link type="primary" @click="setstatus(row)">审核
            </el-button>
            <el-button  class="theme-btn" link type="primary" @click="goinfo(row.sid)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible1" title="岗位审核" width="500" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef">
        <el-form-item label="审核状态" prop="state.jobStatus.type" style="height: 600rpx;">
          <el-radio-group v-model="state.jobStatus.type">
            <el-radio value="2" size="large">通过</el-radio>
            <el-radio value="3" size="large">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="note">
                <el-input v-model.trim="state.jobStatus.note" type="textarea" maxlength="-1" :autosize="{ minRows: 2 }"
                    clearable  placeholder="请输入备注" />
            </el-form-item>
        <el-form-item>
          <div style="margin-top: 30px">
            <el-button type="primary" size="large" @click="submitForms(ruleNewsRef)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)
const centerDialogVisible1 = ref(false)
const type = ref('')





const ruleNewsRef = ref(null)
const ruleNews = reactive({
  // roleName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  // jobStatus: [{ required: true, message: "请选择审核状态", trigger: "blur" }],
})

const setstate = (row, type) => {
  proxy.$axios
    .put('/v1/job/status', { sid: row.sid, type: type })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const state = reactive({
  jobStatus: {
    sid: null,
    type: null,
    note:'',
  },
  queryForm: {
    // countrySid: null,
    jobName: null,
    name: null,
    industry: null,
    address: null,
    objectSid: null,
    // createTypet: null,
    // jobstatus: null,
    status: null
  },
  list: [{
    name: '小程序自主添加',
    id: 1
  },
  {
    name: 'H5扫码添加',
    id: 2
  },],
  list2: [{
    name: '离职-随时到岗',
    id: 0
  },
  {
    name: '在职-月内到岗',
    id: 1
  }, {
    name: '在职-考虑机会',
    id: 2
  }, {
    name: '在职-暂不考虑',
    id: 4
  },],
  list3: [{
    name: '正常',
    id: 0
  },
  {
    name: '停用',
    id: 1
  },],
})
const ruleNewsForm = reactive({
  vidTime: '',
  sid: '',
})

// 请求国籍
const class_options2 = ref([])


function getcountries() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/countries")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        class_options2.value = res.data.data.records
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}






// 表单重置
const reset = () => {
  ruleNewsForm.vidTime = undefined,
    ruleNewsForm.sid = null
  state.jobStatus.type = null
  state.jobStatus.sid = null
  state.jobStatus.note = ''
}


onActivated(() => {
  // getList()
})



onMounted(() => {
  getList();
  getcountries()
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
  getdata("/v1/job/not-reviewed", params)
}

const handleSearch = () => {
  if (state.queryForm.loginIp == '') {
    state.queryForm.loginIp = null
  }
  if (state.queryForm.loginjobName == '') {
    state.queryForm.loginjobName = null
  }
  search_btn.value = true
  pubRefreshParams(getList)

}

const goinfo = (val) => {
  router.push({
    path: '/system/employerDetail',
    query: {
      sid: val
    }
  })
}

// 添加
const handleAdd = () => {
  router.push({
    path: '/system/Addemployer',
    query: {
      sid: state.queryForm.objectSid
    }
  })
}
// 编辑
const handleEdit = (row) => {
  // getDetail(id)
  ruleNewsForm.sid = row.sid
  ruleNewsForm.vidTime = row.vipOverdueTime
  centerDialogVisible.value = true
}

// 审核状态
const setstatus = (row) => {
  // getDetail(id)
  state.jobStatus.sid = row.sid
  centerDialogVisible1.value = true
}

const submitForm = (formEl) => {
  console.log(ruleNewsForm, 'ruleNewsForm')
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      postupdate(ruleNewsForm)
    }
  })
}


const submitForms = (formEl) => {
  console.log(state.jobStatus, 'jobStatus')
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      postupdates(state.jobStatus)
    }
  })
}

const clearval = () => {

  reset()
}


function postupdate(params) {
  proxy.$axios
    .put("/v1/enterprise/update-vip-time", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
        proxy.$message({ message: res.data.msg, type: "error" })
      }
    })
    .catch((err) => { })
}

function postupdates(params) {
  proxy.$axios
    .put("/v1/job/status", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        centerDialogVisible1.value = false
        pubParams(getList)
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
