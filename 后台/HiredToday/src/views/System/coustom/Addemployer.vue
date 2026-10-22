<template>
  <div class="white-box">
    <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef"
      style="width:40%; margin-top: 20px;">
      <el-form-item label="岗位地址" prop="address">
        <!-- <el-input type="textarea"  maxlength="-1" :autosize="{ minRows: 4 }"
          v-model.trim="ruleNewsForm.address" clearable placeholder="请输入" /> -->
        <el-cascader filterable v-model="ruleNewsForm.areaCode" :props="props" :options="class_city" collapse-tags clearable
          placeholder="请选择管理权限" @change="handleChange" />
      </el-form-item>
      <el-form-item label="工作内容">
        <el-input v-model.trim="ruleNewsForm.content" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="工作部门" prop="department">
        <el-input v-model.trim="ruleNewsForm.department" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="学历标签" prop="dictDegreeSid">
        <el-select style="width: 340px;"  v-model="ruleNewsForm.dictDegreeSid" placeholder="学历标签" clearable>
          <el-option v-for="item in class_options" :key="item.sid" :label="item.memberName" :value="item.sid" />
        </el-select>
      </el-form-item>
      <el-form-item label="所需经验" prop="dictExperienceSid">
        <el-select style="width: 340px;" v-model="ruleNewsForm.dictExperienceSid" placeholder="所需经验" clearable>
          <el-option v-for="item in class_options1" :key="item.sid" :label="item.memberName" :value="item.sid" />
        </el-select>
      </el-form-item>
      <el-form-item label="工作类型" prop="dictWorkSid">
        <el-select style="width: 340px;" v-model="ruleNewsForm.dictWorkSid" placeholder="工作类型" clearable>
          <el-option v-for="item in class_options2" :key="item.sid" :label="item.memberName" :value="item.sid" />
        </el-select>
      </el-form-item>
      <el-form-item label="面试轮数" prop="interviewCount">
        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.trim="ruleNewsForm.interviewCount" clearable
          placeholder="请输入" />
      </el-form-item>
      <el-form-item label="岗位名称" prop="jobName">
        <el-input v-model.trim="ruleNewsForm.jobName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="最低薪资" prop="minSalary	">
        <el-input v-model.trim="ruleNewsForm.minSalary" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="最高薪资" prop="maxSalary">
        <el-input v-model.trim="ruleNewsForm.maxSalary" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注" prop="note	">
        <el-input type="textarea"  maxlength="-1" :autosize="{ minRows: 4 }"
          v-model.trim="ruleNewsForm.note" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="猎头端转介佣金" prop="recommendPrice">
        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.trim="ruleNewsForm.recommendPrice" clearable
          placeholder="请输入" />
      </el-form-item>
      <el-form-item label="是否有猎头服务" prop="recruiter" style="height: 600rpx;">
        <el-switch v-model="ruleNewsForm.recruiter" inline-prompt size="large" active-text="是" inactive-text="否"
          :active-value="0" :inactive-value="1" />
      </el-form-item>
      <el-form-item v-if="ruleNewsForm.recruiter == 0" label="猎头佣金" prop="recruiterPrice">
        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.trim="ruleNewsForm.recruiterPrice" clearable
          placeholder="请输入" />
      </el-form-item>

      <el-form-item label="招聘人数" prop="recruitsCount">
        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.trim="ruleNewsForm.recruitsCount" clearable
          placeholder="请输入" />


      </el-form-item>

      <el-form-item label="技能要求" prop="skill">
        <div style="min-height: 200px;width: 340px; border: 1px solid #999999; border-radius: 20px; padding-bottom: 70px;">
          <div style="display: flex; flex-wrap: wrap; align-items: center;">
            <el-tag style="display: flex; flex-wrap: wrap; align-items: center;margin:7px"
              v-for="(item, index) in ruleNewsForm.skill" type="primary">{{
                item }}
              <el-icon @click="deltag(index)">
                <Close />
              </el-icon>
            </el-tag>
          </div>
          <div style="display: flex; justify-content: center; position: absolute; bottom: 10px; width: 330px;">
            <el-input style="width: 70%; margin-right: 5px;" v-model.trim="tag" clearable placeholder="请输入" />
            <el-button type="primary" size="large" @click="confirm(tag)">提交</el-button>
          </div>
        </div>
      </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="正常" inactive-text="停用"
          :active-value="0" :inactive-value="1" />
      </el-form-item>

      <el-form-item label="是否急招" prop="status">
        <el-switch v-model="ruleNewsForm.urgent" inline-prompt size="large" active-text="是" inactive-text="否"
          :active-value="0" :inactive-value="1" />
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
import GoBack from "@components/GoBack.vue"
import { userStore } from "@store/user"

