<template>
  <div>
    <div>
      <b-container fluid="lg">
        <!-- <b-row cols="6" cols-sm="12" cols-md="6"> -->
        <!-- <b-row> -->
          <!-- <b-col v-for="(val,keyv) in transactionOptions" :key="keyv">
            <div class="chart-wrapper-half">
              <chart :options="val" autoresize :theme="chartThemeVal"></chart>
            </div>
          </b-col> -->
        <!-- </b-row> -->
        <div class="d-flex">
          <div class="w-50" v-for="(val, keyv) in transactionOptions" :key="keyv">
            <div class="chart-wrapper">
              <chart :options="val" autoresize :theme="chartThemeVal"></chart>
            </div>
          </div>
        </div>
        <hr />
      </b-container>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
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

  name: 'TransactionDashboard',
  props: {
    cdata: {
      type: Array[Object],
    },
  },
  data() {
    let chartTheme = '';
    let currency = '';

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      chartTheme = 'dark';
    }

    const genServices = (reportType, apidata) => {

      const c = apidata.find((cd) => cd.id === reportType);
      const dataM = new Object();

      // when data result is empty
      if (c.data.length === 0) {
        let optionM = new Object();
        const dataD = new Array();
        const seriesdR = new Array();

        optionM = {
            title: [{
                text: 'Service Usage',
                x: 'center',
                textStyle: {
                  fontSize: 18,
                },
              }, {
                text: 'NO DATA',
                top: 'center',
                left: 'center',
                textStyle: {
                  fontSize: 24,
                },
              },
            ],
            dataset: {
              source: dataD,
            },
            xAxis: {type: 'category'},
            yAxis: {
              gridIndex: 0,
              name: 'Usage in PhP',
              nameLocation: 'middle',
              nameGap: 50,
            },
            grid: {top: '15%', bottom: '10%'},
            series: seriesdR,
        };

        Vue.set(dataM, 'Services', optionM);
        return dataM;
      }

      // get the xaxis array and add 'services' at index 0
      const x = c.data[0].xaxis.slice();
      x.splice(0, 0, 'services');

      for (const [key, val] of Object.entries(c.data[0])) {
        if (key === 'currency') {
          currency = val;
          break;
        }
      }
      // dashboard
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency[0],
      });

      for (const [key, val] of Object.entries(c.data[0])) {
        if (val.every((item) => item === 0)) {
          continue;
        }

        if (key === 'currency') {
          continue;
        }

        let s = new Array();
        let optionM = new Object();
        const dataD = new Array();
        const seriesdR = new Array();

        // skip 'xaxis' key
        if (key === 'xaxis') {
          continue;
        }

        s = val.slice();
        s.splice(0, 0, key);
        dataD.push(x);
        dataD.push(s);

        if (key !== 'xaxis') {
          const r = {
            type: 'bar',
            seriesLayoutBy: 'row',
            emphasis: {
                focus: 'series',
            },
          };
          seriesdR.push(r);
        }
        optionM = {
            title: {
              text: key + ' Usage',
              x: 'center',
              textStyle: {
                fontSize: 18,
              },
            },
            legend: { top: '5%', },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: true},
                    saveAsImage : {show: true},
                },
            },
            tooltip: {
              trigger: 'item',
              showContent: true,
              axisPointer: {
                  type: 'shadow',
              },
              formatter: (params) => {
                return `<p style="margin-bottom:0.3em">${params.name}</p>` + `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span><span style="font-size:14px;font-weight:400">${params.seriesName}</span><span style="float:right;font-weight:900;margin-left:30px">${formatter.format(params.value[params.seriesIndex + 1])}</span>`;
              },
            },
            dataset: {
              source: dataD,
            },
            xAxis: {type: 'category'},
            yAxis: {
              gridIndex: 0,
              name: 'Usage in ' + currency,
              nameLocation: 'middle',
              nameGap: 50,
              axisLabel: {
                // convert to k, M units
                formatter: (value) => {
                  if (value > 999 && value < 1000000) {
                    return value / 1000 + 'k';
                  } else if (value > 999999) {
                    return value / 1000000 + 'M';
                  } else {
                    return value;
                  }
                },
              },
            },
            grid: {top: '15%', bottom: '10%'},
            series: seriesdR,
        };

        Vue.set(dataM, key, optionM);
      }
      return dataM;
    };

    const transactM = genServices('TotalServicePerMonth', this.$props.cdata);
    return {
      transactionOptions: transactM,
      chartThemeVal: chartTheme,
    };
  },
};
</script>

<style scoped>
.chart-wrapper-big {
  width: 100%;
  height: 900px;
}
.chart-row{
  width: 100%;
}
.chart-wrapper-half {
  width: 50%;
  min-width: 620px;
  height: 500px;
}
.chart-wrapper {
  /* width: 100%; */
  /* min-width: 620px; */
  height: 500px;
}
.echarts {
  width: 100%;
  height: 100%;
}
.d-none {
  display: none;
}
.d-flex {
  display: flex;
  flex-wrap: wrap;
}
.w-50 {
  width: 50%;
}
@media (max-width: 767px) {
  .w-50 {
    width: 100%;
  }
}
</style>