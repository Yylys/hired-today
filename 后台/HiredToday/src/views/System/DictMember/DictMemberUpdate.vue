<template>
    <div class="white-box-form">
        <el-form
            ref="ruleRef"
            :model="state.ruleForm"
            :rules="state.rules"
            label-width="120px"
            class="mt-20"
        >
            <el-form-item label="字典成员名称" prop="memberName">
                <el-input
                    v-model.trim="state.ruleForm.memberName"
                    clearable
                    placeholder="请输入字典成员名称"
                />
            </el-form-item>
            <el-form-item label="字典成员Key" prop="memberKey">
                <el-input
                    v-model.trim="state.ruleForm.memberKey"
                    clearable
                    placeholder="请输入字典成员Key"
                />
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input
                    v-model.trim="state.ruleForm.note"
                    type="textarea"
                    maxlength="-1"
                    :autosize="{ minRows: 2 }"
                    clearable
                    
                    placeholder="请输入备注"
                />
            </el-form-item>
            <el-form-item label="是否可删除" prop="deletable">
                <el-radio-group v-model="state.ruleForm.deletable">
                    <el-radio
                        v-for="item in state.deletableList"
                        :key="item.memberKey"
                        :value="item.memberKey"
                        :disabled="state.disabledDeletable"
                        >{{ item.memberName }}</el-radio
                    >
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="state.ruleForm.status">
                    <el-radio
                        v-for="item in state.statusList"
                        :key="item.memberKey"
                        :value="item.memberKey"
                        >{{ item.memberName }}</el-radio
                    >
                </el-radio-group>
            </el-form-item>
            <el-form-item label="显示顺序" prop="viewSort">
                <el-input-number
                    v-model="state.ruleForm.viewSort"
                    :min="0"
                    :precision="0"
                    step-strictly
                />
            </el-form-item>
        </el-form>

        <div class="foot-btn">
            <el-button
                type="primary"
                :loading="state.form_loading"
                @click="submitForm(ruleRef)"
            >
                {{ isEdit ? "修改" : "添加" }}
            </el-button>
        </div>
        <go-back />
    </div>
</template>

<script setup>
import { inject, ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import GoBack from "@components/GoBack.vue";
import {
    getDictMemberDetail,
    addDictMember,
    editDictMember,
} from "@/apis/system/dict";

import { useDictStore } from "@stores/dict.js";

const dictStore = useDictStore();
dictStore.getDictMembers("data_status").then((res) => (state.statusList = res));
dictStore
    .getDictMembers("deletable")
    .then((res) => (state.deletableList = res));

const $message = inject("$message");
const router = useRouter();
const route = useRoute();

const sid = route.query.sid;
const isEdit = ref(false);
const form_loading = ref(false);
const ruleRef = ref(null);
const state = reactive({
    statusList: [],
    deletableList: [],
    ruleForm: {
        status: 0,
        deletable: 0,
        memberName: null,
        memberKey: null,
        dictKey: null,
        note: null,
        viewSort: 0,
    },
    rules: {
        memberName: [
            { required: true, message: "请输入字典成员名称", trigger: "blur" },
        ],
        memberKey: [
            { required: true, message: "请输入字典成员key", trigger: "blur" },
        ],
    },
    dictKeyOptions: [],
    disabledDeletable: false,
});

onMounted(() => {
    state.ruleForm.dictKey = route.params.key;
    if (/Edit$/.test(route.name)) {
        isEdit.value = true;
        getDetail();
    }
});

const getDetail = async () => {
    const res = await getDictMemberDetail({ sid });
    if (res.data.code == 200) {
        state.ruleForm = res.data.data;
        state.disabledDeletable = state.ruleForm.deletable === 1;
    } else {
        $message({ message: res.data.msg, type: "error" });
    }
};

// 提交表单
const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid, fields) => {
        if (valid) {
            form_loading.value = true;
            let res = null;
            if (isEdit.value) {
                res = await editDictMember(state.ruleForm);
            } else {
                res = await addDictMember(state.ruleForm);
            }
            form_loading.value = false;
            if (res.data.code == 200) {
                $message({
                    message: isEdit.value ? "修改成功" : "添加成功",
                    type: "success",
                });
                router.back();
            } else {
                $message({ message: res.data.msg, type: "error" });
            }
        }
    });
};
</script>
