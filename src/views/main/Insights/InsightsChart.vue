<template>
    <chart :options="chartOptionsBar" autoresize></chart>   
</template>

<script lang="ts">
import ECharts from 'vue-echarts';
import 'echarts/lib/component/legend';
import * as echarts from 'echarts/lib/echarts';
import cascadeodark from '../../../styles/cascadeo-dark.json';

echarts.registerTheme('dark', cascadeodark);


export default {
    components: {
        chart: ECharts,
    },
    name: 'InsightsChart',
    props: {
        orgName: String,
        integrationID: String,
        integrationName: String,
        dates : Array,
        valuesCritArray: Array,
        valuesWarnArray: Array,
        showTitle: Boolean,
    },
    data: (props) => {
        let chartTheme = '';

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            chartTheme = 'dark';
        }

        let title: any;
        if ( props.showTitle ) {
            title = {
                    text: 'Alerts Trend',
                    subtext: `Alerts in Integration ${props.integrationID} - ${props.integrationName}`,
                    left: 'center',
                };
        }

        return {
            chartThemeVal: chartTheme,
            chartOptionsBar: {
                title,
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
    min-width: 200px;
    min-height: 200px;
    margin: auto;
}
</style>