<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div style="margin-bottom: 20px;">
      <el-descriptions class="margin-top" title="用户信息" :column="3" size="large" border>
        <!-- <el-descriptions-item label="头像">
        <el-image style="width: 100px; height: 100px" :src="proxy.imgUrl + info.headimgurl" />
      </el-descriptions-item> -->
        <el-descriptions-item label="用户">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item v-if="info.idCard" label="身份证">{{ info.idCard }}</el-descriptions-item>
        <el-descriptions-item v-if="info.passport" label="护照">
          <div style="display: flex; align-items: center">
            <span>{{ info.passport }}</span>
            <el-link v-if="info.passportImgUrl" :href="proxy.imgUrl + info.passportImgUrl" :underline="false"
              target="_blank" style="color:#409EFF;margin-left: 10px;">查看图片</el-link>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="年龄" v-if="info.idCard">{{ proxy.$utils.getAge(info.idCard) }}</el-descriptions-item>
        <el-descriptions-item label="生日" v-if="info.idCard">{{ proxy.$utils.getBirthdayFromIdNumber(info.idCard) }}</el-descriptions-item>
        <el-descriptions-item label="性别" v-if="info.idCard">{{ proxy.$utils.getGender(info.idCard) }}</el-descriptions-item>
        
        <el-descriptions-item v-if="info.memberId" label="会员ID">{{ info.memberId }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ info.phone }}</el-descriptions-item>
        <el-descriptions-item label="录入时间">{{ info.created }}</el-descriptions-item>
        <el-descriptions-item label="最近访问时间">{{ info.updated }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <el-tabs  v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <div>
      <el-tab-pane v-if="containsElement(permissions,'system:lineEnroll:query')"  label="线路记录" name="xl">
        <div>
          <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="sid" label="活动ID" min-width="290"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="lineName" label="线路信息" min-width="200">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="customName" label="客户信息" min-width="230">
          <template #default="{ row }">
            <div>姓名：<router-link style="color: #409eff;"
                :to="{ path: '/system/userDetail', query: { sid: row.customSid } }">{{ row.customName }}</router-link>
            </div>
            <div v-if="row.memberId">会员ID：{{ row.memberId }}</div>
            <div>手机号：{{ row.customPhone }}</div>
            <div v-if="row.customIdCard">身份证：{{ row.customIdCard }}</div>
            <div v-if="row.passport">护照：{{ row.passport }}</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" label="时间" min-width="230">
          <template #default="{ row }">
            <div>往返时间：{{ moment(row.startDate).format('MM-DD') }} 至 {{ moment(row.endDate).format('MM-DD') }}</div>
            <div>报名时间：{{ row.created }}</div>
            <div>更新时间：{{ row.updated }}</div>
            <div v-if="row.goBackStartDate">往返开始时间：{{ moment(row.goBackStartDate).format('YYYY-MM-DD') }}</div>
            <div v-if="row.goBackEndDate">往返结束时间：{{ moment(row.goBackEndDate).format('YYYY-MM-DD') }}</div>
          </template> </el-table-column>

        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="businessType" label="操作类型	"> </el-table-column> -->

        <el-table-column :show-overflow-tooltip="true"  align="center" label="报名状态" min-width="90" fixed="right">
          <template #default="{ row }">
            <!-- <span>{{ row.enrollStatus == 0 ? "已报名" : "已取消" }}</span> -->
            <el-tag :type="row.enrollStatus == 0 ? '' : 'danger'">{{ row.enrollStatus == 0 ? "已报名" : "已取消" }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  label="删除标志" min-width="120">
          <template #default="{ row }">
            <span>{{ row.delFlag == 0 ? "未删除" : "已删除" }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center" label="状态" fixed="right" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status == 0 ? '' : 'danger'">{{ row.status == 0 ? "正常" : "停用" }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="报名信息" min-width="170">
          <template #default="{ row }">
            <div v-if="row.goBack">往返方式：{{ row.goBack }}</div>
            <div v-if="row.trafficMode == 1">交通方式：飞机</div>
            <div v-if="row.trafficMode == 2">交通方式：火车/高铁</div>
            <div v-if="row.trafficMode == 3">交通方式：大巴</div>
            <div v-if="row.trafficMode == 10">交通方式：其他</div>
            <div v-if="row.paymentStatus == 0">交款状态：未交</div>
            <div v-if="row.paymentStatus == 1">交款状态：全款</div>
            <div v-if="row.paymentStatus == 2">交款状态：定金</div>
            <div v-if="row.paymentAmount">交款金额：{{ row.paymentAmount }}</div>
            <!-- <div v-if="row.paymentStatus == 2">交款状态：定金</div> -->
            <div v-if="row.lodging">住宿：{{ row.lodging }}</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="saleName" label="服务人员信息" min-width="220">
          <template #default="{ row }">
            <div>服务人员：{{ row.saleName }}</div>
            <div>机构：{{ row.orgName }}</div>

          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  prop="note"  align="center" label="备注" min-width="150" >

        </el-table-column>
      </el-table>

        </div>
      </el-tab-pane>
    </div>
      <el-tab-pane v-if="containsElement(permissions,'system:activityEnroll:list')"  label="活动记录" name="hd">
        <el-table border class="table-mb" v-loading="loading" :data="arr_data"
          :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }" element-loading-background="rgba(255, 255, 255, 0.6)"
          @selection-change="handleAllSelected">
          <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="sid" label="活动ID" min-width="290"> </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="activityName" label="活动名称" min-width="120"> </el-table-column>
          <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="businessType" label="操作类型	"> </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="customName" label="客户名称" min-width="120">
            <template #default="{ row }">
              <span>{{ row.customName }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" label="报名状态" min-width="120" fixed="right">
            <template #default="{ row }">
              <el-tag :type="row.enrollStatus == 0 ? '' : 'danger'">{{ row.enrollStatus == 0 ? "已报名" : "已取消"
                }}</el-tag>

            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="报名时间" min-width="210"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="updated" label="更新时间" min-width="210"> </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="containsElement(permissions,'system:integral:list')" label="积分记录" name="jf"> <el-table border class="table-mb"
          v-loading="loading" :data="arr_data" :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }"
          element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="customName" label="客户名称" min-width="120" fixed="left">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="customPhone" label="客户手机号" min-width="120">
            <!-- <template #default="{ row }">
            <div>手机号：{{ proxy.$utils.hidePhone(row.customPhone)}}</div>
          </template>  -->
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="preIntegral" label="变动前积分" min-width="120"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="changeIntegral" label="变动积分" min-width="120"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="afterIntegral" label="变动后积分	" min-width="120"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="报名时间" min-width="210"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="updated" label="更新时间" min-width="210"> </el-table-column>
        </el-table></el-tab-pane>

      <el-tab-pane  v-if="containsElement(permissions,'system:giftsRecord:receives')"  label="礼品记录" name="lp"> <el-table border
          class="table-mb" v-loading="loading" :data="arr_data" :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }"
          element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
          <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="sid" label="活动ID" min-width="290"> </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="giftImgUrl" label="礼品图片" min-width="80" fixed="left">
            <template #default="{ row }">
              <el-image :src="proxy.imgUrl + row.giftImgUrl" style="width: 50px; height: 50px" />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="giftName" label="礼品名称" min-width="120" fixed="left"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="customPhone" label="客户手机号" min-width="120">
            <template #default="{ row }">
              <span>{{ row.customPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="customName" label="客户名称" min-width="120"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" label="状态" fixed="right">
            <template #default="{ row }">
              <!-- <span>{{ row.type == 0 ? "领取" : "送出" }}</span> -->
              <el-tag :type="row.type == 0 ? 'success' : 'danger'" size="large">{{ row.type == 0 ? "领取" : "送出"
                }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="创建时间" min-width="210"> </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  align="center" prop="updated" label="更新时间" min-width="210"> </el-table-column>
        </el-table></el-tab-pane>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-tabs>

  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter, useRoute } from "vue-router"
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'

const router = useRouter()
const route = useRoute()

const permissions = store.state.value.user.permissions

var sid = route.query.sid || ""

const { proxy } = getCurrentInstance()

const value = ref('')

const srcList = ref([])
const handlePictureCardPreview = (uploadFile) => {
   srcList.value[0] = proxy.imgUrl + uploadFile
}
const activeName = ref('xl')

onActivated(() => {
  // getList()
})

onMounted(() => {
  // console.log(permissions,'permissions')
  getList();
  getDetail()
})


const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));

function containsElement(arr, element) {
  if(userinfo.admin){
    return true
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === element) {
      return true;
    }
  }
  return false;
}


const url = ref(`/v1/sys-line-enroll/custom-record/${sid}`)
const handleClick = (tab, event) => {
  activeName.value = tab.paneName

  if (activeName.value == 'xl') {
    url.value = `/v1/sys-line-enroll/custom-record/${sid}`
    getList()
  }
  if (activeName.value == 'jf') {
    url.value = '/v1/sys-integral'

    getList()
  }
  if (activeName.value == 'lp') {
    url.value = `/v1/sys-gifts-record/receives/${sid}`
    getList()
  }
  if (activeName.value == 'hd') {
    url.value = `/v1/sys-activity-enroll`
    getList()
  }
}


const info = ref([])

function getDetail() {
  // console.log(id,'id')
  proxy.$axios
    .get(`/v1/sys-customs/${sid}`)
    .then((res) => {
      info.value = res.data.data
      console.log(info.value, ' info.value')
    })
    .catch((err) => { })
}


const open = (row) => {
  ElMessageBox.prompt('请输入取消原因', '取消报名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    // inputPattern:
    //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      postDel(row.id, value)
      // ElMessage({
      //   type: 'success',
      //   message: '取消成功',
      // })
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: 'Input canceled',
      // })
    })
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
    customSid: null
  }
  if (activeName.value == 'lp') {
    params.customSid = null
  } else {
    params.customSid = sid
  }
  getdata(url.value, params)
}


const handleSearch = () => {
  // console.log(state.queryForm, 'arr_data')
  search_btn.value = true
  pubRefreshParams(getList)

}

// 删除单个
const handleDelete = (row) => {
  console.log(row, 'row')
  postDel(row.id, value)
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
function postDel(params, val) {
  proxy.$axios
    .post("admin/hd/bm/cancel", {
      id: params,
      cancel_cause: val
    })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: res.data.msg, type: "success" })
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
  router.push('/System/RoleEdit')
}
// 编辑
const handleEdit = (id) => {
  console.log(id)
  router.push({
    path: '/Activity/Applydetail',
    query: {
      id
    }
  })
}





</script>

<!-- <script>
export default {
  name: "Home",
}
</script> -->

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

.text {
  text-wrap: nowrap;
}
</style>
