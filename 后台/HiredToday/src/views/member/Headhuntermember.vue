<template>
  <div class="white-box">
    <el-form ref="ruleNewsRef" :model="ruleNewsForm" label-width="250px" :rules="ruleNews">
      <el-form-item label="岗位发布额度（会员）" prop="jobPostingQuotaAfter">
        <el-input v-model.trim="ruleNewsForm.jobPostingQuotaAfter" oninput="value=value.replace(/[^\d]/g,'')"  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="岗位发布额度(非会员)" prop="jobPostingQuotaBefore">
        <el-input v-model.trim="ruleNewsForm.jobPostingQuotaBefore" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="岗位刷新次数（每天）（会员）" prop="jobRefreshQuotaPerDayAfter">
        <el-input v-model.trim="ruleNewsForm.jobRefreshQuotaPerDayAfter" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="岗位刷新次数（每天）(非会员)" prop="jobRefreshQuotaPerDayBefore">
        <el-input v-model.trim="ruleNewsForm.jobRefreshQuotaPerDayBefore" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="会员有效期（天数）" prop="membershipDuration">
        <el-input v-model.trim="ruleNewsForm.membershipDuration" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="开通会员所需费用" prop="membershipFee">
        <el-input v-model.trim="ruleNewsForm.membershipFee" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="简历刷新次数（每天）（会员）" prop="resumeRefreshQuotaPerDayAfter">
        <el-input v-model.trim="ruleNewsForm.resumeRefreshQuotaPerDayAfter" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="简历刷新次数（每天）(非会员)" prop="resumeRefreshQuotaPerDayBefore">
        <el-input v-model.trim="ruleNewsForm.resumeRefreshQuotaPerDayBefore" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="简历提交次数（每天）（会员）" prop="resumeSubmissionQuotaPerDayAfter">
        <el-input v-model.trim="ruleNewsForm.resumeSubmissionQuotaPerDayAfter" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="简历提交次数（每天）(非会员)" prop="resumeSubmissionQuotaPerDayBefore">
        <el-input v-model.trim="ruleNewsForm.resumeSubmissionQuotaPerDayBefore" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="简历查看额度（每天）（会员）" prop="resumeViewingQuotaPerDayAfter">
        <el-input v-model.trim="ruleNewsForm.resumeViewingQuotaPerDayAfter" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="简历查看额度（每天）(非会员)" prop="resumeViewingQuotaPerDayBefore">
        <el-input v-model.trim="ruleNewsForm.resumeViewingQuotaPerDayBefore" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="人才发布额度（会员）" prop="talentsPostingQuotaAfter">
        <el-input v-model.trim="ruleNewsForm.talentsPostingQuotaAfter" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="人才发布额度(非会员)" prop="talentsPostingQuotaBefore">
        <el-input v-model.trim="ruleNewsForm.talentsPostingQuotaBefore" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="会员介绍" prop="content">
        <el-input type="textarea"  maxlength="-1" v-model.trim="ruleNewsForm.content" clearable
                  placeholder="请输入" style="width: 60%;" :rows="4"/>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="是" inactive-text="否"
                   :active-value="0" :inactive-value="1" />
      </el-form-item> -->

      <el-form-item>
        <div style="margin-top: 30px">
          <el-button type="primary" size="large" :loading="form_loading"
                     @click="submitNewsForm(ruleNewsRef)">确认修改</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, shallowRef, onMounted, onBeforeUnmount, watch } from "vue"
import { useRouter } from "vue-router"
import { userStore } from "@store/user"
import OneLoad from "@mixins/one-load"
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import { UploadFilled } from "@element-plus/icons-vue"

