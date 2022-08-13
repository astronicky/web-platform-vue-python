<template>
  <div>
    <div class="chart-wrapper-big">
      <chart :options="chartOrgEstimate" autoresize :theme="chartThemeVal"></chart>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
// import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/geo';
import 'echarts/lib/component/parallel';
import 'echarts/lib/component/singleAxis';
import 'echarts/lib/component/brush';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/visualMap';

import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/markArea';

import 'echarts/lib/component/timeline';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import * as echarts from 'echarts/lib/echarts';
import cascadeodark from '../../styles/cascadeo-dark.json';

echarts.registerTheme('dark', cascadeodark);

export default {

  components: {
    chart: ECharts,
  },

  name: 'OrgEstimateDashboard',
  props: {
    cdata: {
      type: Array[Object],
    },
    dashtype: {
      type: String,
    },
    title: {
      type: String,
    },
    subtext: {
      type: String,
    },
  },
  data() {
    let chartTheme = '';
    let currVal = 'PHP';

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      chartTheme = 'dark';
    }

    // generates the 'series' field in eChart options
    const genSeries = (reportType, apidata, budgetType) => {

      const c = apidata.find((cd) => cd.id === reportType);
      const seriesR = new Array();
      const dataR = new Array();
      let noData = true;

      if (c.data.length === 0) {
        return [seriesR, noData];
      }

      for (const [key, value] of Object.entries(c.data[0])) {
        if (value.every((item) => item === 0)) {
          continue;
        }

        if (key === 'currency') {
          currVal = value[0];
          continue;
        }

        // will match the budgetType (e.g. annual or monthly)
        // generate the 'data' field inside the 'series'
        if (key === budgetType) {

          // iterate values
          // input: "annual": [ 600000,180000]
          // Output: [ {value: 600000, Name: 'childorg1'},...]
          for (const idx of Object.keys(value)) {
            const dEntry = {
              value: value[idx],
              name: c.data[0].xaxis[idx],
            };

            dataR.push(dEntry);
          }
        }
      }

      const currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currVal,
      });

      // final 'series' value map
      // [{"name":"Org Estimate Budget","type":"pie","id":"pie","radius":"40%","emphasis":{"focus":"data"},
      // "data":[{"value":50000,"name":"petertest1_child2"},{"value":15000,"name":"petertest1_child1"}],
      // "label":{"formatter":{"_custom":{"type":"function","display":"<span>f</span> formatter(param)","_reviveId":3}},
      // "alignTo":"edge","overflow":"break","edgeDistance":"10%"},"labelLine":{"show":true},"avoidLabelOverlap":true}]
      const r = {
        name: 'Org Estimate Budget',
        type: 'pie',
        id: 'pie',
        radius: '40%',
        emphasis: {
          focus: 'data',
        },
        data: dataR,
        label: {
          formatter: (params) => {
            return `${params.name} : ${currencyFormat.format(params.data.value)}`;
          },
          alignTo: 'edge',
          overflow: 'break',
          edgeDistance: '10%',
        },
        labelLine: {
          show: true,
        },
        avoidLabelOverlap: true,
      };

      seriesR.push(r);
      noData = false;
      console.log(seriesR);

      return [seriesR];
    };

    const [seriesRS, orgNoData] = genSeries('OrgEstimateBudget', this.$props.cdata, this.$props.dashtype);

    // console.log(seriesRS);

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currVal,
    });

    // TODO: fix tooltip; not currently showing
    return {
      chartThemeVal: chartTheme,
      currency: currVal,
      chartOrgEstimate: {
        title: {
          text: this.$props.title,
          subtext: this.$props.subtext,
          left: 'center',
        },
        legend: {
          type: 'scroll',
          padding: [
            50,
            50,
            0,
            50,
          ],
          itemGap: 20,
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: true},
                saveAsImage : {
                  show: true,
                  name: 'dashboard',
                },
            },
        },
        tooltip: {
          trigger: 'item',
          showContent: true,
          formatter: (params) => {
            let resp = '';
            if (resp.length <= 0) {
              resp += `<p style="margin-bottom:0.3em">${params.seriesName}</p>`;
            }
            resp += '<p style="margin-bottom:0.5rem;font-size:14px">' + `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` + `<span style="font-size:14px;font-weight:400">${params.name}</span><span style="float:right;font-weight:900;margin-left:30px">${formatter.format(params.data.value)}</span>` + '</p>';
            return resp;
          },
        },
        series: seriesRS,
      },
    };
  },
};
</script>

<style scoped>
.chart-wrapper-big {
  width: 100%;
  min-width: 730px;
  height: 1400px;
}
.chart-wrapper-half {
  width: 50%;
  min-width: 620px;
  height: 500px;
}
.chart-wrapper {
  width: 100%;
  min-width: 730px;
  height: 500px;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
