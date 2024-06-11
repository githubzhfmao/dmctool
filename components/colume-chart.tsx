"use client"

import * as React from "react"
import HighchartsReact from 'highcharts-react-official'
import Highcharts, { color } from 'highcharts'
import highcharts3d from "highcharts/highcharts-3d";
import cylinder from "highcharts/modules/cylinder";
import { title } from "process";
import Column from "antd/es/table/Column";
highcharts3d(Highcharts);
cylinder(Highcharts);

export default function CChartInfo() {

    const options = {
        credits: {
            enabled: false // 隐藏水印
        },
        chart: {
            type: 'cylinder',
            backgroundColor: 'none',
            options3d: {
                enabled: true,
                alpha: 30,
                // depth: 50,
                viewDistance: 25
            }
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            categories: [
                'Gate Pool', 'LBank Pool', 'BitMart'
            ],
            gridLineWidth: 0, // 设置x轴网格线的宽度
            labels: {
                style: {
                    color: 'white', // 设置行数据标题颜色为红色
                    fontSize: '14px', // 设置行数据标题字体大小
                    fontWeight: 'bold' // 设置行数据标题字体加粗
                },
                useHTML: true
            },
        },
        yAxis: {
            title: null,
            visible: false, // 设置y轴不可见
            gridLineWidth: 0 // 设置x轴网格线的宽度
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                depth: 100,
                colorByPoint: true
            },
            dataLabels: {
                useHTML: true,
                // formatter: function () {
                //     const index = this.point.index; // 获取当前行数据标题的索引
                //     if (index === 0) {
                //         return '<span style="color: red;">' + this.x + '</span>'; // 第一个行数据标题设置为红色
                //     } else if (index === 1) {
                //         return '<span style="color: blue;">' + this.x + '</span>'; // 第二个行数据标题设置为蓝色
                //     } else {
                //         return this.x; // 其他行数据标题保持默认颜色
                //     }
                // }
            }
        },
        series: [{
            data: [
                95321, 169339, 121105
            ],
            additionalTitle: 'Additional Title 1', // 设置附加标题
            colors: ['#f5ad4d'],
            name: 'Cases',
            showInLegend: false
        }],
    }


    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}