process.env.VUE_APP_BUILD_TS = new Date(Date.now()).toLocaleString();

module.exports = {
  devServer: {
    port: 9000
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
}
