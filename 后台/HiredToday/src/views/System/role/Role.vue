<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div class="table-mb">
      <!-- <el-button type="primary" plain :icon="Delete" @click="allDel">批量删除</el-button> -->
      <el-button type="primary" icon="CirclePlus" @click="handleAdd">添加</el-button>
    </div>
    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">角色名称：</span>
        <el-input placeholder="请输入要搜索的角色名称" v-model.trim="state.queryForm.roleName" size="default" clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">权限字符：</span>
        <el-input placeholder="请输入要搜索的权限字符" v-model.trim="state.queryForm.roleKey" size="default" clearable></el-input>
      </div>

      <div class="task-one__btn clearfix">
        <el-button  :loading="search_btn" icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data" :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  type="index" label="序号" width="55" /> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="id" label="角色ID"> </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="username" label="账号"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="roleName" label="角色名称" width="200"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="roleKey" label="权限字符" width="120"> </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="tel" label="手机号" min-width="90"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" label="状态" width="90">
          <template #default="{ row }">
            <!-- <span>{{ row.status == 0 ? "正常" : "停用" }}</span> -->
            <el-tag :type="row.status == 0 ? '' : 'danger'">{{ row.status == 0 ? "正常" : "停用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="note" label="角色描述" min-width="100">

        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="创建时间" width="160"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="创建时间" width="100">
          <template #default="{ row }">
            <span v-if="row.created">{{ proxy.$utils.splitDate(row.created) }}</span>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true"  align="center" label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button  class="theme-btn" link type="primary"
              @click="handleEdit(row.sid)">编辑
            </el-button>

              <el-popconfirm  v-if="row.deletable == 0" title="确定删除此项吗？" width="170px" confirm-button-text="确定" cancel-button-text="取消"
                @confirm="handleDelete(row)">
                <template #reference>
                  <el-button   class="theme-btn" link type="primary"
                    style="margin-left: 14px">删除
                  </el-button>
                </template>
              </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" title="角色信息" width="600" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef">
        <el-form-item label="角色名称" prop="roleName" style="margin-top: 10px">
          <el-input v-model.trim="ruleNewsForm.roleName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色权限key" prop="roleKey">
          <el-input v-model.trim="ruleNewsForm.roleKey" clearable placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="note	">
          <el-input type="textarea"  maxlength="-1" v-model.trim="ruleNewsForm.note" clearable
            placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="角色等级" prop="level">
          <el-input-number v-model="ruleNewsForm.level" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="数据范围" prop="activityStatus">
          <el-select v-model="ruleNewsForm.dataScope" placeholder="数据范围" clearable style="width: 93.5%;" size="large">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="正常" inactive-text="停用"
            :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="管理权限" prop="sid">
          <el-cascader v-model="ruleNewsForm.menuSids" :props="props" :options="class_options" collapse-tags clearable
            placeholder="请选择管理权限"/>
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
const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const ruleNewsRef = ref(null)
const ruleNews = reactive({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleKey: [{ required: true, message: "请输入角色权限key", trigger: "blur" }],
  // note: [{ required: true, message: "请输入备注", trigger: "blur" }],
  // name: [{ required: true, message: "请输入姓名", trigger: "change" }],
  // tel: [
  //   { required: true, message: '手机号不能为空', trigger: 'blur' },
  //   { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  // ]
})

const sids=ref(null)
const state = reactive({
  queryForm: {
    roleName: null,
    roleKey: null,
    status: null,
  }
})


const menus = ref([])
const ruleNewsForm = reactive({
  roleName: '',
  roleKey: "",
  note: "",
  level: 1,
  dataScope: 1,
  sid: null,
  status: 1,
  menuSids: [],
})

// 表单重置
const reset = () => {
  sids.value = null,
    ruleNewsForm.roleName = null,
    ruleNewsForm.roleKey = undefined,
    ruleNewsForm.note = undefined,
    ruleNewsForm.level = 1,
    ruleNewsForm.dataScope = 1
  ruleNewsForm.status = 1,
    ruleNewsForm.menuSids = []
}

// 配置级联选择参数
const props = ref({
  multiple: true,
  value: "sid",
  label: "menuName",
  children: "children",
})
const class_options = ref([])
function getroll() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/menus/treeSelect")
    .then((res) => {
      if (res.data.code == 200) {
        console.log(res.data.data, 'role')
        class_options.value = res.data.data
        // console.log(role.value, 'role.value')
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


onActivated(() => {
  // getList()
})

onMounted(() => {
  getList();
  getroll()
})

const options = [
  {
    value: 1,
    label: '全部',
  },
  {
    value: 2,
    label: '本级及下级',
  },
  {
    value: 3,
    label: '本级',
  },
  {
    value: 4,
    label: '仅下级',
  },
  {
    value: 5,
    label: '自定义',
  }
]


const { current, sizeNum, size, loading, arr_data, totalNums, search_text, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

// 切换每页显示条数
watch(size, (val) => {
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
  getdata("/v1/roles", params)
}

const handleSearch = () => {
  // console.log(state.queryForm, 'arr_data')
  search_btn.value = true
  pubRefreshParams(getList)

}

// 删除单个
const handleDelete = (row) => {
  console.log(row, 'row')
  postDel(row)
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
  ids.value = val
}

// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/roles/delete", {
      sidList: [params.sid],
    })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '删除成功', type: "success" })
        pubParams(getList)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
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
    .get(`/v1/roles/${sid}`)
    .then((res) => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        let result = res.data.data
        menus.value = res.data.data.sids
        ruleNewsForm.menuSids = res.data.data.menuTreeCode
        // ruleNewsForm.sid = result.sid
        ruleNewsForm.roleName = result.roleName
        ruleNewsForm.roleKey = result.roleKey
        ruleNewsForm.level = result.level
        ruleNewsForm.dataScope=result.dataScope
        ruleNewsForm.note = result.note
        ruleNewsForm.is_stop = result.is_stop
        ruleNewsForm.status = result.status
        sids.value=result.sid
        // console.log(res.data.data, 'res.data.data.records')
      } else {
                if(res.data.code!=403){
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
      if (sids.value == null) {
        console.log('新增')
        let data = {
          roleName: ruleNewsForm.roleName,
          roleKey: ruleNewsForm.roleKey,
          note: ruleNewsForm.note,
          level: ruleNewsForm.level,
          dataScope:ruleNewsForm.dataScope,
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
          dataScope:ruleNewsForm.dataScope,
          status: ruleNewsForm.status,
          menuSids: cid,
          // sid: ruleNewsForm.sid
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
    .post("/v1/roles", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '新增成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

function postupdate(params) {
  proxy.$axios
    .put(`/v1/roles/${sids.value}`, params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
                if(res.data.code!=403){
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

:deep(.el-cascader__tags) {
  overflow: hidden;
  flex-wrap: nowrap;
}
</style>
