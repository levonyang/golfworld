const util = require('../../../../utils/util.js');
const api = require('../../../../config/api.js');
const user = require('../../../../utils/user.js');

Page({
    data: {
        loading: {
            showLoadMore: true,
            onLoading: false,
            showIcon: true,
        },
        ballPackList: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1
    },
    onLoad: function (options) {
        this.getBallPack()
    }, showLoading() {
        let that = this
        that.data.loading.showIcon = true
        that.data.loading.onLoading = false
        that.setData({
            loading: that.data.loading,
        })
    },
    hideLoading() {
        let that = this
        that.data.loading.showIcon = true
        that.data.loading.onLoading = false
        that.setData({
            loading: that.data.loading,
        })
    },
    getBallPack: function () {
        let that = this;
        that.showLoading()
        util.request(api.BallPackList, {
            page: that.data.page,
            limit: that.data.limit,
            all: true
        }).then(function (res) {
            console.log(res)
            if (that.data.page >= res.data.pages) {
                that.data.loading.showLoadMore = false
            }
            that.hideLoading()
            if (res.errno === 0) {
                that.setData({
                    ballPackList: that.data.ballPackList.concat(res.data.list),
                    total: res.data.total,
                });
            }
        });
    },
    loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.getBallPack()
    },
    goBallPackDetail(e) {
        console.log(e)
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: '../detail/detail?id=' + e.currentTarget.dataset.id
        })
    }
})
;