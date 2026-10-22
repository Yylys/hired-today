/**
 * 柱状图
 * @param {Array} xData X轴数据
 * @param {Array} series y轴数据
 * @param {String} formatter 提示框格式化文本
 */
export default function (xData, series, formatter = "") {
    let option = {
        color: ["#4482E6", "#FF7C4A"],
        tooltip: {
            trigger: "axis",
            formatter: formatter,
            axisPointer: {
                type: "shadow",
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: ["20%", "20%"],
            axisTick: {
                show: false, // 不显示坐标轴刻度线
            },
            data: xData,
        },
        yAxis: {
            type: "value",
            splitLine: {
                lineStyle: {
                    type: "dashed",
                },
            },
        },
        grid: {
            top: "6%",
            left: "1%",
            right: "1%",
            bottom: "0px",
            containLabel: true,
        },
        series: series,
    }
    return option
}
