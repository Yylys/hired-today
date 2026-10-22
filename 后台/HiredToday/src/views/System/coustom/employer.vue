<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <!-- <div class="table-mb" >
      <el-button :icon="Delete" @click="allDel">批量删除</el-button>
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">添加</el-button>
    </div> -->
    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">账号：</span>
        <el-input placeholder="请输入" v-model.trim="state.queryForm.userName" size="default"
          clearable></el-input>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">企业名称：</span>
        <el-input placeholder="请输入" v-model.trim="state.queryForm.name" size="default"
          clearable></el-input>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">企业主业：</span>
        <el-input placeholder="请输入" v-model.trim="state.queryForm.industry" size="default"
          clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">企业地址：</span>
        <el-input placeholder="请输入" v-model.trim="state.queryForm.address" size="default"
          clearable></el-input>
      </div>
      <!-- <div class="task-one__item">
        <span class="task-one__label">国籍：</span>
        <el-select clearable v-model="state.queryForm.countrySid" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in class_options2" :key="item.sid" :label="item.countriesName" :value="item.sid" />
        </el-select>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">添加方式：</span>
        <el-select clearable v-model="state.queryForm.createType" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in state.list" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">求职状态：</span>
        <el-select clearable v-model="state.queryForm.jobstatus" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in state.list2" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div> -->


      <div class="task-one__item">
        <span class="task-one__label">停用状态：</span>
        <el-select clearable v-model="state.queryForm.status" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in state.list3" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>


      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sex" label="企业头像" min-width="100">
          <template #default="{ row }">
            <el-image style="height: 80px; width: 80px;border-radius: 50%;" :src="proxy.imgUrl + row.avatar"
              fit="fill" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="userName" label="账号" min-width="200"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="企业名称" min-width="200"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="userCreated" label="注册时间"
        min-width="190"></el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="birth" label="出生日期	"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" align="center" prop="industry" label="企业主业" min-width="200">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="企业地址" min-width="200">
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="email" label="邮箱"> </el-table-column> -->

        <el-table-column :show-overflow-tooltip="true" align="center" prop="vipOverdueTime" label="会员到期时间"
          min-width="200">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="状态" fixed="right" min-width="90">
          <template #default="{ row }">
            <el-switch v-if="row.sid" @change="setstate(row, 1)" v-model="row.status" inline-prompt size="large" active-text="正常"
              inactive-text="停用" :active-value="0" :inactive-value="1" />
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" align="center" label="保证金状态" fixed="right" min-width="120">
          <template #default="{ row }">
            <el-switch v-if="row.sid" @change="setstates(row, 6, row.deposit)" v-model="row.deposit" inline-prompt size="large"
              active-text="正常" inactive-text="停用" :active-value="0" :inactive-value="1" />
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" align="center"  label="操作"
          width="180" fixed="right">
          <template #default="{ row }" >
            <el-button v-if="row.sid" class="theme-btn" link type="primary" @click="goinfo(row.userInfo.sid)">岗位详情
            </el-button>
            <el-button v-if="row.sid" class="theme-btn" link type="primary" @click="handleEdit(row)">修改会员
            </el-button>
            <!-- <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="theme-btn" link type="primary">删除
                </el-button>
              </template>
  </el-popconfirm> -->
            <!-- <el-button class="theme-btn" link type="primary" @click="handleEdit(row.id, 2)">修改密码
                      </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" title="会员修改" width="500" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef">
        <el-form-item label="会员到期时间" prop="vidTime" style="height: 600rpx;">
          <el-date-picker v-model="ruleNewsForm.vidTime" type="datetime" placeholder="请选择会员到期时间"
            value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss" />
        </el-form-item>
        <el-form-item>
          <div style="margin-top: 30px">
            <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter } from "vue-router"
import { ElMessageBox } from 'element-plus'
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
import GoBack from "@components/GoBack.vue"

const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const ruleNewsRef = ref(null)
const ruleNews = reactive({
  roleName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  roleKey: [{ required: true, message: "请输入账号", trigger: "blur" }],
})

const setstate = (row, type) => {
  // ElMessageBox.confirm(
  //   '求职者停用，关联信息将会失效，确认停用吗?',
  //   '停用提示',
  //   {
  //     confirmButtonText: '确认',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // )
  //   .then(() => {
  proxy.$axios
    .put('/v1/enterprise/status', { sid: row.sid, type: type })
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
  // })
  //       .catch(() => {
  //         row.status = 0
  //       })
}
const setstates = (row, type, num) => {
  if (num == 1) {
    // console.log('有保证金')
    ElMessageBox.confirm(
      '取消保证金后，将移除后续相关权限，确认移除吗?',
      '停用提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        proxy.$axios
          .put('/v1/enterprise/status', { sid: row.sid, type: type })
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
      })
      .catch(() => {
        row.deposit = 0
      })
  } else {
    proxy.$axios
      .put('/v1/enterprise/status', { sid: row.sid, type: type })
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


}



const state = reactive({
  queryForm: {
    // countrySid: null,
    userName: null,
    name:null,
    industry:null,
    address:null,

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


// 配置级联选择参数
const props2 = ref({
  // multiple: true,
  value: "sid",
  label: "countriesName",
  // children: "children",
})
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
}

// 配置级联选择参数
const props = ref({
  multiple: true,
  value: "sid",
  label: "menuName",
  children: "children",
})
const class_options = ref([])



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
  getdata("/v1/enterprise/background", params)
}

const handleSearch = () => {
  if (state.queryForm.loginIp == '') {
    state.queryForm.loginIp = null
  }
  if (state.queryForm.loginUserName == '') {
    state.queryForm.loginUserName = null
  }
  search_btn.value = true
  pubRefreshParams(getList)

}

const goinfo = (val) => {
  router.push({
    path: '/system/employerList',
    query: {
      sid: val
    }
  })
}


// 删除单个
const handleDelete = (row) => {
  console.log(row, 'row')
  postDel([row.sid])
}
// 删除多个

const handleAllSelected = (val) => {
  ids.value = val
}
const ids = ref([])
const allDel = () => {
  if (ids.value.length == 0) {
    proxy.$message({ message: "请选择需要删除的数据", type: "warning" })
    return
  }
  let arrs = []
  for (let i = 0; i < ids.value.length; i++) {
    arrs.push(ids.value[i].sid)
  }
  console.log(arrs, 'arrs')
  postDel(arrs)
}
// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/logs/login-logs/delete", { sidList: params, })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '删除成功', type: "success" })
        pubParams(getList)
      } else {
        proxy.$message({ message: res.data.msg, type: "error" })
      }
    })
    .catch((err) => { })
}


// 添加
const handleAdd = () => {
  centerDialogVisible.value = true
}
// 编辑
const handleEdit = (row) => {
  // getDetail(id)
  ruleNewsForm.sid = row.sid
  ruleNewsForm.vidTime = row.vipOverdueTime
  centerDialogVisible.value = true
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