const route = useRoute()
const { proxy } = getCurrentInstance()
const ruleNewsRef = ref(null)


const tag = ref('')

onMounted(() => {
  store.setInclude("Home")
  getcity()
  getorg()
  getorg1()
  getorg2()
  ruleNewsForm.objectSid = route.query.sid
})

const state = reactive({
  areaList: []
})

const ruleNewsForm = reactive({
  address: "",
  content: "",
  department: "",
  dictDegreeSid: "",
  dictExperienceSid: "",
  dictWorkSid: "",
  interviewCount: 0,
  jobName: "",
  maxSalary: 0,
  minSalary: 0,
  note: "",
  objectSid: "",
  recommendPrice: 0,
  recruiter: 0,
  recruiterPrice: 0,
  recruitsCount: 0,
  skill: [],
  status: 0,
  urgent: 0,
  areaCode: 0,
})


const ruleNews = reactive({
  jobName: [{ required: true, message: "请输入岗位姓名", trigger: "blur" }],
  minSalary: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  // interviewCount: [{ required: true, message: "请输入积分余额", trigger: "blur" }],
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

const confirm = (val) => {
  if (val.trim() !== '') {
    ruleNewsForm.skill.push(val)
    tag.value = ''
  }

}

const deltag = (index) => {
  ruleNewsForm.skill.splice(index, 1);
}


const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      postadd(ruleNewsForm)
    }
  })
}


function postadd(params) {
  proxy.$axios
    .post("/v1/job/by-system", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '新增成功', type: "success" })
        // router.go(-1)
        history.back();
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const class_options = ref([])
const class_city = ref([])

// 配置级联选择参数
const props = ref({
  emitPath: false,
  lazy: true,
  value: "code",
  label: "name",
  checkStrictly: true,
  lazyLoad(node, resolve) {
    // console.log(node, 33333333)
    // console.log(resolve, 44444444)
    const { value } = node;
    // getAreaList(value).then(() => {
    //     resolve(state.areaList);
    // });
    proxy.$axios
    .get(`/v1/city/${value}`)
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        res.data.data.forEach((item) => {
            if (item.level === "province") {
                item.disabled = true;
            }
            if (item.level === "city") {
                item.leaf = true;
            }
        });
        resolve(res.data.data)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
  },
})
const handleChange = (e) => {
  console.log(e, 'e')
}

function getcity() {
  // console.log(num, 'id')
  proxy.$axios
    .get(`/v1/city/${ruleNewsForm.areaCode}`)
    .then((res) => {
      if (res.data.code == 200) {
        console.log(res.data, 'role')
        class_city.value = res.data.data
        // class_options.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// const getAreaList = async (parentCode =0) => {
//   console.log(parentCode)
//   proxy.$axios
//     .get(`/v1/city/${parentCode}`)
//     .then((res) => {
//       if (res.data.code == 200) {
//         console.log(res.data, 'role')
//         state.areaList=res.data.data
//       } else {
//         if (res.data.code != 403) {
//           proxy.$message({ message: res.data.msg, type: "error" })
//         }
//       }
//     })
//     .catch((err) => { })
// };


function getorg() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/dicts/by-key/degree")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        class_options.value = res.data.data
        // class_options.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


const class_options1 = ref([])
function getorg1() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/dicts/by-key/Experience")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')

        class_options1.value = res.data.data
        // console.log(res.data, '.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const class_options2 = ref([])
function getorg2() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/dicts/by-key/workType")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        class_options2.value = res.data.data
        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
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
