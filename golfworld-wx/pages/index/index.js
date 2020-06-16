const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

//获取应用实例
const app = getApp();

Page({
    data: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        item: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        selectedChannelId: 1036014,
        duration: 500

    },

    onShareAppMessage: function () {
        return {
            title: 'golfworld',
            desc: '',
            path: '/pages/index/index'
        }
    },

    onPullDownRefresh() {
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.getIndexData();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    getIndexData: function () {
        let that = this;
        util.request(api.IndexUrl).then(function (res) {
            console.log(res)
            // res.data.channel
            if (res.errno === 0) {
                that.setData({
                    newProduct: res.data.newProductList,
                    hotProduct: res.data.hotProductList,
                    topics: res.data.topicList,
                    brands: res.data.brandList,
                    floorProduct: res.data.floorProductList,
                    banner: res.data.banner,
                    channel: res.data.channel,
                });
            }
        });
        util.request(api.ProductCount).then(function (res) {
            that.setData({
                productCount: res.data
            });
        });
    },
    onLoad: function (options) {

        // 页面初始化 options为页面跳转所带来的参数
        if (options.scene) {
            //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
            var scene = decodeURIComponent(options.scene);
            console.log("scene:" + scene);

            let info_arr = [];
            info_arr = scene.split(',');
            let _type = info_arr[0];
            let id = info_arr[1];

            if (_type == 'product') {
                wx.navigateTo({
                    url: '../product/product?id=' + id
                });
            } else if (_type == 'groupon') {
                wx.navigateTo({
                    url: '../product/product?grouponId=' + id
                });
            } else {
                wx.navigateTo({
                    url: '../index/index'
                });
            }
        }

        // 页面初始化 options为页面跳转所带来的参数
        if (options.grouponId) {
            //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../product/product?grouponId=' + options.grouponId
            });
        }

        // 页面初始化 options为页面跳转所带来的参数
        if (options.goodId) {
            //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../product/product?id=' + options.goodId
            });
        }

        // 页面初始化 options为页面跳转所带来的参数
        if (options.orderId) {
            //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId
            });
        }

        this.getIndexData();
    },
    tapChannel: function(e){
        this.setData(
            {
                selectedChannelId:e.currentTarget.dataset.id
            }
        )
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})