var api = require('../../../../config/api.js');
var util = require('../../../../utils/util.js');
var user = require('../../../../utils/user.js');
Page({
    data: {
        id: "",
        productIds: [],
        ballPack: {
            title: '',
            desc: ''
        },
        loading: {
            showLoadMore: true,
            onLoading: false,
            showIcon: true,
        },
        searchProductList: [],
        showAddProduct: false,
        categoryId: 0,
        name: '',
        currentSortType: 'default',
        currentSort: 'release_time',
        currentSortOrder: 'desc',
        isNew: false,
        page: 1,
        limit: 3,
        total: 0,
        edit: false,
        checkedList: []
    },
    isSelected(e) {
        console.log(e)
        this.search()
    },
    searchName(e) {
        if (e.detail == null) {
            e.detail = ''
        }
        let that = this
        that.name = e.detail
        that.setData({
            searchProductList: [],
            name: e.detail
        })
        that.search()
    },
    search() {
        let that = this
        that.showLoading()
        util.request(api.ProductList, {
            name: that.data.name,
            isNew: that.data.isNew,
            page: that.data.page,
            limit: that.data.limit,
            order: that.data.currentSortOrder,
            sort: that.data.currentSort,
            categoryId: that.data.categoryId
        }).then(function (res) {
            if (res.errno === 0) {
                if (that.data.page * that.data.limit >= res.data.total) {
                    that.data.loading.showLoadMore = false
                }
                that.showLoading()
                that.data.searchProductList.push.apply(that.data.searchProductList, res.data.list)
                that.setCheckSelected(that.data.searchProductList)
                that.setData({
                    showLoadMore: that.data.showLoadMore,
                    total: res.data.total
                });
            }
        });
    },
    deleteProduct(e) {
        let that = this
        let checkedList = that.data.checkedList.filter(product => product.id != e.currentTarget.dataset.id)
        that.setData({
            checkedList: checkedList
        })
    },
    addProduct() {
        console.log('1')
        let that = this
        let productIds = []
        that.data.checkedList.forEach(product => {
            productIds.push(product.id)
        })
        that.setData({
            page: 1,
            searchProductList: [],
            productIds: productIds,
            showAddProduct: true
        })
        that.search()
    },
    setCheckSelected(list) {
        let that = this
        let productList = []
        list.forEach(item => {
            let selected = that.data.productIds.indexOf(item.id) > -1
            Object.assign(item, {'selected': selected})
            // if (!item.hasOwnProperty('reason')) {
            Object.assign(item, {'reason': ''})
            // }
            productList.push(item)
            if (selected && that.notInArray(that.data.checkedList, item)) {
                that.data.checkedList.push(item)
            }
        })
        that.setData({
            searchProductList: productList,
            checkedList: that.data.checkedList
        });
    },
    notInArray(array, item) {
        console.log(item)
        let notInArray = true
        array.forEach(el => {
            if (el.id == item.id) {
                notInArray = false
            }
        })
        return notInArray
    },
    checkedProduct(e) {
        let that = this
        that.data.productIds.push(e.currentTarget.dataset.id)
        that.setData({
            productIds: that.data.productIds
        })
        that.setCheckSelected(that.data.searchProductList)
    },
    uncheckedProduct(e) {
        let that = this
        let productIds = that.data.productIds
        productIds.splice(productIds.indexOf(e.currentTarget.dataset.id), 1)
        that.setData({
            productIds: productIds
        })
        that.setCheckSelected(that.data.searchProductList)
    },
    showLoading() {
        let that = this
        that.data.loading.showIcon = true
        that.data.loading.onLoading = false
        that.setData({
            loading: that.data.loading,
        })
    }
    ,
    hideLoading() {
        let that = this
        that.data.loading.showIcon = true
        that.data.loading.onLoading = false
        that.setData({
            loading: that.data.loading,
        })
    }
    ,
    onLoad: function (options) {
        this.setData({
            productIds: []
        })
        if (options.id != undefined) {
            this.setData({
                id: options.id
            })
            this.getBallPack()
        }
    },
    getBallPack() {
        let that = this
        util.request(api.BallPackDetail, {
            id: that.data.id
        }).then(function (res) {
            if (res.errno === 0) {
                let ids = []
                res.data.productList.forEach(product => {
                    ids.push(product.id)
                })
                that.setData({
                    edit: true,
                    checkedList: res.data.productList,
                    productIds: ids,
                    ballPack: res.data.ballPack,
                });
            }
        });
    },
    inputTitle(e) {
        let that = this
        that.data.ballPack.title = e.detail.value
        this.setData({
            ballPack: that.data.ballPack
        })
    },
    inputProductReason(e) {
        let that = this
        let id = e.currentTarget.dataset.id
        let checkedList = []
        that.data.checkedList.forEach(product => {
            if (product.id == id) {
                product.reason = e.detail.value
            }
            checkedList.push(product)
        })
        this.setData({
            checkedList: checkedList,
        })
    },
    inputDesc(e) {
        let that = this
        that.data.ballPack.desc = e.detail.value
        this.setData({
            ballPack: that.data.ballPack
        })
    },
    loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.search()
    },
    ok() {
        this.setData({
            showAddProduct: false
        })
    },
    onClose() {
        wx.navigateBack()
    },
    onPost() {
        let that = this
        let productList = []
        if (this.data.productIds.length < 3) {
            util.showErrorToast('请至少3个产品');
            return false;
        }
        if (this.data.productIds.length > 20) {
            util.showErrorToast('产品不能超过20个');
            return false;
        }
        that.data.checkedList.forEach(product => {
            productList.push({valueId: product.id, reason: product.reason})
        })
        let url = that.data.edit ? api.UpdateBallPack : api.AddBallPack
        util.request(url, {
            backPack: {
                id: that.data.id,
                title: that.data.ballPack.title,
                desc: that.data.ballPack.desc,
                productList: productList
            }
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                wx.navigateTo({
                    url: '/pages/ucenter/ballpack/ballpack'
                })
            }
        });
    }
});
