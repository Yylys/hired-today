/**
 * 折线图
 * @param {Array} xData X轴数据
 * @param {Array} legendDatta 图例组件，可以通过点击图例控制哪些系列不显示
 * @param {Array} series y轴数据
 * @param {String} top 图表距离顶部距离，默认15%
 */
export default function (title,xData, legendDatta, series, top) {
    let option = {
        title: {
            text: title
          },
        color: ["#4482E6", "#FF7C4A"],
        tooltip: {
            trigger: "axis",
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData,
            axisTick: {
                show: false, // 不显示坐标轴刻度线
            },
        },
        grid: {
            top: top || "15%",
            left: "1%",
            right: "2%",
            bottom: "0px",
            containLabel: true,
        },
        legend: {
            // 显示图例组件
            data: legendDatta,
        },
        yAxis: {
            type: "value",
            splitLine: {
                lineStyle: {
                    type: "dashed",
                },
            },
        },
        series: series,
    }
    return option
}
