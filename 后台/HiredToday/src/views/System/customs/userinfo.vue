<template>
  <div class="white-box">
    <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef"
      style="width: 85%; margin-top: 20px;">
      <el-form-item label="客户姓名" prop="name">
        <el-input v-model.trim="ruleNewsForm.name" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="证件类型" prop="type">
        <el-radio-group v-model="state.form.type">
          <el-radio label="0">身份证</el-radio>
          <el-radio label="1">护照</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- { validator: validateIDNumber, trigger: 'blur' }   @blur="validateIDNumber()" -->
      <el-form-item v-if="state.form.type == '0'" label="身份证号码" prop="idCard">
        <el-input v-model.trim="ruleNewsForm.idCard" clearable placeholder="请输入" />
        <!-- <span v-if="idNumberError" style="color: red;">{{ idNumberError }}</span><br> -->
      </el-form-item>
      <el-form-item label="护照" prop="passport" v-if="state.form.type == '1'">
        <el-input v-model.trim="ruleNewsForm.passport" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="护照图片" prop="passport" v-if="state.form.type == '1'">
        <el-upload v-model:file-list="fileList" ref="uploadRef" v-loading="imgLoading" class="prize-upload" :limit=limit
          :action="actionImgUrl()" :http-request="uploadImg" list-type="picture-card" :multiple="false"
          :on-remove="handleRemove"  :on-change="fileChange"
          :on-preview="handlePreview">
          <el-icon color="#999">
            <upload-filled />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="ruleNewsForm.phone" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="纪念日" prop="anniversary">
        <el-input v-model.trim="ruleNewsForm.anniversary" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="退休单位" prop="retireUnit">
        <el-input v-model.trim="ruleNewsForm.retireUnit" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="正常" inactive-text="停用"
          :active-value="0" :inactive-value="1" />
      </el-form-item>
      <!-- <el-form-item label="交通方式" prop="trafficMode">
          <el-select v-model="ruleNewsForm.trafficMode" placeholder="请选择交通方式" collapse-tags clearable>
            <el-option v-for="item in trafficMode" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款状态" prop="paymentStatus">
          <el-select v-model="ruleNewsForm.paymentStatus" placeholder="请选择付款状态" collapse-tags clearable>
            <el-option v-for="item in paymentStatus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
      <el-form-item label="会员ID">
        <el-input v-model.trim="ruleNewsForm.memberId" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="客户标签" prop="labelSids">
        <el-select v-model="ruleNewsForm.labelSids" multiple placeholder="客户标签" clearable>
          <el-option v-for="item in class_options" :key="item.sid" :label="item.labelName" :value="item.sid" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户来源" prop="sourceSid">
        <!-- <el-cascader filterable v-model="ruleNewsForm.sourceSid" :props="props1" :options="class_options1"
            collapse-tags clearable placeholder="请选择客户来源" /> -->
        <el-select v-model="ruleNewsForm.sourceSid" placeholder="客户来源" clearable>
          <el-option v-for="item in class_options1" :key="item.sid" :label="item.sourceName" :value="item.sid" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="userinfo.roleKeySet[0] != 'sale'" label="销售负责人" prop="sourceSid">
        <el-select v-model="ruleNewsForm.saleSid" placeholder="销售负责人" clearable>
          <el-option v-for="item in class_options2" :key="item.sid" :label="item.nickName" :value="item.sid" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="userinfo.roleKeySet[0] == 'sale'" label="销售负责人" prop="sourceSid">
        <el-input disabled v-model.trim="userinfo.nickName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="积分余额" prop="integral">
        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.trim="ruleNewsForm.integral" clearable
          placeholder="请输入" />
      </el-form-item>
      <el-form-item label="地址" prop="address	">
        <el-input type="textarea"  maxlength="-1" :autosize="{ minRows: 4 }"
          v-model.trim="ruleNewsForm.address" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注" prop="note	">
        <el-input type="textarea"  maxlength="-1" :autosize="{ minRows: 4 }"
          v-model.trim="ruleNewsForm.note" clearable placeholder="请输入" />
      </el-form-item>

      <el-form-item>
        <div class="foot-btn flexs-center" style="margin-top: 30px">
          <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 图片库 -->
    <!-- <picture-library :show="showImg" :select_multiple="false" @close="showImg = false" @select="selectImg">
      </picture-library> -->
    <go-back />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, shallowRef, reactive, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { UploadFilled, CloseBold } from "@element-plus/icons-vue"
