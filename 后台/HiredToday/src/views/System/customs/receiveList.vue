<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" :data="arr_data" :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)">
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="giftImgUrl" label="礼品图片" min-width="80" fixed="left">
          <template #default="{ row }">
            <el-image :src="proxy.imgUrl + row.giftImgUrl" style="width: 40px; height: 40px" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="giftName" label="礼品名称" min-width="120" fixed="left"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="giftNum" label="礼品数量" min-width="90" fixed="left"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="customName" label="客户名称" min-width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="customPhone" label="客户手机号" min-width="120">
          <template #default="{ row }">
            <span>{{ proxy.$utils.hidePhone(row.customPhone) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  label="状态" fixed="right">
          <template #default="{ row }">
            <span>{{ row.type == 0 ? "领取" : "送出" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="created" label="创建时间" min-width="210"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="updated" label="更新时间" min-width="210"> </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import { useRouter, useRoute } from "vue-router"
import { userStore } from "@store/user"
import OneLoad from "@mixins/one-load"

const store = userStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)
var sid = route.query.sid || ""

onActivated(() => {
  getList(sid)
})

onMounted(() => {
  getList(sid);
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
    size: size.value
  }
  getdata(`/v1/sys-gifts-record/receives/${sid}`, params)
}

</script>

<script>
export default {
  name: "Home",
}
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
