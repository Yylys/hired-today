<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div>
      <div class="table-mb">
        <!-- <el-button type="primary" plain :icon="Delete" @click="allDel">批量删除</el-button> -->
        <el-button type="primary" @click="handleEdit()" icon="CirclePlus">添加主公司</el-button>
      </div>
      <el-table border class="table-mb" v-loading="loading" row-key="sid" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  type="index" label="序号" width="55" /> -->
        <el-table-column :show-overflow-tooltip="true" prop="orgName" label="组织名称" min-width="100"> </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="addressName" label="机构地址" min-width="90"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" align="center" prop="addressName" label="公司地址" min-width="300">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="phone" label="联系电话" width="160">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button  class="theme-btn" link type="primary"
              @click="handleEdit(1, row)">添加子公司
            </el-button>
            <el-button       class="theme-btn" link type="primary"
              @click="handleEdit(2, row)">编辑
            </el-button>
            <span >
              <el-popconfirm title="确定删除此管理员吗？" confirm-button-text="确定" cancel-button-text="取消"
                @confirm="handleDelete(row)">
                <template #reference>
                  <el-button class="theme-btn" link type="primary" style="margin-left: 14px">删除
                  </el-button>
                </template>
              </el-popconfirm>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination v-model:current-current="current" v-model:current-size="size" :current-sizes="sizeNum"
        :total="totalNums" layout="total, sizes, prev, currentr, next, jumper">
      </el-pagination>
      <go-back /> -->
    </div>
    <div>
      <el-dialog v-model="centerDialogVisible" title="公司信息" width="600" align-center @close="clearval()">
        <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef" style="width: 80%;">
          <el-form-item label="公司名称" prop="orgName" style="margin-top: 10px">
            <el-input v-model.trim="ruleNewsForm.orgName" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="公司地址" prop="addressName">
            <el-input v-model.trim="ruleNewsForm.addressName" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input type="tel" v-model.trim="ruleNewsForm.phone" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <div style="margin-top: 30px">
              <el-button type="primary" size="large" @click="submitbanner(ruleNewsRef)">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter } from "vue-router"
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
// import Header from "@components/PubHeader.vue"

const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)


const state = reactive({
  queryForm: {
    orgName: null,
    name: null,
    tel: null,
  }
})
const ruleNewsRef = ref(null)

const ruleNews = reactive({
  orgName: [
    { required: true, message: "机构名称不能为空", trigger: "blur" }
  ],
  addressName: [
    { required: true, message: "地址不能为空", trigger: "blur" }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^(0\d{2,3}-\d{7,8})$|^(1[3456789]\d{9})$/, message: '请输入正确号码', trigger: 'blur' }
  ]

})

const ruleNewsForm = reactive({
  addressName: '',
  orgName: "",
  phone: "",
  treeCode: null,
  sid: null
})


onActivated(() => {
  // getList()
})

onMounted(() => {
  getList();
})

const submitbanner = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      if (type.value == 1 || type.value == '') {
        postAdd()
      } else {
        postupdete()
      }
      pubParams(getList)
    }
  })
}




const { current, sizeNum, size, loading, arr_data, totalNums, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

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
  getdata("/v1/sys-orgs/treeSelect", params)
}


// 修改
const setstate = (row) => {
  console.log(row, '1111111')
  proxy.$axios
    .post("admin/system/admin/update", row)
    .then((res) => {
      // form_loading.value = false
      if (res.data.code == 200) {
        proxy.$message({ message: res.data.msg, type: "success" })
        getdata("/v1/sys-orgs/treeSelect")
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => {
      // form_loading.value = false
    })
}

const handleSearch = () => {
  // console.log(state.queryForm, 'arr_data')
  search_btn.value = true
  pubRefreshParams(getList)
}

// 删除单个
const handleDelete = (row) => {
  // console.log(row,'row')
  postDel(row)
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
  ids.value = val
}
// const allDel = () => {
//     if (ids.value.length == 0) {
//         proxy.$message({message:"请选择需要删除的数据",type:"warning"})
//         return
//     }
//     let arrs = []
//     for (let i = 0; i < ids.value.length; i++) {
//         arrs.push(ids.value[i].article_id)
//     }
//     postDel(arrs)
// }
// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/sys-orgs/delete", {
      sidList: [params.sid],
    })
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


// 新增接口
function postAdd() {
  let params = {}
  if (type.value == 1) {
    params.addressName = ruleNewsForm.addressName,
      params.orgName = ruleNewsForm.orgName,
      params.phone = ruleNewsForm.phone
    params.parentTreeCode = ruleNewsForm.parentTreeCode
  } else {
    params.addressName = ruleNewsForm.addressName,
      params.orgName = ruleNewsForm.orgName,
      params.phone = ruleNewsForm.phone
  }

  proxy.$axios
    .post("/v1/sys-orgs", params)
    .then((res) => {
      console.log(res.data)
      if (res.data.code == 200) {
        proxy.$message({ message: "添加成功", type: "success" })
        pubParams(getList)
        centerDialogVisible.value = false
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// 修改接口
function postupdete() {
  proxy.$axios
    .put("/v1/sys-orgs", ruleNewsForm)
    .then((res) => {
      // form_loading.value = false
      if (res.data.code == 200) {
        // console.log(proxy,'proxy')
        proxy.$message({ message: " 修改成功", type: "success" })
        pubParams(getList)
        centerDialogVisible.value = false
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
  // form_loading.value = false
}



// 添加
const handleAdd = () => {
  router.push('/System/AdminEdit')
}
const type = ref('')
// 编辑
const handleEdit = (num, row) => {
  console.log(row,'row')
  ruleNewsForm.treeCode = null
  ruleNewsForm.addressName = null
  ruleNewsForm.orgName = null
  ruleNewsForm.phone = null
  ruleNewsForm.sid = null
  ruleNewsForm.parentTreeCode = null
  if (row && num == 1) {
    type.value = num
    ruleNewsForm.parentTreeCode = row.treeCode
  } else if (row && num == 2) {
    type.value = num
    ruleNewsForm.treeCode = row.treeCode
    ruleNewsForm.addressName = row.addressName
    ruleNewsForm.orgName = row.orgName
    ruleNewsForm.phone = row.phone
    ruleNewsForm.sid = row.sid
    // console.log(exportMenuNamesByParentTreeCode(arr_data.value, row.parentTreeCode),22222222) 
  }
  centerDialogVisible.value = true
}

// 回显父元素
function exportMenuNamesByParentTreeCode(objects, parentTreeCode) {
  console.log(objects,'objects')
  console.log(parentTreeCode,'parentTreeCode')
  const menuNames = [];

  function extractMenuNames(obj) {
    // 调试输出，显示正在检查的对象的 treeCode
    // console.log(`Checking object with treeCode: ${obj.treeCode}`);

    if (obj.treeCode === parentTreeCode) {
      menuNames.push(obj.menuName);
      // 调试输出，显示匹配的对象的 menuName
      // console.log(`Found matching object with menuName: ${obj.menuName}`);
    }

    if (obj.children && obj.children.length > 0) {
      obj.children.forEach(child => {
        extractMenuNames(child);
      });
    }
  }

  objects.forEach(obj => {
    extractMenuNames(obj);
  });

  return menuNames;
}


const clearval = () => {
  // fileList.value = []
  ruleNewsForm.treeCode = null
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
