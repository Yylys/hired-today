### 主色调

### 页面命名-胜亲后台管理系统

- Login                    登录
- Home                     首页
- /system/customs         客户管理-客户列表
- /system/label        客户管理-标签管理
- /system/source       客户管理-来源管理
- /system/integral        客户管理-积分管理
- /system/gifts            福利管理-礼品管理
- /system/giftsRecord          福利管理-礼品记录
- /system/activity           福利管理-活动管理
- /system/activityEnroll       福利管理-报名记录
- /system/line                计调中心-线路管理
- /system/lineGroups             计调中心-团期管理
- /system/lineEnroll           计调中心-报名记录
- /system/menu            系统管理-菜单管理
- /system/user            系统管理-用户管理
- /system/role          系统管理-角色管理
- /system/dept           系统管理-组织管理
- /system/complaint           系统管理-投诉反馈
- /system/resources          系统管理-资源管理
- /system/sending        系统管理-短信管理

- system/operationLog        系统管理-日志管理-操作日志
- system/loginLog       系统管理-日志管理-登录日志
- Page404                  404 页面
- Page403                  403 页面

### 域名

正式域名：http://shengqin.kmmyxb.cn   账号：15288580726  密码 123456

云存储:

### 接口

http://116.63.177.173:83/doc.html

【wangeditor富文本编辑器官方文档】
https://www.wangeditor.com/

### ftp

### 备注

```html
<!-- 只能输入数字和小数 oninput="value=value.replace(/[^\d.]/g,'')" -->
<el-input v-model.trim="ruleNewsForm.sort" oninput="value=value.replace(/[^\d.]/g,'')" clearable
                    placeholder="请输入排序" />

```

### 上传图片

```html
<el-upload ref="uploadRef" v-loading="imgLoading" class="prize-upload" :action="actionImgUrl()"
    :http-request="uploadImg" list-type="picture-card" :multiple="false" :on-remove="handleRemove"
    :before-upload="beforeAvatarUpload" :on-change="fileChange" :on-preview="handlePreview">
    <el-icon color="#999">
        <upload-filled />
    </el-icon>
</el-upload>
```

```

// mixins
const succList = ref([]) // 成功之后图片数组
const imgLoading = ref(false)
// 上传
function uploadImg() {
    imgLoading.value = true
    let data = new FormData()
    data.append("file", fileList.value[0])
    proxy.$axios.post("file/aliyunupload", data).then((res) => {
        fileList.value = []
        imgLoading.value = false
        if (res.data.code == 0) {
            succList.value.push(res.data.data)
        } else {
            proxy.$message({message:res.data.msg,type:"error"})
        }
    }).catch(err => {
        imgLoading.value = false
    })
}

// 移除图片
function handleRemove(file, fileArr) {
    fileList.value = []
    succList.value = []
}

return { succList, imgLoading }

// 页面
const uploadRef = ref(null)
const { succList, imgLoading, imgVisible, dialogImageUrl, handlePreview, actionImgUrl, uploadImg, handleRemove, beforeAvatarUpload, fileChange } = UploadImg()

const closeDialogImg = () => {
    succList.value = []
    img_name.value = ""
    uploadRef.value.clearFiles() // 清除已上传文件
    dialogImg.value = false
}
```
