<template>
  <div>
    <div>
      <b-container fluid="lg">
        <b-row cols="1" cols-sm="1" cols-md="2">
          <!-- <b-col class="chartwraphalf" v-for="(fParam,index) in dashboardParams" :key="`dashboard-${ index }`"> -->
          <b-col v-for="(fParam,index) in dashboardParams" :key="`dashboard-${ index }`" style="height: 500px; width: 50%; min-width: 620px;"> 
            <chart :options="fParam" autoresize :theme="chartThemeVal" style="height: 100%; width: 100%;"></chart>
          </b-col>
        </b-row>
      </b-container>
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

  name: 'DefaultIntegrationDashboard',
  props: {
    cdata: {
      type: Array[Object],
    },
    nozero: {
      type: Array[String],
    },
  },
  data() {
    let chartTheme = '';

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      chartTheme = 'dark';
    }

    const genServices = (apidata, nz) => {

      const c = apidata;
      const dataR = new Array();
      const seriesdR = new Array();
      const minData = new Array();
      const maxData = new Array();
      const avgData = new Array();
      let noData = true;

      // if data is empty skip/ignore
      // will show charts with 'NO DATA' text
      if (c.data.length === 0) {
        return [dataR, seriesdR, noData];
      }

      // if xaxis is empty, skip/ignore
      // will show charts with 'NO DATA' text
      if (c.data.xaxis.length === 0) {
        return [dataR, seriesdR, noData];
      }

      for (const [key, value] of Object.entries(c.data)) {

        if (key === 'xaxis') {
          const x = value.slice();
          x.splice(0, 0, 'timeaxis');
          dataR.splice(0, 0, x);
          continue;
        }

        if (key !== 'xaxis') {

          const minval = Math.min.apply(Math, value);
          const maxval = Math.max.apply(Math, value);

          // if nozero is true for this chart id
          // ignore all entries with just 0 values
          if (nz && maxval === 0) {
            continue;
          }

          const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

          const avgval = arrAvg(value);

          minData.push(minval);
          maxData.push(maxval);
          avgData.push(avgval);

          // for the series chart paramter
          const r = {
            type: 'line',
            // connectNulls: true,
            // stack: 'total',
            seriesLayoutBy: 'row',
            emphasis: {
                focus: 'series',
            },
          };
          seriesdR.push(r);
        }

        // put key (e.g status_check_failed_maximum_i-xxxxxxxx) at start of array
        // add the array to returned dataR (metricDR)
        const s = value.slice();
        s.splice(0, 0, key);
        dataR.push(s);
        noData = false;
      }

      return [dataR, seriesdR, noData, minData, maxData, avgData];
    };

    // used for the tooltip values
    // short-form notation of big values
    const formatNumber = (n) => {

      if (n === null) { return '-'; }
      if (n < 1e3) { return n.toFixed(2); }
      if (n >= 1e3 && n < 1e6) { return +(n / 1e3).toFixed(2) + 'K'; }
      if (n >= 1e6 && n < 1e9) { return +(n / 1e6).toFixed(2) + 'M'; }
      if (n >= 1e9 && n < 1e12) { return +(n / 1e9).toFixed(2) + 'B'; }
      if (n >= 1e12) { return +(n / 1e12).toFixed(2) + 'T'; }
    };


    const finalReturnParams = new Array();

    // ascending sort - sorting based on chart title or 'id'
    const sortedCdata = this.$props.cdata.sort((a, b) => (a.id < b.id ? -1 : 1));

    // iterate the API data result and generate the chart parameters
    // input: [{"data":{"xaxis":[...], "instance01": [...], "instance02": [...],...}, "id": "idvalue"},{...},...]
    sortedCdata.forEach( (value) => {

      let nz = false;

      // if data is empty skip/ignore
      // remove charts with "NO DATA"
      if (value.data.length === 0) {
        return;
      }

      // if xaxis is empty, skip/ignore
      // remove charts with "NO DATA"
      if (value.data.xaxis.length === 0) {
        return;
      }

      // if chart id is included in nozero array
      // means chart should not show entries with just zero values
      if (this.$props.nozero.includes(value.id)) {
        nz = true;
      }

      const [ metricDR,
              metricDS,
              metricNoData,
              metricMin,
              metricMax,
              metrigAvg ] = genServices(value, nz);

      const finalParam = {
        title: [{
          text: value.id,
          x: 'center',
          textStyle: {
            fontSize: 24,
          },
        }, {
          show: metricNoData,  // shows NO DATA if there's no data
          text: 'NO DATA',
          top: 'center',
          left: 'center',
          textStyle: {
            fontSize: 24,
            },
          },
        ],
        legend: {
          bottom: '5%',
          left: '10%',
          top: '83%',
          type: 'scroll',
          orient: 'horizontal',
          textStyle: {
            fontSize: 10,
          },
        },
        toolbox: {
          show : true,
          right: '5%',
           orient: 'vertical',
          feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: true},
              saveAsImage : {show: true},
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
          },
        },
        tooltip: {
          trigger: 'axis',
          showContent: true,
          position: 'top',
          confine: true,
          backgroundColor: 'rgba(255,255,255,0.95)',
          displayColors: false,
          formatter: (params) => {
            let resp = '';
            for (const param of params) {
              if (resp.length <= 0) {
                resp += `<p style="margin-bottom:0.3em">${param.name}` +
                // `<span style="float:right;font-weight:900;margin-left:30px">Cur</span>` +
                // `<span style="float:right;font-weight:900;margin-left:30px">Min</span>` +
                // `<span style="float:right;font-weight:900;margin-left:30px">Avg</span>` +
                // `<span style="float:right;font-weight:900;margin-left:30px">Max</span>` +
                `</p>`;
              }
              resp += '<p style="margin-bottom:0.5rem;font-size:14px">' +
                `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>` +
                `<span style="font-size:14px;font-weight:400">${param.seriesName}</span><span style="float:right;font-weight:900;margin-left:30px">Cur: ${formatNumber(param.value[param.seriesIndex + 1])}</span>` +
                `<span style="float:right;font-weight:900;margin-left:30px">Min: ${formatNumber(metricMin[param.seriesIndex])}</span>` +
                `<span style="float:right;font-weight:900;margin-left:30px">Avg: ${formatNumber(metrigAvg[param.seriesIndex])}</span>` +
                `<span style="float:right;font-weight:900;margin-left:30px">Max: ${formatNumber(metricMax[param.seriesIndex])}</span>` +
                '</p>';
            }
            return resp;
          },
        },
        dataset: {
          source: metricDR,
        },
        xAxis: {
          type: 'category',
          name: 'in UTC',
        },
        yAxis: {
          gridIndex: 0,
          // name: 'Unit',
          // nameLocation: 'middle',
          // nameGap: 50,
          axisLabel: {
            // convert to k, M units
            formatter: (metvalue) => {
              if (metvalue > 999 && metvalue < 1000000) {
                return metvalue / 1000 + 'k';
              } else if (metvalue > 999999) {
                return metvalue / 1000000 + 'M';
              } else {
                return metvalue;
              }
            },
          },
        },
        grid: {top: '10%', bottom: '20%', containLabel: true},
        series: metricDS,
      };

      finalReturnParams.push(finalParam);
    });

    return {
      chartThemeVal: chartTheme,
      dashboardParams: finalReturnParams,
    };
  },
};
</script>

<style scoped>
.chartwrapbig {
  width: 100%;
  min-width: 730px;
  height: 1400px;
}
.chartwraphalf {
  width: 50%;
  min-width: 620px;
  height: 500px;
}
.chartwrap {
  width: 100%;
  min-width: 730px;
  height: 500px;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
