<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data" :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" >
        <el-table-column :show-overflow-tooltip="true"  align="center" label="导入类型">
          <template #default="{ row }">
            <span>{{ row.importType == 1 ? "客户导入" : row.importType == 2 ? "活动报名" : "线路报名" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="导入时间" min-width="210"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="dataNum" label="导入量" min-width="210"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" label="状态" fixed="right" min-width="70">
          <template #default="{ row }">
            <!-- <span>{{ row.status == 0 ? "正常" : "停用" }}</span> -->
            <el-tag :type="row.status == 0 ? '' : 'danger'">{{ row.status == 0 ? "正常" : "停用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" label="文件查看">
          <template #default="{ row }">
            <el-link @click="download(row.fileUrl)" style="color:#409EFF">文件下载</el-link>
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
import { useRouter, useRoute } from "vue-router"
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
import GoBack from "@components/GoBack.vue"

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)


var type = route.query.type || ""


onActivated(() => {
  getList()
})

onMounted(() => {
  getList();
  // getroll()
})

const download = (fileUrl) => {
  proxy.$axios
    .get("/v1/resources" + fileUrl, {
      responseType: "blob",
    })
    .then((res) => {
      console.log(res,'res')

      if (res.status == 200) {
        const arr = fileUrl.split("/")
        // let filename = arr[arr.length - 1]
        let blob = new Blob([res.data], { type: res.headers["content-type"] })
        let href = window.URL.createObjectURL(blob)
        // 创建链接元素
        const link = document.createElement('a');
        link.href = href;

        // 设置下载文件名
        // link.download = filename; // 文件名
        // 将链接元素添加到页面中，模拟点击
        document.body.appendChild(link);
        link.click();

        // 清理临时 URL
        URL.revokeObjectURL(url);
        link.remove()
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

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
    type: type
    // ...state.queryForm
  }
  getdata("/v1/sys-import-record", params)
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
