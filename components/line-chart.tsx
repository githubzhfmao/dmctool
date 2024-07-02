"use client"

import * as React from "react"
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highcharts3d from "highcharts/highcharts-3d";
import { title } from "process";
highcharts3d(Highcharts);

export default function SplineChartInfo() {

    const options = {
        credits: {
            enabled: false // 隐藏水印
        },
        chart: {
            type: 'line',
            backgroundColor: 'none',
        },
        title: {
            text: null,
            align: 'left'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            gridLineWidth: 0,// 取消背景的网格线
            lineColor: '#FFFFFF', // 设置X轴的颜色
            tickColor: '#FFFFFF', // 设置X轴刻度线的颜色
            labels: {
                style: {
                    color: '#FFFFFF' // 设置X轴标签的颜色
                }
            }
        },
        yAxis: {
            title: {
                text: null,
            },
            gridLineWidth: 0, // 取消背景的网格线
            lineColor: '#FFFFFF', // 设置Y轴的颜色
            tickColor: '#FFFFFF', // 设置Y轴刻度线的颜色
            labels: {
                style: {
                    color: '#FFFFFF' // 设置Y轴标签的颜色
                }
            },
            lineWidth: 1, // 显示Y轴的线
            // title: {
            //     text: 'P',
            //     align: 'high', // 设置标题对齐方式
            //     rotation: 0, // 将标题旋转为水平显示
            //     y: -10, // 调整标题的垂直位置
            //     offset: 20, // 调整标题的偏移量
            //     style: {
            //         color: '#FFFFFF' // 设置标题颜色
            //     }
            // }
        },
        series: [{
            name: null,
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            color: '#FCB24F' // 设置折线的颜色
        }],
        tooltip: {
            enabled: false // 取消tooltip
        },
        legend: {
            enabled: false
        }
    }

    return (
        <div className="w-[660px] h-[260px]" >
            <HighchartsReact  highcharts={Highcharts} options={options} />
        </div>
    )
}