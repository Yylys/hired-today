<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <!-- <Header></Header> -->
    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">支付人账号：</span>
        <el-input placeholder="请输入要搜索的支付人账号：" v-model.trim="state.queryForm.account" size="default" clearable></el-input>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">付款状态：</span>
        <el-select clearable v-model="state.queryForm.paymentStatus" placeholder="请选择" style="width: 240px">
          <el-option key="0" label="未付款" value="0" />
          <el-option key="1" label="已付款" value="1" />
        </el-select>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">支付类型：</span>
        <el-select clearable v-model="state.queryForm.payType" placeholder="请选择" style="width: 240px">
          <el-option key="1" label="活动" value="1" />
          <el-option key="2" label="求职者会员" value="2" />
          <el-option key="3" label="企业会员" value="3" />
          <el-option key="4" label="猎头会员" value="4" />
        </el-select>
      </div>

      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="created" label="支付时间"
          width="190"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="user.nickName" label="支付人">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="payAmount" label="支付金额(元)">
          <template #default="{ row }">
            {{ row.payAmount / 100 }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="payAmount" label="支付类型">
          <template #default="{ row }">
            <span v-if="row.paymentStatus == 0">未付款</span>
            <span v-if="row.paymentStatus == 1">已付款</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="payAmount" label="支付类型">
          <template #default="{ row }">
            <span v-if="row.payType == 1">活动</span>
            <span v-if="row.payType == 2">求职者会员</span>
            <span v-if="row.payType == 3">企业会员</span>
            <span v-if="row.payType == 4">猎头会员</span>
          </template>
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
import { useRouter } from "vue-router"
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)




const state = reactive({
  queryForm: {
    account: null,
    payType: null,

    paymentStatus: null,
  },
})

const handleSearch = () => {
    search_btn.value = true
    pubRefreshParams(getList)
}


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
  getdata("/v1/pay/page-pay", params)
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
