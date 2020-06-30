var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        loading: {
            showLoadMore: true,
            onLoading: false,
            showIcon: true,
        },
        likeList: [],
        empty: false,
        page: 1,
        limit: 5,
        totalPages: 1
    },
    showLoading() {
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
    getLikeList() {
        let that = this;
        that.showLoading()
        util.request(api.LikeList, {
            type: that.data.type,
            page: that.data.page,
            limit: that.data.limit
        }).then(function (res) {
            if (that.data.page >= res.data.pages) {
                that.data.loading.showLoadMore = false
            }
            if (res.errno === 0) {
                that.showLoading()
                that.setData({
                    likeList: that.data.likeList.concat(res.data.list),
                    totalPages: res.data.pages
                });
            }
        });
    },
    onLoad: function (options) {
        this.getLikeList();
    },
    goSearch: function () {

    },
    loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.getLikeList()
    }
});