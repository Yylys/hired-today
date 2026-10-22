<template>
  <div class="white-box">
    <el-form ref="ruleNewsRef" :model="ruleNewsForm" label-width="120px">
          <el-form-item label="协议" prop="category_id">
            <el-select v-model="type" class="m-2" placeholder="请选择所属协议" size="large" style="width: 240px" clearable
              @change="setcontent(type)">
              <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" clearable />
            </el-select>
          </el-form-item>
          <el-form-item label="协议内容" prop="title" >
            <div class="editor-box">
              <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                mode="default" />
              <Editor style="height: 440px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig"
                mode="default" @onCreated="handleCreated" />
            </div>
          </el-form-item>
          <!-- <div id="main" style="width: 600px;height:400px;">111</div> -->
          <el-form-item>
            <div class="foot-btn flexs-center" style="margin-top: 30px">
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
const form_loading = ref(false)
const type=ref(null)


onMounted(() => {
})

const role = ref([
  { id: 1, name: '用户协议' },
  { id: 2, name: '隐私协议' },
  { id: 15, name: '关于我们' },
  { id: 16, name: '求职须知' }
])


const setcontent = (val) => {
  type.value=val
  getcontent(val)
}
function getcontent(val) {
  proxy.$axios
    .get(`/v1/agreement/${val}/info`)
    .then((res) => {
      console.log(res.data,'res.data')
      if (res.data.code == 200) {
        if(res.data.data){
          valueHtml.value = res.data.data.content // 往图片追加根
        }else{
          console.log('没有数据')
          valueHtml.value=' '
        }
      } else {
        proxy.$message({ message: res.data.msg, type: "error" })
      }
    })
    .catch((err) => { })
}

const submitNewsForm = (formEl) => {
  console.log(valueHtml.value,';valueHtml.value')
  if (!type.value) {
        proxy.$message({ message: "请选择类型", type: "error" })
        return
      }
  let htmls = ""
  if (valueHtml.value) {
    htmls = valueHtml.value
  }else{
    proxy.$message({ message: "请输入内容", type: "error" })
    return
  }
  form_loading.value = true
  proxy.$axios
    .post("/v1/agreement/create", {
      // id: id,
      agreementType:type.value,
      content: htmls,
    })
    .then((res) => {
      form_loading.value = false
      if (res.data.code == 200) {
        proxy.$message({ message: "修改成功！", type: "success" })
        // router.push("/System/App")
      } else {
        proxy.$message({ message: res.data.msg, type: "error" })
      }
    })
    .catch((err) => {
      form_loading.value = false
    })
}





// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})


onMounted(() => {
  // getList();
})


/**
 * 富文本编辑器
 * @param {Object} editorConfig 编辑器配置
 * @param {String} valueHtml 输入内容
 * @param {Object} toolbarConfig 工具栏配置
 * @param {Function} createEditor 创建编辑器
 * @param {Function} createToolbar 创建工具栏
 * @param {Function} handleChange 编辑器内容变化
 */
 const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const valueHtml = ref('') // 内容 HTML
const toolbarConfig = {
  excludeKeys: [
    // 排除不需要的菜单
    "insertLink",
    "insertImage",
    "editImage",
    "viewImageLink",
    "insertVideo",
    "uploadVideo",
    "editVideoSize",
    "emotion",
  ],
}



const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} }
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
editorConfig.MENU_CONF["uploadImage"] = {
  // 自定义上传
  async customUpload(file, insertFn) {
    let data = new FormData()
    // data.append("from", "album")
    console.log(file, 'data')
    data.append("file", file)
    proxy.$axios
      .post("/v1/resources/public", data)
      .then((res) => {
        if (res.data.code == 200) {
          let url = proxy.imgUrl + res.data.data.url
          insertFn(url) // 最后插入图片 insertFn(url, alt, href)，alt：描述，href:链接，后面非必填
        } else {
          if (res.data.code != 403) {
            proxy.$message({ message: res.data.msg, type: "error" })
          }
        }
      })
      .catch((err) => { })
  },
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
