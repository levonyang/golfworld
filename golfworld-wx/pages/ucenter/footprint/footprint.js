var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
    data: {
        loading: {
            showLoadMore: true,
            onLoading: false,
            showIcon: true,
        },
        empty: false,
        footprintList: [],
        page: 1,
        limit: 5,
        totalPages: 1

    },
    getFootprintList() {
        let that = this;
        that.data.loading.showIcon = true
        that.data.loading.onLoading = false
        that.setData({
            loading: that.data.loading,
        })
        util.request(api.FootprintList, {
            page: that.data.page,
            limit: that.data.limit
        }).then(function (res) {
            if (that.data.page >= res.data.pages) {
                that.data.loading.showLoadMore = false
            }
            that.data.footprintList.push(...res.data.list)
            console.log(that.data.footprintList)
            if (res.errno === 0) {
                that.data.loading.showIcon = true
                that.data.loading.onLoading = false
                that.setData({
                    loading: that.data.loading,
                    footprintList: that.data.footprintList,
                    totalPages: res.data.pages
                });
            }
        });
    },
    deleteItem(event) {
        let that = this;
        let index = event.currentTarget.dataset.index;
        let iindex = event.currentTarget.dataset.iindex;
        let footprintId = this.data.footprintList[index][iindex].id;
        let productId = this.data.footprintList[index][iindex].productId;
        var touchTime = that.data.touchEnd - that.data.touchStart;
        console.log(touchTime);
        //如果按下时间大于350为长按
        if (touchTime > 350) {
            wx.showModal({
                title: '',
                content: '要删除所选足迹？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.FootprintDelete, {
                            id: footprintId
                        }, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 2000
                                });
                                that.data.footprintList[index].splice(iindex, 1)
                                if (that.data.footprintList[index].length == 0) {
                                    that.data.footprintList.splice(index, 1)
                                }
                                that.setData({
                                    footprintList: that.data.footprintList
                                });
                            }
                        });
                    }
                }
            });
        } else {
            wx.navigateTo({
                url: '/pages/product/product?id=' + productId,
            });
        }

    },
    onLoad: function (options) {
        this.getFootprintList();
    },
    // onReachBottom() {
    //     if (this.data.totalPages > this.data.page) {
    //         this.setData({
    //             page: this.data.page + 1
    //         });
    //         this.getFootprintList();
    //     } else {
    //         wx.showToast({
    //             title: '没有更多用户足迹了',
    //             icon: 'none',
    //             duration: 2000
    //         });
    //         return false;
    //     }
    // },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    //按下事件开始
    touchStart: function (e) {
        let that = this;
        that.setData({
            touchStart: e.timeStamp
        })
    },
    //按下事件结束
    touchEnd: function (e) {
        let that = this;
        that.setData({
            touchEnd: e.timeStamp
        })
        console.log(e.timeStamp + '- touchEnd')
    },
    loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.getFootprintList()
    }
})