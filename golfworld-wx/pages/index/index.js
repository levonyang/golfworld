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
        selectedChannelId: -1,
        selectedChannelProduct: [],
        duration: 500,
        comingProductList: [],
        newProduct: [],
        showInfoLike: false,
        newProductIndex: 0,
        newProductTotal: 0,
        newReleaseProduct: ''
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
        wx.showLoading({
            title: '加载中...',
        });
        let that = this;
        util.request(api.IndexUrl).then(function (res) {
            wx.hideLoading();
            if (res.errno === 0) {
                res.data.channel.splice(0, 0, {
                    id: -1,
                    nameCn: '精选'
                })
                res.data.floorProductList.push({
                    id: -1,
                    productList: res.data.hotProductList
                })
                if (res.data.newProductList.length > 0) {
                    var newReleaseProduct = res.data.newProductList[0]
                }

                that.setData({
                    newProduct: res.data.newProductList,
                    newProductIndex: 0,
                    newProductTotal: res.data.newProductList.length,
                    hotProduct: res.data.hotProductList,
                    topics: res.data.topicList,
                    brands: res.data.brandList,
                    floorProduct: res.data.floorProductList,
                    banner: res.data.banner,
                    channel: res.data.channel,
                    selectedChannelProduct: res.data.hotProductList,
                    newReleaseProduct: newReleaseProduct
                });

                if (res.data.newProductList.length > 0) {
                    setInterval((function callback() {
                        let newProductIndex = that.data.newProductIndex + 1
                        let newReleaseProduct = res.data.newProductList[that.data.newProductIndex]
                        if (newProductIndex >= res.data.newProductList.length) {
                            newProductIndex = 0
                        }
                        that.setData({
                            newReleaseProduct: newReleaseProduct,
                            newProductIndex: newProductIndex
                        })
                    }).bind(that), 5000);
                }
            }
        });
        util.request(api.ProductCount).then(function (res) {
            that.setData({
                productCount: res.data
            });
        });
    },
    likeOrUnlike(e) {
        let that = this
        let isLike = e.currentTarget.dataset.isLike
        let id = e.currentTarget.dataset.id;
        util.request(api.like, {
            actionType: 1,
            valueId: id
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                if (isLike) {
                    that.setData({
                        showInfoLike: true,
                    })
                    setTimeout((function callback() {
                        that.setData({showInfoLike: false});
                    }).bind(that), 2999);
                }
                that.getComingList()
            }
        });
    },
    onLoad: function (options) {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#E86E35',
            animation: {
                duration: 0,
                timingFunc: 'linear'
            }
        })
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
        if (options.id) {
            //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../product/product?id=' + options.id
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
        this.getComingList();
    },
    goSearch:function(e){
        wx.navigateTo({
            url: '../search/search'
        });
    },
    goProduct: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../product/product?id=' + id
        });

    },
    goNewRelease: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../newRelease/newRelease'
        });

    },
    getComingList() {
        let that = this
        util.request(api.ProductList, {
            isNew: true,
            page: 1,
            limit: 5,
            order: 'asc',
            sort: 'release_time'
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    comingProductList: res.data.list
                });
            }
        });
    },
    tapChannel: function (e) {
        let id = e.currentTarget.dataset.id;
        let selected = this.data.floorProduct.filter(product => product.id == id);
        let productList = []


        if (selected[0] != undefined && selected.length > 0) {
            productList = selected[0].productList
            this.setData({
                selectedChannelId: id,
                selectedChannelProduct: productList,
            })
        } else {
            this.getProductByCategory(id)
        }
    },

    getProductByCategory: function (id) {
        let that = this
        util.request(api.ProductList, {
            isNew: false,
            categoryId: id,
            page: 1,
            limit: 5,
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    selectedChannelId: id,
                    selectedChannelProduct: res.data.list
                });
            }
        });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    }
    ,
    onHide: function () {
        // 页面隐藏
    }
    ,
    onUnload: function () {
        // 页面关闭
    }
})