const { proxy } = getCurrentInstance()
const ruleNewsRef = ref(null)
const ruleNews = reactive({
  jobPostingQuotaAfter: [{ required: true, message: "请输入数字", trigger: "blur" }],
  jobPostingQuotaBefore: [{ required: true, message: "请输入数字", trigger: "blur" }],
  jobRefreshQuotaPerDayAfter: [{ required: true, message: "请输入数字", trigger: "blur" }],
  jobRefreshQuotaPerDayBefore: [{ required: true, message: "请输入数字", trigger: "blur" }],
  membershipDuration: [{ required: true, message: "请输入数字", trigger: "blur" }],
  membershipFee: [{ required: true, message: "请输入数字", trigger: "blur" }],
  resumeRefreshQuotaPerDayAfter: [{ required: true, message: "请输入数字", trigger: "blur" }],
  resumeRefreshQuotaPerDayBefore: [{ required: true, message: "请输入数字", trigger: "blur" }],
  resumeSubmissionQuotaPerDayAfter: [{ required: true, message: "请输入数字", trigger: "blur" }],
  resumeSubmissionQuotaPerDayBefore: [{ required: true, message: "请输入数字", trigger: "blur" }],
  resumeViewingQuotaPerDayAfter: [{ required: true, message: "请输入数字", trigger: "blur" }],
  resumeViewingQuotaPerDayBefore: [{ required: true, message: "请输入数字", trigger: "blur" }],
  talentsPostingQuotaAfter: [{ required: true, message: "请输入数字", trigger: "blur" }],
  talentsPostingQuotaBefore: [{ required: true, message: "请输入数字", trigger: "blur" }],
})
const form_loading = ref(false)
const ruleNewsForm = reactive({
  "content": "",
  "jobPostingQuotaAfter": 0,
  "jobPostingQuotaBefore": 0,
  "jobRefreshQuotaPerDayAfter": 0,
  "jobRefreshQuotaPerDayBefore": 0,
  "membershipDuration": 0,
  "membershipFee": 0,
  "content": "",
  "resumeRefreshQuotaPerDayAfter": 0,
  "resumeRefreshQuotaPerDayBefore": 0,
  "resumeSubmissionQuotaPerDayAfter": 0,
  "resumeSubmissionQuotaPerDayBefore": 0,
  "resumeViewingQuotaPerDayAfter": 0,
  "resumeViewingQuotaPerDayBefore": 0,
  "status": 0,
  "talentsPostingQuotaAfter": 0,
  "talentsPostingQuotaBefore": 0
})



onMounted(() => {
  getcontent()
})

function validateInput(input) {
    // 替换掉所有非数字和小数点的字符
    let value = input.value.replace(/[^\d.]/g, '');

    // 检查是否有多个小数点，并保留第一个
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('').replace(/[.]/g, '');
    }

    // 限制小数点后最多两位
    if (parts[1]) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // 更新输入框的值
    input.value = value;
}

function getcontent() {
  proxy.$axios
      .get(`/v1/vip/headhunter`)
      .then((res) => {
        console.log(res.data,'res.data')
        if (res.data.code == 200) {
          if(res.data.data){
            for(let key in ruleNewsForm){
              ruleNewsForm.membershipFee = res.data.data.membershipFee/100;
              ruleNewsForm[key] = res.data.data[key];
            }
          }else{
            console.log('没有数据')
          }
        } else {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      })
      .catch((err) => { })
}

const submitNewsForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      form_loading.value = true
      // console.log(ruleNewsForm);
      ruleNewsForm.membershipFee=ruleNewsForm.membershipFee*100,
      proxy.$axios
          .post("/v1/vip/headhunter", ruleNewsForm)
          .then((res) => {
            form_loading.value = false
            if (res.data.code == 200) {
              proxy.$message({ message: "修改成功！", type: "success" })
              // router.push("/System/App")
              getcontent()
            } else {
              proxy.$message({ message: res.data.msg, type: "error" })
            }
          })
          .catch((err) => {
            form_loading.value = false
          })

    }
  })
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {

})

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

:deep(.el-tabs) {
  .el-tabs__header {
    box-sizing: content-box;
  }

  .el-tabs__item {
    background: #f7f8fa;
    border-bottom: 1px solid #e4e7ed;

    &.is-active {
      color: #303133;
      background: #fff;
    }
  }
}

.editor-box {
  border: 1px solid #ccc;
  border-radius: 2px;
  // width: 60%;
}

:deep(.el-date-editor) {
  width: 320px !important;

  .el-input__wrapper {
    width: 320px;
  }
}

:deep(.el-upload-list__item) {
  width: 200px;
}

:deep(.el-upload) {
  width: 200px;
}



.prize-upload {
  :deep(.el-upload--picture-card) {
    width: 180px;
    height: 120px;
    line-height: 120px;
    margin-bottom: 20px;
  }

  :deep(.el-upload-list__item) {
    width: 180px;
    height: 120px;
  }
}

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

</style>
