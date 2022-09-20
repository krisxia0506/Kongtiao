// pages/list.js
//kongtiao1='123'

Page({
    promiseClick(building, room) {
        var building_id2post = {
            1: '1-9--10-',
            2: '1-10--11-',
            3: '1-11--12-',
            4: '1-12--9-',
            5: '1-3--3-',
            6: '1-1--1-',
            7: '1-4--8-',
            8: '1-5--4-',
            9: '1-6--5-',
            10: '1-7--6-',
            11: '1-8--7-'
        }
        wx.showLoading({
            title: '查询中',
        })
        //console.log('楼号选择是',building_id2post[1])
        let p = new Promise(function (resolve) {
            wx.request({
                url: 'https://test.topxls.cn/curl.php?cs=' + building_id2post[building] + room,
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
                        //判断查询结果json的returncode字段
                        if (JSON.parse(res.data).returncode == '100') {
                            resolve(JSON.parse(res.data).quantity)
                        } else if (JSON.parse(res.data).returncode == '-600') {
                            resolve('error1')
                        } else {
                            //查询成果返回json的quantity字段            
                            resolve('error')
                            //console.log(JSON.parse(res.data).quantity)
                        }
                    } catch (e) {
                        console.log(e.message);
                        wx.hideLoading();
                        resolve('error')
                    }
                },
                fail: (data) => {
                    // 这里可以对请求超时之后。我们可以自定义的业务逻辑,这里只是简单举例
                    reject(data);
                    wx.hideLoading();
                    wx.showModal({
                        content: "请求超时...",
                        showCancel: false,
                        success: (res) => {
                            // 重定向会首页
                            tt.redirectTo({
                                url: 'pages/index/index'
                            })
                        }
                    })
                }

            })
        });
        
        p.then((data) => {
            //console.log(data)        
            if (data == 'error') {
                wx.hideLoading();
                this.setData({
                    shengyu: '请输入正确的房间号',
                    kongtiao: '',
                    du: ''
                })
            } else if (data == 'error1') {
                wx.hideLoading();
                this.setData({
                    shengyu: '系统升级维护中',
                    kongtiao: '请稍后重试',
                    du: ''
                })
            } else {
                wx.hideLoading();
                this.setData({
                    shengyu: '剩余电量',
                    kongtiao: data,
                    du: '度'
                })
            }
        });


    },
    //点击查询后执行    
    formSubmit(e) {

        let room = e.detail.value.room;
        let building = e.detail.value.building.valueOf()
        if (e.detail.value.building == -1 || e.detail.value.building == 0) {
            this.setData({
                shengyu: '',
                kongtiao: '请输入正确的房间号',
                du: ''
            })
            return false
        }

        //console.log('form发生了submit事件，携带数据为：', e.detail.value)
        //console.log('e.detail.value.building是', e.detail.value.building.valueOf())


        //console.log('buliding是', building)
        //console.log('e.detail.value.room是', e.detail.value.room)
        this.promiseClick(building, room)


    },
    bindPickerChange: function (e) {
        //console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    // 用前须知
    what() {
        wx.showModal({
            title: '用前须知',
            content: '8号楼的ABCD区用1234代替\r例如A102房间号为1102\rB102房间号为2102\rC102房间号为3102\rD102房间号为4102\r若需充值电量可前往\r完美校园APP-缴费-预缴费处缴费\r到账时间1-3分钟',
            showCancel:false,
        })

    },

    /**
     * 页面的初始数据
     */
    data: {
        imagsrc: 'https://i0.hdslb.com/bfs/face/dfef378ff65e8e9007f3ffcd6bfeb711f236b797.jpg@240w_240h_1c_1s.webp',
        array: ['请选择公寓楼', '1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼'],
        shengyu: '',
        index: 0,
        kongtiao: '',
        du: ''
    },



    /**
     * 生命周期函数--监听页面加载
     * (
        )
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})