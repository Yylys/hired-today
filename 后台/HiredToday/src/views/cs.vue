<template>
  <!-- 头部功能 -->
  <div class="white-box" >
    <div class="table-mb" >
      <el-button  :icon="Delete" @click="allDel">批量删除</el-button>
      <!-- <el-button type="primary" :icon="CirclePlus" @click="handleAdd">添加</el-button> -->
    </div>
    <div class="task-one">
      <!-- <div class="task-one__item">
        <span class="task-one__label">操作人员用户id：</span>
        <el-input placeholder="请输入要搜索的操作人员用户id" v-model.trim="state.queryForm.operatorUserId" size="default" clearable></el-input>
      </div> -->
      <div class="task-one__item">
        <span class="task-one__label">操作人：</span>
        <el-input placeholder="请输入要搜索的操作人	" v-model.trim="state.queryForm.operatorUserName" size="default" clearable></el-input>
      </div>

      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div >
      <el-table ref="multipleTable" border  class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }" element-loading-background="rgba(255, 255, 255, 0.6)"
        @selection-change="handleAllSelected">
        <el-table-column :show-overflow-tooltip="true"  align="center" type="selection" width="55" />
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="id" label="角色ID"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="title" label="系统模块" min-width="120"> </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="businessType" label="操作类型	"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center"  label="操作类型">
          <template #default="{ row }">
            <span v-if="row.businessType==0">其它</span>
            <span v-if="row.businessType==1">新增</span> 
            <span v-if="row.businessType==2">修改</span>
            <span v-if="row.businessType==3">删除</span>
            <span v-if="row.businessType==4">查询</span>
            <span v-if="row.businessType==5">导出</span>
            <!-- <span v-if="businessType==6">导入</span>
            <span v-if="businessType==7">强退</span>
            <span v-if="businessType==8">生成代码</span>
            <span v-if="businessType==9">清空数据</span>
            <span v-if="businessType==10">查询</span> -->
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="requestMethod" label="请求方式"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="operatorUserName" label="操作人" min-width="90"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="operatorIp" label="操作IP" min-width="180"> </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  label="状态">
          <template #default="{ row }">
            <span>{{ row.status == 0 ? "正常" : "停用" }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="note" label="角色描述"> </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  label="是否开发人员">
                  <template #default="{ row }">
                      <span>{{ row.is_main == 0 ? "否" : "是" }}</span>
                  </template>
              </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="requestTime" label="操作时间" min-width="210"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="requestTime" label="操作时间" width="100">
          <template #default="{ row }">
            <span v-if="row.requestTime">{{ proxy.$utils.splitDate(row.requestTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="updated_at" label="更新时间" > </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="role_label" label="菜单权限"> </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  label="状态">
              <template #default="{ row }">
                  <span class="status-text" v-if="row.audit == 0">待审核</span>
                  <span class="status-text" v-else>{{ row.audit == 1 ? "已通过" : "已拒绝" }}</span>
              </template>
          </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="order_by" label="排序"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center"  prop="on_time_label" label="发布时间" width="160"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center"  label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <!-- <el-button class="theme-btn" link type="primary" @click="handleEdit(row.sid)">编辑
            </el-button> -->
            <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(row)">
              <template #reference>
                <el-button  class="theme-btn" link type="primary" >删除
                </el-button>
              </template>
            </el-popconfirm>
            <!-- <el-button class="theme-btn" link type="primary" @click="handleEdit(row.id, 2)">修改密码
                      </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum"
                :total="totalNums" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" title="机构信息" width="500" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="ruleNewsForm.roleName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色权限key" prop="roleKey">
          <el-input v-model.trim="ruleNewsForm.roleKey" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="note	">
          <el-input type="textarea"   maxlength="-1" v-model.trim="ruleNewsForm.note" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="显示排序" prop="level">
          <el-input-number v-model="ruleNewsForm.level" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="是" inactive-text="否"
            :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="角色" prop="sid">
          <el-cascader v-model="ruleNewsForm.menuSids" :props="props" :options="class_options" collapse-tags clearable
            placeholder="请选择管理权限" />
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
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
import { userStore } from "@store/user"

const multipleTable = ref(null);

const store = userStore()
const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

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



const state = reactive({
  queryForm: {
    operatorUserName: null,
    // title	: null,
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
    .get("/v1/sys-menus/treeButtonSelect")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data.data, 'role')
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

onMounted( async() => {
  await getList();
  // getroll()
  // console.log(store.permissions,'permissions')
  // console.log(store,'system:loginLog:query')
  // console.log(arr_data.value,'arr_data.value')

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
  getdata("/v1/logs/operation-logs", params).then(() => {
    console.log(arr_data.value, '0000000000000')
    let arr=['13529175609','19143146977']
    // arr_data.value.forEach(row => {
    //     if (row.operatorUserName=="13529175609") { // 示例条件：默认勾选年龄大于24的数据行
    //       multipleTable.value.toggleRowSelection(row, true);
    //     }
    //   });
      arr_data.value.forEach(row => {
        if (arr.includes(row.operatorUserName)) { // 判断ID是否在idArray中
          multipleTable.value.toggleRowSelection(row, true);
        }
      });
  })
}

const handleSearch = () => {
  if(state.queryForm.operatorUserName	==''){
    state.queryForm.operatorUserName	=null
  }
  // if(state.queryForm.operatorUserId==''){
  //   state.queryForm.operatorUserId=null
  // }
  search_btn.value = true
  pubRefreshParams(getList)

}


// 删除单个
const handleDelete = (row) => {
  console.log(row, 'row')
  postDel([row.sid])
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
  ids.value = val
}
const allDel = () => {
    if (ids.value.length == 0) {
        proxy.$message({message:"请选择需要删除的数据",type:"warning"})
        return
    }
    let arrs = []
    for (let i = 0; i < ids.value.length; i++) {
        arrs.push(ids.value[i].sid)
    }
    console.log(arrs,'arrs')
    postDel(arrs)
}
// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/logs/operation-logs/delete", { sidList: params})
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


function getDetail(sid) {
  proxy.$axios
    .get(`/v1/logs/operation-logs/${sid}`)
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
    .post("/v1/logs/operation-logs", params)
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
    .put("/v1/logs/operation-logs", params)
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
</style>
