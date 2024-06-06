"use client"

import * as React from "react"
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highcharts3d from "highcharts/highcharts-3d";
import { title } from "process";
highcharts3d(Highcharts);

export default function PieChartInfo() {

    const options = {
        credits: {
            enabled: false // 隐藏水印
        },
        title: undefined,
        chart: {
            type: 'pie',
            backgroundColor: 'none',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: -25, // 设置绕水平轴的旋转角度
            }
        },
        plotOptions: {
            pie: {
                size: 380,
                innerSize: 120,
                depth: 70,
                slicedOffset: 3
            }
        },
        series: [{
            colors: ['#fcb24f', '#fc8f00', '#c46b00', '#714000'],
            data: [
                {
                    name: '60%',
                    y: 60,
                    sliced: true
                },
                {
                    name: '20%',
                    y: 20,
                    sliced: true
                },
                {
                    name: '15%',
                    y: 15,
                    sliced: true
                },
                {
                    name: '5%',
                    y: 5,
                    sliced: true
                },
            ]
        }]
    }

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}