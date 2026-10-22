<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div class="table-mb">
      <el-button  icon="CirclePlus" @click="alladd(1)">赠送礼品</el-button>
      <el-button icon="Search" @click="getdetail">领取记录</el-button>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" :data="arr_data" :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)">
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center" align="center" prop="sid" label="活动ID" min-width="290"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="giftImgUrl" label="礼品图片" min-width="60">
          <template #default="{ row }">
            <el-image :src="proxy.imgUrl + row.giftImgUrl" style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="giftName" label="礼品名称" min-width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="giftNum" label="礼品数量" min-width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="note" label="备注" min-width="100">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button  class="theme-btn" link type="primary"
              style="margin-left: 14px" :disabled="row.giftNum == 0"  @click="handleDelete(row, 2)">提取礼品
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" lineName="机构信息" width="600" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef" style="width: 85%"
        v-if="type == 1">
        <el-form-item label="礼品" prop="giftSid">
          <!-- <el-cascader v-model="ruleNewsForm.giftSid" :props="props" :options="class_options" collapse-tags clearable
            placeholder="请选择礼品" /> -->
          <el-select v-model="ruleNewsForm.giftSid" placeholder="请选择或搜索需要赠送的礼品" clearable size="default" filterable>
            <el-option v-for="item in class_options" :key="item.sid" :label="item.giftName" :value="item.sid"
              style="height: 50px; line-height: 50px;  margin: 5px 0" :disabled="item.giftAble == 0" >
              <!-- {{ proxy.imgUrl + item.giftImgUrl}} -->
              <div style="display: flex; justify-content: space-between; width: 600px;">
                <el-image :src="proxy.imgUrl + item.giftImgUrl" style="width: 50px; height: 50px" />
                <span >{{ item.giftName }}</span>
                <div>余量:<span>{{ item.giftAble }}</span></div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="giftNum">
          <!-- <el-input v-model.trim="ruleNewsForm.giftNum" clearable placeholder="请输入" style="width: 100%" /> -->
          <el-input-number :min="1" v-model="ruleNewsForm.giftNum" clearable />
        </el-form-item>
        <el-form-item>
          <div style="margin-top: 30px">
            <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef" style="width: 85%"
        v-if="type == 2">
        <el-form-item label="礼品">
          <!-- <el-cascader v-model="ruleNewsForm.giftSid" :props="props" :options="class_options" collapse-tags clearable
            placeholder="请选择礼品" /> -->
          <el-input disabled v-model.trim="ruleNewsForm.giftName" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="剩余数量">
          <el-input disabled v-model.trim="ruleNewsForm.giftNum" style="width: 100%" />
        </el-form-item>
        <el-form-item label="提取数量" prop="giftNum">
          <!-- <el-input v-model.trim="ruleNewsForm.giftNum" clearable placeholder="请输入" style="width: 100%" /> -->
          <el-input-number :min="0" :max="ruleNewsForm.giftNum" v-model="ruleNewsForm.giftNums" />
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
import { useRouter, useRoute } from "vue-router"
import { userStore } from "@store/user"

const store = userStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)
var sid = route.query.sid || ""

const ruleNewsRef = ref(null)
const ruleNews = reactive({
  giftNum: [{ required: true, message: "请输入数量", trigger: "blur" }],
  giftSid: [{ required: true, message: "请选择礼品", trigger: "blur" }],
})
const ruleNewsForm = reactive({
  giftNums: 0,
  giftNum: 0,
  giftSid: '',
})

// 表单重置
const reset = () => {
  ruleNewsForm.sid = undefined,
    ruleNewsForm.giftNum = 0,
    ruleNewsForm.giftSid = '',
    ruleNewsForm.giftNums = 0
}

const class_options = ref([])
function getroll() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-gifts/list")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data.data, 'role')
        // class_options.value = res.data.data
        class_options.value  =  res.data.data.filter(item => item.status === 0);
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
  // getList(sid)
})

onMounted(() => {
  getList(sid);
  getroll()

})


let arr_data = ref([])

function getList(sid) {
  proxy.$axios
    .get(`/v1/sys-gifts/custom-gifts/${sid}`)
    .then((res) => {
      if (res.data.code == 200) {
        console.log(res.data.data, 666666)
        // console.log(res.data.data, 'res.data.data.records')
        arr_data.value = res.data.data
        console.log(arr_data.value, ' arr_data.value')
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })

}

const type = ref(null)
const alladd = (num) => {
  type.value = num
  centerDialogVisible.value = true
}

// 送礼
const handleDelete = (row, num) => {
  type.value = num
  centerDialogVisible.value = true
  ruleNewsForm.giftNum = row.giftNum
  ruleNewsForm.giftName = row.giftName
  ruleNewsForm.giftSid = row.sid,
    console.log(row, 'row')
}

// 删除接口
function postDel(params) {
  proxy.$axios
    .put('/v1/sys-gifts/extract-gifts', params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '提取成功', type: "success" })
        centerDialogVisible.value = false
        getList(sid)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}






const submitForm = (formEl) => {
  console.log(ruleNewsForm.giftNum, 'ruleNewsForm')
  if(ruleNewsForm.giftNum==0){
    proxy.$message({ message:'总送数量不能为0!', type: "error" })
    return
  }

  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      if (type.value == 1) {
        console.log('新增')
        let data = {
          giftNum: ruleNewsForm.giftNum,
          giftSid: ruleNewsForm.giftSid,
          customSid: sid
        }
        // console.log(data,data)
        postadd(data)
      } else {
        // console.log('编辑')
        let data = {
          giftNum: ruleNewsForm.giftNums,
          giftSid: ruleNewsForm.giftSid,
          customSid: sid
        }
        postDel(data)
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
    .post("/v1/sys-gifts/give-gifts", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '赠送成功', type: "success" })
        centerDialogVisible.value = false
        getList(sid)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const getdetail = () => {
  console.log(sid, 'sid')
  router.push({
    path: '/system/receiveList',
    query: {
      sid
    }
  })
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
