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
//今天前7天
function d7(){
    const time=new Array;
    for(var i=-6;i<=0;i++){
    time.push(getDay(i))
    }
    return time
}
//昨天前7天
function yd7(){
    const time=new Array;
    for(var i=-7;i<=-1;i++){
    time.push(getDay(i))
    }
    return time
}
//上图表
var buidlid = app.globalData.building
    var roomid = app.globalData.room
function setOption(chart) {
    var date7=d7();
    var buidlid = app.globalData.building
    var roomid = app.globalData.room
    let p = new Promise(function (resolve) {
        wx.request({
            url: 'https://test.topxls.cn/HistoricalElectricity.php?buildid=' + buidlid + '&roomid=' + roomid,
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
        // 今天电量显示当前查询的电量
        data[6]=app.globalData.todaypower
        const option = {
            title: {
                text: buidlid + "-" + roomid + '历史电量曲线(Beta)',
                left: 'center'
            },
            legend: {//图例组件的相关配置
                data: ['电量曲线'],//图例上显示的文字信息
                top: 25,//设置图例在Y轴方向上的位置
                left: 'center',//设置图例在X轴方向上的位置
                backgroundColor: 'white',//背景颜色

            },
            grid: {//图表离容器的距离
                containLabel: true//防止数值过大而超出视图
            },
            tooltip: {//提示框
                show: true,// 是否显示提示框组件
                trigger: 'axis'//触发类型:坐标轴触发
            },
            xAxis: {//x坐标轴
                type: 'category',// 坐标轴类型
                name:"日期",// 坐标轴名
                boundaryGap: false,//x 坐标轴两边不留白
                data: date7,//设置 x 轴上的值。
            },
            yAxis: {
                x: 'center',
                type: 'value',//坐标轴类型
                name:"剩余电量/度",
                axisLine: {
                    show: true,    // 是否显示坐标轴轴线
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'// 坐标轴线线的类型：虚线
                    }
                }
            },
            series: [{
                name: '历史电量',
                type: 'line',// 图形类型
                smooth: true,// 线条平滑展示，折线图起作用
                data: data// 数值
            }]
        };
        chart.setOption(option);
    });
}

//下图表
function setOption2(chart) {
    var buidlid = app.globalData.building
    var roomid = app.globalData.room
    var date7=yd7();
    let p = new Promise(function (resolve) {
        wx.request({
            url: 'https://test.topxls.cn/PowerConsumption.php?buildid=' + buidlid + '&roomid=' + roomid,
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
                text: buidlid + "-" + roomid + '近期耗电量曲线(Beta)',
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
                name:"耗电量/度",
                axisLine: {
                    show: true,    // 是否显示坐标轴轴线
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
                // show: false
            },
            series: [{
                name: '耗电量',
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
            title: '微信小程序可以查询空调电量啦！',
            path: '/pages/index/index',
            success: function () {},
            fail: function () {}
        }
    },

    onReady: function () {
        // 获取组件 
        this.ecComponent = this.selectComponent('#mychart-dom-bar');
        this.ecComponent2 = this.selectComponent('#mychart-dom-multi-scatter');
        this.init()
        
    },

    data: {
        ec: {
            // 将 lazyLoad 设为 true 后，需要手动初始化图表
            lazyLoad: false
        },
        ecScatter: {
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
                // 将图表实例绑定到 this 上
                this.chart = chart;
                this.setData({
                    isLoaded: true,
                    isDisposed: false
                });
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return chart;
            });
            this.ecComponent2.init((canvas, width, height, dpr) => {
                // 获取组件的 canvas、width、height 后的回调函数
                // 在这里初始化图表
                const scatterChart = echarts.init(canvas, null, {
                    width: width,
                    height: height,
                    devicePixelRatio: dpr // new
                });
                setOption2(scatterChart);
                // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
                this.scatterChart = scatterChart;
                this.setData({
                    isLoaded: true,
                    isDisposed: false
                });
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return scatterChart;
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