import GoBack from "@components/GoBack.vue"
import PictureLibrary from "@components/PictureLibrary.vue"
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import UploadImg from "@mixins/upload-img"
import { userStore } from "@store/user"

const store = userStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const ruleNewsRef = ref(null)

var sid = route.query.sid || ""

onMounted(() => {
  // store.getInclude(["customs"])
  console.log(store.includeList,'store.state.user.userInfo.orgSid')
  getorg()
  getorg1()
  getorg2()
  if(sid){
    getinfo()
  }
})


const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
const state = reactive({
  queryForm: {
    name: null,
    phone: null,
    saleSid: [],
    labelSids: [],
    sourceSid: [],
    startDate: null,
    endDate: null,
    orgSid: [],
    trafficMode: '',
    paymentStatus: ''
  },
  list: {
    customSid: '',
  },
  form: {
    type: '0'
  }
})

const ruleNewsForm = reactive({
  name: '',
  note: "",
  phone: "",
  anniversary: '',
  retireUnit: '',
  integral: 0,
  saleSid: '',
  labelSids: [],
  sourceSid: [],
  sid: null,
  status: 0,
  passport: "",
  memberId: null,
  address: ""
})


const ruleNews = reactive({
  name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  // integral: [{ required: true, message: "请输入积分余额", trigger: "blur" }],
  // saleSid: [{ required: true, message: "请输入销售员", trigger: "blur" }],
  trafficMode: [{ required: true, message: "请选择客户标签", trigger: "blur" }],
  paymentStatus: [{ required: true, message: "请选择客户来源", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  idCard: [
    { required: true, message: "请输入身份证号码", trigger: "blur" },
    { pattern: /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/, message: '请输入正确的身份证号', trigger: 'blur' }
  ],
  passport: [
    { required: true, message: "请输入护照号", trigger: "blur" },
    { pattern: /(^[a-zA-Z0-9]{9}$)/, message: '请输入正确的护照号', trigger: 'blur' },
  ]
})


const submitForm = (formEl) => {
  // console.log(ruleNewsForm, '2222222222')
  // console.log(formEl,'formEl')
  if (!formEl) return
  // console.log(1111111)
  formEl.validate((valid, fields) => {
    // console.log(first)

    if (valid) {
      // console.log(3333333)
      if (ruleNewsForm.sid == null || ruleNewsForm.sid == undefined || !ruleNewsForm.sid) {
        console.log('新增')
        let data = {
          note: ruleNewsForm.note,
          name: ruleNewsForm.name,
          address: ruleNewsForm.address,
          memberId: ruleNewsForm.memberId,
          phone: ruleNewsForm.phone,
          anniversary: ruleNewsForm.anniversary,
          retireUnit: ruleNewsForm.retireUnit,
          integral: ruleNewsForm.integral,
          saleSid: ruleNewsForm.saleSid,
          sourceSid: ruleNewsForm.sourceSid,
          status: ruleNewsForm.status,
          labelSids: ruleNewsForm.labelSids,
          passportImgUrl: succList.value[0],
        }
        if (state.form.type == '0') {
          data.idCard = ruleNewsForm.idCard,
            data.passport = null
        } else {
          data.passport = ruleNewsForm.passport,
            data.idCard = null
        }
        postadd(data)
      } else {
        console.log('编辑')
        let data = {
          note: ruleNewsForm.note,
          name: ruleNewsForm.name,
          address: ruleNewsForm.address,
          memberId: ruleNewsForm.memberId,
          phone: ruleNewsForm.phone,
          integral: ruleNewsForm.integral,
          saleSid: ruleNewsForm.saleSid,
          anniversary: ruleNewsForm.anniversary,
          retireUnit: ruleNewsForm.retireUnit,
          sourceSid: ruleNewsForm.sourceSid,
          status: ruleNewsForm.status,
          labelSids: ruleNewsForm.labelSids,
          passportImgUrl: succList.value[0],
          sid: ruleNewsForm.sid,

        }
        if (state.form.type == '0') {
          data.idCard = ruleNewsForm.idCard,
            data.passport = null
        } else {
          data.passport = ruleNewsForm.passport,
            data.idCard = null
        }
        // console.log(ruleNewsForm.labelSids, 'ruleNewsForm.labelSids')

        postupdate(data)
      }
    }
  })
}



// 文件上传
const uploadRef = ref(null)
const { succList, imgLoading, imgVisible, dialogImageUrl, handlePreview, actionImgUrl, handleRemove, uploadImg, fileChange } = UploadImg()
const fileList = ref([])
const limit = ref(1)
// 上传-单张的上传
function uploadImgs() {
  console.log(fileList.value, 'fileList.value')
  imgLoading.value = true
  let data = new FormData()
  // data.append("file", fromImg.value)
  data.append("file", fileList.value[0].raw)
  proxy.$axios.post("/v1/sys-customs/importCustoms", data).then((res) => {
    fileList.value = []
    imgLoading.value = false
    if (res.data.code == 200) {
      proxy.$message({ message: '上传成功', type: "success" })
      pubParams(getList)
      fileList.value = []
    } else {
              if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
    }
  }).catch(err => {
    imgLoading.value = false
  })
}
const submitline = (data) => {
  proxy.$axios
    .post("/v1/sys-line-enroll", data)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '报名成功', type: "success" })
        lineVisible.value = false

        pubParams(getList)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

function postadd(params) {
  proxy.$axios
    .post("/v1/sys-customs", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '新增成功', type: "success" })
        // router.go(-1)
        history.back();

        // state.list.customSid = res.data.data.sid
        // let data = {
        //   lineGroupSid: lineGroupSid,
        //   paymentStatus: ruleNewsForm.paymentStatus,
        //   customSid: state.list.customSid,
        //   trafficMode: ruleNewsForm.trafficMode
        // }
        // submitline(data)
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
    .put("/v1/sys-customs", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        router.go(-1)
        // history.back();

        // router.push('/system/lineGroups')
        // pubParams(getList)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


// const info = ref()
function getinfo() {
  // console.log(num, 'id')
  proxy.$axios
    .get(`/v1/sys-customs/${sid}`)
    .then((res) => {
      if (res.data.code == 200) {

        const row = res.data.data;
        if (row.passportImgUrl) {
          let arr = {
            name: "",
            percentage: 0,
            raw: {},
            status: "ready",
          };
          succList.value[0] = row.passportImgUrl;
          fileList.value.push(arr);
          fileList.value[0].name = row.passportImgUrl;
          fileList.value[0].url = proxy.imgUrl + row.passportImgUrl;
        }

        if (row.passport ) {
          state.form.type = '1'
        } else {
          state.form.type = '0'
        }

        // console.log(res.data.data, 'res.data.data.records')
        ruleNewsForm.sid = row.sid
        ruleNewsForm.note = row.note,
          ruleNewsForm.name = row.name,
          ruleNewsForm.status = row.status,
          // ruleNewsForm.labelSids = row.labelSids.map(innerArray => innerArray.split(','));
          ruleNewsForm.labelSids = row.labelSids.map(item => item.sid)
        console.log(ruleNewsForm.labelSids, 'ruleNewsForm.labelSids');
        ruleNewsForm.sourceSid = row.sourceSid
        ruleNewsForm.saleSid = row.saleSid
        ruleNewsForm.idCard = row.idCard,
          ruleNewsForm.phone = row.phone,
          ruleNewsForm.anniversary = row.anniversary,
          ruleNewsForm.retireUnit = row.retireUnit,
          ruleNewsForm.integral = row.integral
        ruleNewsForm.passport = row.passport,
          ruleNewsForm.memberId = row.memberId,
          ruleNewsForm.address = row.address

      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


// 获取客户标签
// 配置级联选择参数
const props = ref({
  multiple: true,
  value: "sid",
  label: "labelName",
  // children: "children",
})

const class_options = ref([])
function getorg() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-label")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        // class_options.value = res.data.data
        class_options.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, 'res.data.data.records')
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// 获取客户来源
// 配置级联选择参数
const props1 = ref({
  // multiple: true,
  value: "sid",
  label: "sourceName",
  // children: "children",
})

const class_options1 = ref([])
function getorg1() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-source")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')

        class_options1.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, '.records')
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// 获取销售负责人
// 配置级联选择参数
const props2 = ref({
  // multiple: true,
  value: "sid",
  label: "nickName",
  // children: "children",
})

const class_options2 = ref([])
function getorg2() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/users/salesList")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        class_options2.value = res.data.data
        // console.log(res.data, 'res.data.data.records')
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}





</script>

<style lang="less" scoped>
.editor-box {
  border: 1px solid #ccc;
  border-radius: 2px;
}

:deep(.el-date-editor) {
  width: 320px !important;

  .el-input__wrapper {
    width: 320px;
  }
}

.prize-upload {
  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
    line-height: 120px;
    margin-bottom: 20px;
  }

  :deep(.el-upload-list__item) {
    width: 120px;
    height: 120px;
  }
}
</style>
