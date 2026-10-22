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
        <el-input placeholder="请输入要搜索的账号" v-model.trim="state.queryForm.account" size="default" clearable></el-input>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">姓名：</span>
        <el-input placeholder="请输入要搜索的姓名" v-model.trim="state.queryForm.fullName" size="default" clearable></el-input>
      </div>

            <div class="task-one__item">
        <span class="task-one__label">微信号：</span>
        <el-input placeholder="请输入要搜索的微信号" v-model.trim="state.queryForm.weChat" size="default" clearable></el-input>
      </div>


            <div class="task-one__item">
        <span class="task-one__label">电话：</span>
        <el-input placeholder="请输入要搜索的电话" v-model.trim="state.queryForm.phone" size="default" clearable></el-input>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">国籍：</span>
        <!-- <el-select clearable v-model="state.queryForm.countrySid" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in class_options2" :key="item.sid" :label="item.countriesName" :value="item.sid" />
        </el-select> -->
        <el-select v-model="state.queryForm.countrySid"   :remote-method="remoteMethod" filterable remote placeholder="请选择" style="width: 240px" clearable
          @visible-change="handleVisibleChange"  >
          <el-option v-for="item in classOptions" :key="item.sid" :label="item.countriesName" :value="item.sid" />
        </el-select>
      </div>

      <!-- <div class="task-one__item">
        <span class="task-one__label">添加方式：</span>
        <el-select clearable v-model="state.queryForm.createType" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in state.list" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div> -->
      <div class="task-one__item">
        <span class="task-one__label">求职状态：</span>
        <el-select clearable v-model="state.queryForm.jobStatus" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in state.list2" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <!-- <div class="task-one__item">
        <span class="task-one__label">是否猎头发布：</span>
        <el-select clearable v-model="state.queryForm.publish" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in state.list3" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div> -->
      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="avatar" label="头像"  min-width="90">
          <template #default="{ row }">
            <el-image style="height: 50px; width: 50px;border-radius: 50%;" :src="proxy.imgUrl + row.avatar"
              fit="fill" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="userInfo.userName" label="账号"
          min-width="250"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="userCreated" label="注册时间"
          min-width="190"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="fullName" label="姓名"
          min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sex" label="性别">
          <template #default="{ row }">
            <span>{{ row.sex == 0 ? "男" : row.sex == 1 ? '女' : '未知' }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="birth" label="出生日期" min-width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="countriesName" label="国籍" min-width="250">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="weChat" label="微信" min-width="150">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="phone" label="电话" min-width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="email" label="邮箱" min-width="250">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" align="center" prop="vipOverdueTime" label="会员到期时间"
          min-width="190">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="状态" fixed="right" min-width="90">
          <template #default="{ row }">
            <el-switch v-if="row.sid" @change="setstate(row)" v-model="row.status" inline-prompt size="large"
              active-text="正常" inactive-text="停用" :active-value="0" :inactive-value="1" />
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.sid" class="theme-btn" link type="primary" @click="goinfo(row.sid)">详情
            </el-button>
            <el-button v-if="row.isHeadhunting != 0 && row.sid" class="theme-btn" link type="primary"
              @click="handleEdit(row)">修改会员
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
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"

const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const ruleNewsRef = ref(null)
const ruleNews = reactive({
  roleName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  roleKey: [{ required: true, message: "请输入账号", trigger: "blur" }],
})

const setstate = (row) => {
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
    .put(`/v1/candidate/${row.sid}/state`)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        // pubParams(getList)
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



const state = reactive({
  queryForm: {
    countrySid: null,
    account: null,
    fullName:null,
    createTypet: null,
    jobStatus: null,
    publish: null,
    weChat:null,
    phone:null,
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
    name: '是',
    id: 0
  },
  {
    name: '否',
    id: 1
  },],
})
const ruleNewsForm = reactive({
  vidTime: '',
  sid: '',
})

const remoteMethod =  async (query) => {
  console.log(query,'query');
  page1.value = 1
  await getcountries2(page1.value, pageSize,query);
}


function getcountries2(page, pageSize,name) {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/countries",{
      params: { current:page, size:pageSize,countriesName:name },
    })
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        classOptions.value = res.data.data.records
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




onActivated(() => {
  // getList()
})



onMounted(() => {
  getList();
  loadMoreData()
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
  getdata("/v1/candidate/background", params)
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
// 控制加载状态
    // 每次加载的数量
const goinfo = (val) => {
  router.push({
    path: '/system/candidateDetail',
    query: {
      sid: val
    }
  })
}

const classOptions = ref([]); // 存储下拉选项
let page1 = ref(1);            // 当前页码
const pageSize = 10;          // 每次加载的数量
let scrollContainer = null;   // 存储下拉菜单的滚动容器
// 监听下拉菜单的显示变化
const handleVisibleChange = (visible) => {
  console.log(visible, '下拉框') 
  if (visible) {
    // 下拉框显示时，获取滚动容器并绑定滚动事件
    const dropdown = document.querySelector('.el-select-dropdown .el-scrollbar__wrap');
    if (dropdown) {
      scrollContainer = dropdown;
      scrollContainer.addEventListener('scroll', handleScroll);
    }
  } else {
    // 下拉框隐藏时，移除滚动事件监听
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }
};

// 滚动事件处理
const handleScroll = (event) => {
  const bottom =
    event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
  // 滚动到底部时加载更多
  if (bottom && !loading.value) {
    loadMoreData();
  }
};

// 加载更多数据
const loadMoreData = async () => {
  loading.value = true;
  try {
    // 模拟数据加载，替换成你的接口请求
    await getcountries(page1.value, pageSize);
    page1.value += 1;
  } catch (error) {
    console.error('加载数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 请求获取国家数据
const getcountries = async (page, pageSize,name) => {
  try {
    const response = await proxy.$axios.get('/v1/countries', {
      params: { current:page, size:pageSize,countriesName:name },
    });

    if (response.data.code === 200) {
      const newOptions = response.data.data.records;
      if (newOptions.length > 0) {
        classOptions.value = [...classOptions.value, ...newOptions];
      }
    } else {
      proxy.$message({
        message: response.data.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.error('请求失败', error);
    proxy.$message({
      message: '加载数据失败，请稍后再试',
      type: 'error',
    });
  }
};


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
    .put("/v1/candidate/update-vip-time", params)
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
