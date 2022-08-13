<template>
    <chart :options="chartOptionsBar"></chart>   
</template>

<script lang="ts">
import ECharts from 'vue-echarts';

import * as echarts from 'echarts/lib/echarts';
import cascadeodark from '../../../styles/cascadeo-dark.json';

echarts.registerTheme('dark', cascadeodark);


export default {
    components: {
        chart: ECharts,
    },
    name: 'GovernanceChart',
    props: {
        dates : Array,
        violations: Array,
        orgName: String,
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
                    text: 'Violation Trend in ' + props.orgName + ' Organization',
                    subtext: 'Violations found in organization in the last 30 days',
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
                series: [
                    {
                    type: 'bar',
                    data: props.violations,
                    },
                ],
            },
        };
    },
};
</script>

<style lang="scss" scoped>
.echarts {
    width: 100%;
    height: 100%;
}
</style>