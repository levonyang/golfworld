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
            that.hideLoading()
            if (that.data.page >= res.data.pages) {
                that.data.loading.showLoadMore = false
            }
            if (res.errno === 0) {
                that.setData({
                    ballPackList: that.data.ballPackList.concat(res.data.list),
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
    }
})
;