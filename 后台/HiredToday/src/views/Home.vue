<template>

    <img src="/src//assets//logo.png" alt="">
    <!-- <div class="home-box">
        <div class="white-box">
            <div class="data-prev flexs">
                <div class="data-prev__item">
                    <div class="data-prev__tip">累计参团客户数量</div>
                    <p class="data-prev__nums">{{ objs.attendGroupTotal || "0" }}</p>
                </div>
                <div class="data-prev__item">
                    <div class="data-prev__tip">当日新增客户数量</div>
                    <p class="data-prev__nums">{{ objs.todayAddNum || "0" }}</p>
                </div>
                <div class="data-prev__item">
                    <div class="data-prev__tip">当日新增参团客户数量</div>
                    <p class="data-prev__nums">{{ objs.todayAttendGroupNum || "0" }}</p>
                </div>
                <div class="data-prev__item">
                    <div class="data-prev__tip">累计客户数量</div>
                    <p class="data-prev__nums">{{ objs.total || "0" }}</p>
                </div>
            </div>
        </div>

        <div class="white-box">
            <div class="echars-one__cont">
                <div id="echart-money" class="echart-view"></div>
            </div>
        </div>
    </div> -->
    <!-- <el-image style="width: 150px;  ;margin-bottom: 10px;" :src="logo" :fit="cover" /> -->
</template>

<script setup>
import { getCurrentInstance, reactive, ref, onActivated, onMounted } from "vue"
import EchartsLine from "@common/echarts-line"
import {  onBeforeRouteLeave } from "vue-router"
import { userStore } from "@store/user"

const store = userStore()


const { proxy } = getCurrentInstance()
// echarts


let echart_money = null


onMounted(() => {
    store.setInclude("Home")
    // getDataInfo()
    // getData()
    window.onresize = echartResize
})

// onBeforeRouteLeave((to, from, next) => {
//   // console.log(from.name,'from.name')
//   if (from.name === "Home") {
//     store.setInclude("Home")
//   }
//   next()
// })


// 概况
const objs = ref({})


// 用于存储 dateStr 的数组
var dateArray = [];

// 用于存储 addCustom 的数组
var addCustomArray = [];

function getDataInfo() {
    // console.log(num, 'id')
    proxy.$axios
        .get("/v1/sys-customs/count")
        .then((res) => {
            if (res.data.code == 200) {
                objs.value = res.data.data
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => { })
}


function echartResize() {
    // echart_nums.resize()
    echart_money.resize()
}
const data = ref(null)

function getData() {
    // console.log(num, 'id')
    proxy.$axios
        .get("/v1/sys-customs/countEvery")
        .then((res) => {
            if (res.data.code == 200) {
                data.value = res.data.data
                // 遍历 JSON 数据
                // console.log(data.value, 'data.value')
                data.value.forEach(function (item) {
                    // 将 dateStr 添加到 dateArray 中
                    dateArray.value = data.value.map(obj => obj.dateStr);
                    // 将 addCustom 添加到 addCustomArray 中
                    addCustomArray.value = data.value.map(obj => obj.addCustom);

                });
                priceEchart(dateArray.value, addCustomArray.value)
                // // 输出结果
                // console.log("日期数组：", dateArray.value);
                // console.log("addCustom 数组：", addCustomArray.value);
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => { })
}

function priceEchart(xData, datas) {
    echart_money = proxy.$echarts.init(document.getElementById("echart-money"))
    // 设置配置项

    let series = [
        {
            data: datas,
            type: "line",
            name: "当日新增客户",
            smooth: true,
            showSymbol: false,
            areaStyle: {
                opacity: 1,
                color: new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: "rgba(64, 158, 255,0.8)",
                    },
                    {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0.3)",
                    },
                ]),
            },
        },
    ]
    let option = EchartsLine('近30天每日新增客户数据',xData, [], series, "15%")
    echart_money.setOption(option)
}


</script>

<script>

</script>

<style lang="less" scoped>
.echart-view {
    width: 100%;
    height: 540px;
}

.p-popover {
    font-size: @font-size-md;
    color: #595961;
    margin: @margin-xs 0px;
}

.data-prev {
    .data-prev__item {
        width: 25%;
        padding: @padding-mdl;
        overflow: hidden;
        border-radius: 10px;

        .data-prev__tip {
            margin-bottom: @margin-md;
            color: @gray-6;
        }

        .data-prev__nums {
            font-size: 26px;
            color: #111;
        }

        &:hover {
            background-color: #f4f8ff;
        }

        .data-prev__ratio {
            margin-top: @margin-base;
            color: @gray-6;

            .ratio-nums {
                color: @red;
                margin-left: -6px;
            }
        }
    }
}
</style>
