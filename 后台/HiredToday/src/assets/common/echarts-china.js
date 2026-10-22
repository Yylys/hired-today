/**
 * 中国地图
 * @param {String} text 标题
 * @param {Array} series 数据
 * @param {Number} max 左侧小导航最大值
 */
export default function (text, series, max = 100) {
    let option = {
        title: {
            text: text,
            x: "center",
            textStyle: {
                color: "#333",
                fontSize: 20,
            },
        },
        tooltip: {
            borderWidth: 0,
        },
        // 左侧小导航图标
        visualMap: {
            show: true,
            min: 0,
            max: Number(max),
            x: "left",
            y: "center",
            precision: 2, // 数据展示的小数精度，默认为0，无小数点
            text: ["高", "低"], // 分段型时建议隐藏
            // splitList: [  // 分段式阶段显示，呈方块显示
            //   {start: 500, end:600},{start: 400, end: 500},
            //   {start: 300, end: 400},{start: 200, end: 300},
            //   {start: 100, end: 200},{start: 0, end: 100},
            // ],
            // color: ['#5475f5', '#9feaa5', '#85daef','#74e2ca', '#e6ac53', '#9fb5ea'] // 分段式自定义各阶段颜色
            type: "continuous", // piecewise-定义为分段型，continuous-连续型
            calculable: true, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
            realtime: false, // 拖拽时，是否实时更新。
            inRange: { // 定义 在选中范围中 的视觉元素。
                color: ["lightskyblue", "#4B93FA"], // 图元的颜色
                symbolSize: [30, 100], // 图元的大小
            },
        },
        series: series,
    }
    return option
}
