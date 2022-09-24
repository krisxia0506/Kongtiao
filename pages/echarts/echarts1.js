import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: 500,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  console.log(getApp().globalData.building)
  console.log(getApp().globalData.room)
  var buidlid=getApp().globalData.building
  var roomid=getApp().globalData.room
  
  let p = new Promise(function (resolve) {
    wx.request({
        // url: 'https://test.topxls.cn/wash.php',
        url:'https://test.topxls.cn/avg.php?buildid='+buidlid+'&roomid='+roomid,
        method: "GET",
        header: {
            'Content-type': 'application/json;charset=UTF-8', // 默认值
            'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
            'Cookie': 'PHPSESSID=153vno80441rmkbb88deela899'
        },
        dataType: JSON,
        success: (res) => {
            //捕获json.pause异常
            try {
                console.log(JSON.parse(res.data))
                resolve(JSON.parse(res.data))
            } catch (e) {
                console.log(e.message);
                resolve('error')
            }
        }
    })
});

p.then((data) => {

  var option = {
    title: {
      text: '用电量曲线(Beta)',
      left: 'center'
    },
    legend: {
      data: ['A', 'B', 'C'],
      top: 25,
      left: 'center',
      backgroundColor: 'white',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: data
    }]
  };
  chart.setOption(option);
});
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },
});