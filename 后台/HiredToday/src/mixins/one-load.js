import { reactive, ref, toRefs, getCurrentInstance } from "vue"

export default function () {
    let dataParams = reactive({
        arr_data: [],
        loading: true,
        search_btn: false,
        resultObj: null,
    })
    const { proxy } = getCurrentInstance()

    const totalNums = ref(0)
    const num = ref(0)
    const current = ref(1)
    const size = ref(20) // 每页显示几条
    const sizeNum = ref([20, 30, 50]) //调整每页显示条数
    const search_text = ref("")

    // 正常分页
    function pubParams(getList) {
        dataParams.loading = true
        dataParams.arr_data = []
        getList()
    }

    // 刷新使用
    function pubRefreshParams(getList) {
        totalNums.value = 0
        current.value = 1
        dataParams.loading = true
        dataParams.arr_data = []
        getList()
    }

    // 列表
    function getdata(url, datas) {
        return new Promise((resolve) => {
            proxy.$axios
                .get(url, { params: datas })
                .then((res) => {
                    dataParams.loading = false
                    dataParams.search_btn = false
                    good_succ(url, res)
                    resolve()
                })
                .catch((error) => {
                    dataParams.loading = false
                })
        })

    }

    function good_succ(url, res) {
        const parts = url.split('/');
        const result = parts.slice(0, 4).join('/');
        if (url == '/v1/menus/treeSelect' || url == '/v1/sys-orgs/treeSelect' || result=='/v1/dicts/by-key') {
            switch (res.data.code) {
                case 200:
                    let result = res.data.data
                    dataParams.resultObj = res.data
                    // console.log(res.data.data.total,'res.data.data.total')
                    totalNums.value = Number(res.data.data.total)
                    dataParams.arr_data = res.data.data.current > 1 ? dataParams.arr_data.concat(result) : result
                    // console.log(dataParams.arr_data,'dataParams.arr_data')
                    break
                default:
                    proxy.$message({ message: res.data.msg, type: "error" })
                    break
            }
        } else {
            // console.log(res.data.data, 66666)
            switch (res.data.code) {
                case 200:
                    let result = res.data.data.records
                    dataParams.resultObj = res.data.data
                    // console.log((size.value * 100) <= totalNums.value)
                    // console.log(size.value * 100, totalNums.value)
                    if ((size.value * 100) <= res.data.data.total) {
                        totalNums.value= size.value * 100
                        // num.value=size.value * 100
                        // totalNums.value = Number(res.data.data.total)
                    } else {
                        // num.value = Number(res.data.data.total)
                        totalNums.value = Number(res.data.data.total)
                    }
                    num.value = Number(res.data.data.total)
                    // totalNums.value = Number(res.data.data.total)
                    // console.log(res.data.data.total,'res.data.data.total')
                    dataParams.arr_data = res.data.data.current > 1 ? dataParams.arr_data.concat(result) : result
                    // console.log(totalNums.value,'totalNums.value')
                    // console.log(size.value,'res.data.data.current > 1')
                    // console.log(dataParams.arr_data.concat(result),'dataParams.arr_data.concat(result)')
                    // console.log(result,'result')
                    break
                default:
                    if (res.data.code != 403) {
                        proxy.$message({ message: res.data.msg, type: "error" })
                    }
                    break
            }
        }



        // switch (res.data.code) {
        //     case 200:
        //         console.log(url,'666666')
        //         // console.log(res.data)
        //         let result = res.data.data
        //         dataParams.resultObj = res.data
        //         totalNums.value = Number(res.data.data.total)
        //         dataParams.arr_data = res.data.data.current > 1 ? dataParams.arr_data.concat(result) : result
        //         // console.log(totalNums.value,'totalNums.value')
        //         // console.log(dataParams.arr_data,'dataParams.arr_data')
        //         break
        //     default:
        //         proxy.$message({ message: res.data.msg, type: "error" })
        //         break
        // }
    }

    return { ...toRefs(dataParams), current, size, sizeNum, num, totalNums, search_text, pubParams, pubRefreshParams, getdata }
}
