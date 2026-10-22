/**
 * 饼状图
 * @param {Array} series 数据
 * @param {String} formatter 提示框格式化文本
 * @param {Object} legend 图例组件
 */
export default function (series, formatter = "", legend = {}) {
    let option = {
        tooltip: {
            trigger: "item",
            formatter: formatter,
        },
        color: ["#4482E6", "#FF7C4A"],
        legend: legend,
        series: series,
    }
    return option
}
