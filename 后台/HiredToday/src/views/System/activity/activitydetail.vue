<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <!-- <div class="table-mb" >
      <el-button :icon="Delete" @click="allDel">批量删除</el-button>
    </div> -->
    <!-- <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">活动名称：</span>
        <el-input placeholder="请输入要搜索的活动名称	" v-model.trim="state.queryForm.activityName" size="default"
          clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">客户名称：</span>
        <el-input placeholder="请输入要搜索的客户名称：	" v-model.trim="state.queryForm.customName" size="default"
          clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">报名状态：</span>
        <el-select v-model="state.queryForm.enrollStatus" placeholder="报名状态" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div  class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div> -->
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="user.nickName" label="报名账号" min-width="290">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="user.userName" label="报名人姓名"
          min-width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center"  prop="user.activityId" label="支付金额(元)"
          min-width="120">
          <template #default="{ row }">
            <div v-if="row.pay && row.pay.payAmount">{{ row.pay.payAmount / 100 }}</div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="pay.created" label="报名时间" min-width="210">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="pay.payCode" label="订单号" min-width="210">
        </el-table-column>

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
import { useRouter, useRoute } from "vue-router"
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
import { userStore } from "@store/user"

const store = userStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)
var sid = route.query.sid || ""

const ruleNewsRef = ref(null)
const ruleNews = reactive({
  roleName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  roleKey: [{ required: true, message: "请输入账号", trigger: "blur" }],
  // note: [{ required: true, message: "请输入备注", trigger: "blur" }],
  // name: [{ required: true, message: "请输入姓名", trigger: "change" }],
  // tel: [
  //   { required: true, message: '手机号不能为空', trigger: 'blur' },
  //   { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  // ]
})

const options = [
  // {
  //   value: null,
  //   label: '全部',
  // },
  {
    value: 1,
    label: '已取消',
  },
  {
    value: 0,
    label: '已报名',
  }
]


const state = reactive({
  queryForm: {
    sid: sid,
  }
})

const menus = ref([])
const ruleNewsForm = reactive({
  roleName: '',
  roleKey: "",
  note: "",
  level: 0,
  sid: null,
  status: 0,
  menuSids: [],
})

// 表单重置
const reset = () => {
  ruleNewsForm.sid = undefined,
    ruleNewsForm.roleName = null,
    ruleNewsForm.roleKey = undefined,
    ruleNewsForm.note = undefined,
    ruleNewsForm.level = null,
    ruleNewsForm.status = 1,
    ruleNewsForm.menuSids = []
}
onActivated(() => {
  // getList()
})

onMounted(() => {
  getList();
  // console.log(store.permissions,'permissions')
  // console.log(store,'system:loginLog:query')
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
  console.log(sid, 'sid')
  let params = {
    current: current.value,
    size: size.value,
    ...state.queryForm
  }
  getdata("/v1/activity/application", params)
}

const handleSearch = () => {
  if (state.queryForm.activityName == '') {
    state.queryForm.activityName = null
  }
  // if(state.queryForm.activitySid==''){
  //   state.queryForm.activitySid=null
  // }
  search_btn.value = true
  pubRefreshParams(getList)

}


// 删除单个
const handleDelete = (row) => {
  postDel(row.sid)
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
  ids.value = val
}
// 删除接口
function postDel(sid) {
  proxy.$axios
    .put(`/v1/sys-activity-enroll/${sid}`)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '删除成功', type: "success" })
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


function getDetail(sid) {
  proxy.$axios
    .get(`/v1/sys-activity-enroll/${sid}`)
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
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}





const submitForm = (formEl) => {
  console.log(ruleNewsForm, 'ruleNewsForm')
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      console.log(menus.value == ruleNewsForm.menuSids, 'menus.value==ruleNewsForm.menus_id')
      let cid = ''
      if (menus.value == ruleNewsForm.menuSids) {
        cid = ruleNewsForm.menuSids
      } else {
        const mergedArray = Array.from(ruleNewsForm.menuSids.reduce((acc, curr) => {
          const set = new Set(curr);
          return new Set([...acc, ...set]);
        }, new Set()));
        cid = mergedArray.flat()
      }
      if (ruleNewsForm.sid == null) {
        console.log('新增')
        let data = {
          roleName: ruleNewsForm.roleName,
          roleKey: ruleNewsForm.roleKey,
          note: ruleNewsForm.note,
          level: ruleNewsForm.level,
          status: ruleNewsForm.status,
          menuSids: cid
        }
        // console.log(data,data)
        postadd(data)
      } else {
        console.log('编辑')
        console.log(cid)
        let data = {
          roleName: ruleNewsForm.roleName,
          roleKey: ruleNewsForm.roleKey,
          note: ruleNewsForm.note,
          level: ruleNewsForm.level,
          status: ruleNewsForm.status,
          menuSids: cid,
          sid: ruleNewsForm.sid
        }
        postupdate(data)
      }
    }
  })
}


const clearval = () => {
  // fileList.value = []
  ruleNewsForm.treeCode = null
  reset()
}

function postadd(params) {
  proxy.$axios
    .post("/v1/sys-activity-enroll", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '新增成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

function postupdate(params) {
  proxy.$axios
    .put("/v1/sys-activity-enroll", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
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
