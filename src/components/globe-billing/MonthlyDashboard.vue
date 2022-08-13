<template>
  <div>
    <div>
      <b-card-group deck>
        <b-card
          header="Preceding Month"
          header-class="bg-primary-400"
          :title="'Month: ' + preMonth"
          style="max-width: 30rem;"
         >
          <b-card-text>Total Usage Cost: {{ preMonthValue }}</b-card-text>
        </b-card>
        <b-card
          header="Latest/Current Month"
          header-class="bg-primary-400"
          :title="'Month: ' + latestMonth"
          style="max-width: 30rem;"
         >
          <b-card-text>Total Usage Cost: {{ latestMonthValue }}</b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <hr />
    <div class="chart-wrapper-big">
      <chart :options="chartServicePastPeriodv2" @updateAxisPointer="updateAxisPointer($event, currency)" autoresize :theme="chartThemeVal"></chart>
    </div>
    <hr />
    <div class="chart-wrapper">
      <chart :options="chartPastPeriodTotal" autoresize :theme="chartThemeVal"></chart>
    </div>
    <hr />
    <div>
      <b-card-group deck>
        <b-card
          header="Latest/Current Compute Usage"
          header-class="bg-primary-400"
          style="max-width: 30rem;"
         >
          <b-card-text>Total Usage Cost: {{ computeLTotal }}</b-card-text>
        </b-card>
        <b-card
          header="Latest/Current Storage Usage"
          header-class="bg-primary-400"
          style="max-width: 30rem;"
         >
          <b-card-text>Total Usage Cost: {{ storageLTotal }}</b-card-text>
        </b-card>
        <b-card
          header="Latest/Current Database Usage"
          header-class="bg-primary-400"
          style="max-width: 30rem;"
         >
          <b-card-text>Total Usage Cost: {{ databaseLTotal }}</b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <hr />
    <div>
      <b-container fluid="lg">
        <b-row cols="1" cols-sm="1" cols-md="2">
          <b-col class="chart-wrapper-half">
            <chart :options="computeMonthly" autoresize :theme="chartThemeVal"></chart>
          </b-col>
          <b-col class="chart-wrapper-half">
            <chart :options="storageMonthly" autoresize :theme="chartThemeVal"></chart>
          </b-col>
          <b-col class="chart-wrapper-half">
            <chart :options="databaseMonthly" autoresize :theme="chartThemeVal"></chart>
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

  name: 'MonthlyDashboard',
  props: {
    cdata: {
      type: Array[Object],
    },
    ctypes: {
      type: Array[Object],
    },
  },
  data() {
    let chartTheme = '';
    let currVal = 'PHP';

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      chartTheme = 'dark';
    }

    const genSeries = (reportType, apidata) => {
      const c = apidata.find((cd) => cd.id === reportType);
      const retR = new Array();
      const seriesR = new Array();
      let noData = true;

      if (c.data.length === 0) {
        return [retR, seriesR, noData];
      }

      for (const [key, value] of Object.entries(c.data[0])) {
        if (value.every((item) => item === 0)) {
          continue;
        }

        if (key === 'xaxis') {
          const x = value.slice();
          x.splice(0, 0, 'services');
          retR.splice(0, 0, x);
          continue;
        }

        if (key === 'currency') {
          currVal = value[0];
          continue;
        }

        const s = value.slice();
        s.splice(0, 0, key);
        retR.push(s);

        if (key !== 'xaxis' && key !== 'currency') {
          const r = {
            type: 'bar',
            stack: 'total',
            seriesLayoutBy: 'row',
            emphasis: {
                focus: 'series',
            },
          };
          seriesR.push(r);
        }
        noData = false;
      }

      if (reportType !== 'TotalPerMonth') {
        const currencyFormat = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currVal,
        });

        const pieR = {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '67.5%'],
          emphasis: {
            focus: 'data',
          },
          label: {
            formatter: (params) => {
              return `${params.name} : ${currencyFormat.format(params.value[1])}`;
            },
            alignTo: 'edge',
            overflow: 'break',
            edgeDistance: '10%',
          },
          labelLine: {
            show: true,
          },
          avoidLabelOverlap: true,
          encode: {
            itemName: 'services',
            value: retR[0][1],
            tooltip: retR[0][1],
          },
        };

        seriesR.push(pieR);
      }

      return [retR, seriesR];
    };

    const formatCategoryData = (data, category) => {
      const categoryData = [];
      if (Object.keys(data).length > 0) {
        if (data[category]) {
          for (const dc of data[category]) {
            categoryData.push(dc.TransactionType);
          }
        }
      }
      return categoryData;
    };

    const [retRS, seriesRS, svcNoData] = genSeries('TotalServicePerMonth', this.$props.cdata);
    const [retRT, seriesRT, totNoData] = genSeries('TotalPerMonth', this.$props.cdata);

    const genServices = (reportType, apidata, servicelist) => {

      const c = apidata.find((cd) => cd.id === reportType);
      const dataR = new Array();
      const seriesdR = new Array();
      let totalCstr = 'N/A';
      let totalC = 0.00;
      let noData = true;

      if (c.data.length === 0) {
        return [dataR, seriesdR, totalCstr, noData];
      }

      for (const [key, value] of Object.entries(c.data[0])) {

        if (key === 'xaxis') {
          const x = value.slice();
          x.splice(0, 0, 'services');
          dataR.splice(0, 0, x);
          continue;
        }

        // only include selected services as per array
        if (servicelist.length > 0 ) {
          if (servicelist.includes(key)) {
            const s = value.slice();
            s.splice(0, 0, key);
            dataR.push(s);
            noData = false;

            // get total for the service category
            totalC = totalC + s[s.length - 1];

            if (key !== 'xaxis') {
              const r = {
                type: 'bar',
                stack: 'total',
                seriesLayoutBy: 'row',
                emphasis: {
                    focus: 'series',
                },
              };
              seriesdR.push(r);
            }
          }
        }
      }
      totalCstr = '' + totalC;
      return [dataR, seriesdR, totalCstr, noData];
    };

    const [ computeDR,
            computeDS,
            computeTotal,
            cNoData ] = genServices('TotalServicePerMonth', this.$props.cdata, formatCategoryData(this.$props.ctypes, 'Compute'));

    const [ storageDR,
            storageDS,
            storageTotal,
            sNoData ] = genServices('TotalServicePerMonth', this.$props.cdata, formatCategoryData(this.$props.ctypes, 'Storage'));

    const [ databaseDR,
            databaseDS,
            databaseTotal,
            dbNoData ] = genServices('TotalServicePerMonth', this.$props.cdata, formatCategoryData(this.$props.ctypes, 'Database'));

    // for static usage stats
    let lmValArray = [ 'N/A', 'N/A'];
    let pmValArray = [ 'N/A', 'N/A'];

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currVal,
    });

    if ( retRT.length > 0 ) {
      if ( retRT[0].length > 1 ) {
        // get latest/preceding month as per x-axis
        // Jan-2021
        const lmIndex = retRT[0].length - 1;
        lmValArray = [ retRT[0][lmIndex], formatter.format(retRT[1][lmIndex]) ];

        if ( retRT[0].length > 2 ) {
          const pmIndex = retRT[0].length - 2;
          pmValArray = [ retRT[0][pmIndex], formatter.format(retRT[1][pmIndex]) ];
        }

      }
    }

    let finalComputeTotal = 'N/A';
    let finalStorageTotal = 'N/A';
    let finalDbTotal = 'N/A';

    if (computeTotal !== 'N/A') {
      finalComputeTotal = formatter.format(computeTotal);
    }

    if (storageTotal !== 'N/A') {
      finalStorageTotal = formatter.format(storageTotal);
    }

    if (databaseTotal !== 'N/A') {
      finalDbTotal = formatter.format(databaseTotal);
    }

    return {
      chartThemeVal: chartTheme,
      latestMonthValue: lmValArray[1],
      currency: currVal,
      latestMonth: lmValArray[0],
      preMonthValue: pmValArray[1],
      preMonth: pmValArray[0],
      computeLTotal: finalComputeTotal,
      storageLTotal: finalStorageTotal,
      databaseLTotal: finalDbTotal,
      chartServicePastPeriodv2: {
        title: [{
          show: svcNoData,  // shows NO DATA if there's no data
          text: 'NO DATA',
          bottom: '75%',
          left: 'center',
          textStyle: {
            fontSize: 24,
            },
          },
        ],
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
          trigger: 'axis',
          showContent: true,
          axisPointer: {
              type: 'shadow',
          },
          formatter: (params) => {
            let resp = '';
            for (const param of params) {
              if (resp.length <= 0) {
                resp += `<p style="margin-bottom:0.3em">${param.name}</p>`;
              }
              resp += '<p style="margin-bottom:0.5rem;font-size:14px">' + `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>` + `<span style="font-size:14px;font-weight:400">${param.seriesName}</span><span style="float:right;font-weight:900;margin-left:30px">${formatter.format(param.value[param.seriesIndex + 1])}</span>` + '</p>';
            }
            return resp;
          },
        },
        dataset: {
          source: retRS,
        },
        xAxis: {type: 'category'},
        yAxis: {
          gridIndex: 0,
          name: 'Usage in ' + currVal,
          nameLocation: 'middle',
          nameGap: 60,
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
        grid: {
          top: '10%',
          bottom: '55%',
        },
        series: seriesRS,
      },
      computeMonthly: {
        title: [{
          text: 'Compute Usage',
          x: 'center',
          textStyle: {
            fontSize: 24,
          },
        }, {
          show: cNoData,  // shows NO DATA if there's no data
          text: 'NO DATA',
          top: 'center',
          left: 'center',
          textStyle: {
            fontSize: 24,
            },
          },
        ],
        legend: { top: '8%', },
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
          source: computeDR,
        },
        xAxis: {type: 'category'},
        yAxis: {
          gridIndex: 0,
          name: 'Usage in ' + currVal,
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
        grid: {top: '20%', bottom: '5%'},
        series: computeDS,
      },
      storageMonthly: {
        title: [{
          text: 'Storage Usage',
          x: 'center',
          textStyle: {
            fontSize: 24,
          },
        }, {
          show: sNoData,  // shows NO DATA if there's no data
          text: 'NO DATA',
          top: 'center',
          left: 'center',
          textStyle: {
            fontSize: 24,
            },
          },
        ],
        legend: { top: '8%', },
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
          source: storageDR,
        },
        xAxis: {type: 'category'},
        yAxis: {
          gridIndex: 0,
          name: 'Usage in ' + currVal,
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
        grid: {top: '20%', bottom: '5%'},
        series: storageDS,
      },
      databaseMonthly: {
        title: [{
          text: 'Database Usage',
          x: 'center',
          textStyle: {
            fontSize: 24,
          },
        }, {
          show: dbNoData,  // shows NO DATA if there's no data
          text: 'NO DATA',
          top: 'center',
          left: 'center',
          textStyle: {
            fontSize: 24,
            },
          },
        ],
        legend: { top: '8%', },
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
          source: databaseDR,
        },
        xAxis: {type: 'category'},
        yAxis: {
          gridIndex: 0,
          name: 'Usage in ' + currVal,
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
        grid: {top: '20%', bottom: '5%'},
        series: databaseDS,
      },
      chartPastPeriodTotal: {
        title: [{
          text: 'Total Usage per Month',
          x: 'center',
          textStyle: {
            fontSize: 24,
            },
          }, {
          show: totNoData,  // shows NO DATA if there's no data
          text: 'NO DATA',
          top: 'center',
          left: 'center',
          textStyle: {
            fontSize: 24,
            },
          },
        ],
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: true},
                saveAsImage : {show: true},
            },
        },
        tooltip: {
          trigger: 'axis',
          showContent: true,
          axisPointer: {
              type: 'shadow',
          },
          formatter: (params) => {
            return `<p style="margin-bottom:0.3em">${params[0].name}</p>` + `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color};"></span><span style="font-size:14px;font-weight:400">${params[0].seriesName}</span><span style="float:right;font-weight:900;margin-left:30px">${formatter.format(params[0].value[1])}</span>`;
          },
        },
        dataset: {
          source: retRT,
        },
        xAxis: {type: 'category'},
        yAxis: {
          gridIndex: 0,
          name: 'Usage in ' + currVal,
          nameLocation: 'middle',
          nameGap: 60,
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
        grid: {top: '10%', bottom: '5%'},
        series: seriesRT,
      },
    };
  },
  methods: {
    updateAxisPointer(event, currency) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      });
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        const dimension = xAxisInfo.value + 1;
        this.chartServicePastPeriodv2.series = [{
          id: 'pie',
          emphasis: {focus: 'data'},
          label: {
            formatter: (params) => {
              return `${params.name} : ${formatter.format(params.value[dimension])}`;
            },
          },
          encode: {
            value: dimension,
            tooltip: dimension,
          },
        }];
      }
    },
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
