import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
//获取近七天日期
function getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tMonth + "-" + tDate;
}
function doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}

function d7(){
    const time=new Array;
    for(var i=-6;i<=0;i++){
    time.push(getDay(i))
    }
    return time
}

function setOption(chart) {
    var date7=d7();
    var buidlid = app.globalData.building
    var roomid = app.globalData.room
    let p = new Promise(function (resolve) {
        wx.request({
            url: 'https://test.topxls.cn/avg.php?buildid=' + buidlid + '&roomid=' + roomid,
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
                    //console.log(JSON.parse(res.data))
                    resolve(JSON.parse(res.data))
                } catch (e) {
                   // console.log(e.message);
                    resolve('error')
                }
            }
        })
    });
    p.then((data) => {
        const option = {
            title: {
                text: buidlid + "-" + roomid + '用电量曲线(Beta)',
                left: 'center'
            },
            legend: {
                data: ['电量曲线'],
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
                name:"日期",
                boundaryGap: false,
                data: date7,
                // show: false
            },
            yAxis: {
                x: 'center',
                type: 'value',
                name:"剩余电量/度",
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
                // show: false
            },
            series: [{
                name: '电量曲线',
                type: 'line',
                smooth: true,
                data: data
            }]
        };
        chart.setOption(option);
    });
}

Page({
    onShareAppMessage: res => {
        return {
            title: 'ECharts 可以在微信小程序中使用啦！',
            path: '/pages/index/index',
            success: function () {},
            fail: function () {}
        }
    },

    onReady: function () {
        // 获取组件
        this.ecComponent = this.selectComponent('#mychart-dom-bar');
        this.init()
        
    },

    data: {
        ec: {
            // 将 lazyLoad 设为 true 后，需要手动初始化图表
            lazyLoad: false
        },
        isLoaded: true,
        isDisposed: false,
        flag:"0"
    },

    // 点击按钮后初始化图表
    init: function () {
        if (app.globalData.building == 0 || app.globalData.room == 0) {
            if(app.globalData.flag==0){
            wx.showModal({
                title: '先选择宿舍哦',
                content: '请先在 首页 查询剩余电量后才能查看图表哦',
                showCancel: false,
                success (res){
                    app.globalData.flag=0
                }
            })
            app.globalData.flag=1
        }
        } else {
            this.ecComponent.init((canvas, width, height, dpr) => {
                // 获取组件的 canvas、width、height 后的回调函数
                // 在这里初始化图表
                const chart = echarts.init(canvas, null, {
                    width: width,
                    height: height,
                    devicePixelRatio: dpr // new
                });
                setOption(chart);
                // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
                this.chart = chart;
                this.setData({
                    isLoaded: true,
                    isDisposed: false
                });
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return chart;
            });
        }
    },
    onShow:function(){
        try{
            this.init();
        }catch{
            console.log("onshow首次加载失败")
        }
    }
});