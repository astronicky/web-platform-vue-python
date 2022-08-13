<template>
    <chart :options="chartOptionsBar"></chart>   
</template>

<script lang="ts">
import ECharts from 'vue-echarts';
import 'echarts/lib/component/legend';
import * as echarts from 'echarts/lib/echarts';

export default {
    components: {
        chart: ECharts,
    },
    name: 'InsightsChart',
    props: {
        orgName: String,
        integrationID: String,
        dates : Array,
        valuesCritArray: Array,
        valuesWarnArray: Array,
    },
    data: (props) => {
        let chartTheme = '';

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            chartTheme = 'dark';
        }

        return {
            chartThemeVal: chartTheme,
            chartOptionsBar: {
                title: {
                    text: 'Alerts Trend',
                    subtext: 'Alerts in Integration ' + props.integrationID ,
                    left: 'center',
                },
                xAxis: {
                    data: props.dates,
                },
                yAxis: {
                    type: 'value',
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    layout: 'vertical',
                    x: 'center',
                    y: 'bottom',
                    data: ['Critical', 'Warning'],
                },
                series: [
                    {
                        name: 'Critical',
                        type: 'bar',
                        data: props.valuesCritArray,
                    },
                    {
                        name: 'Warning',
                        type: 'bar',
                        data: props.valuesWarnArray,
                    },
                ],
            },
        };
    },
};
</script>

<style lang="scss" scoped>
.echarts {
    width: 400px;
    height: 400px;
}
</style>