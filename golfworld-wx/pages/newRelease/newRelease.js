const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

Page({
    data: {
        newProductList: [],
        comingProductList: [],
        categoryId: 0,
        currentSortType: 'default',
        currentSort: 'release_time',
        currentSortOrder: 'desc',
        isNew: false,
        page: 1,
        limit: 3,
        total: 0,
        loading:false,
        showLoadMore: true,
        showIcon: true,

    },
    onLoad: function (options) {
        this.getNewList()
        this.getComingList()
    },
    getNewList() {
        let that = this
        that.setData({
            showIcon: false,
            loading: true
        })
        util.request(api.ProductList, {
            isNew: that.data.isNew,
            page: that.data.page,
            limit: that.data.limit,
            order: that.data.currentSortOrder,
            sort: that.data.currentSort,
            categoryId: that.data.categoryId
        }).then(function (res) {
            if (res.errno === 0) {
                if (that.data.page * that.data.limit >= res.data.total) {
                    that.data.showLoadMore = false
                }
                that.data.newProductList.push.apply(that.data.newProductList, res.data.list)
                that.setData({
                    showIcon: true,
                    loading: false,
                    showLoadMore: that.data.showLoadMore,
                    newProductList: that.data.newProductList,
                    total: res.data.total
                });
            }
        });
    },
    getComingList() {
        let that = this
        util.request(api.ProductList, {
            isNew: true,
            page: 1,
            limit: 3,
            order: that.data.currentSortOrder,
            sort: that.data.currentSort,
            categoryId: that.data.categoryId
        }).then(function (res) {
            if (res.errno === 0) {
                let comingList = that.convertDate(res.data.list, true)
                that.setData({
                    comingProductList: comingList
                });
            }
        });
    },
    like(e) {
        let that = this
        util.request(api.like, {
            actionType:  1 ,
            valueId: e.currentTarget.dataset.id
        },'POST').then(function (res) {
            if (res.errno === 0) {
                that.getComingList()
            }
        });

    },
    goProduct: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../product/product?id=' + id
        });

    },
    convertDate(list, isChinese) {
        let productList = []
        list.forEach(product => {
            if (product.releaseTime) {
                console.log(product.releaseTime)
                let releaseTime = product.releaseTime.split('-')
                let releaseTimeStr = releaseTime[1] + '月' + releaseTime[2] + '号'
                Object.assign(product, {releaseTimeStr: releaseTimeStr})
            }
            productList.push(product)
        })
        return productList;
    },
    loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.getNewList()
    }
})
;