var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
    data: {
        keyword: '',
        searchStatus: false,
        productList: [],
        helpKeyword: [],
        focus: true,
        historyKeyword: [],
        categoryFilter: false,
        currentSort: 'name',
        currentSortType: 'default',
        currentSortOrder: 'desc',
        filterCategory: [],
        defaultKeyword: {},
        hotKeyword: [],
        brand1: {
            picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/r3ixi785yoku14grr4cc.png',
            desc: 'Created by renowned shaft designer Kim Braly and forged from Tour player feedback, the KBS Tour Series features the most advanced steel shaft technology in the industry'
        },
        brand: {},
        page: 1,
        limit: 10,
        keywordList: [
            {keyword: '球杆', is_hot: '1'},
            {keyword: '球杆', is_hot: '1'},
            {keyword: '球杆', is_hot: '1'},
        ],
        brandId: '',
        categoryId: 0
    },
    //事件处理函数
    closeSearch: function () {
        wx.navigateBack()
    },
    clearKeyword: function () {
        this.setData({
            keyword: '',
            searchStatus: false
        });
    },
    onLoad: function (options) {
        if (options.brandId !=undefined) {
            this.setData({
                focus: false,
                brandId: parseInt(options.brandId)
            });
            this.getProductList()
        }

        this.getSearchKeyword();
    },
    onShow: function () {
    },
    getSearchKeyword() {
        let that = this;
        util.request(api.SearchIndex).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    // historyKeyword: res.data.historyKeywordList,
                    // defaultKeyword: res.data.defaultKeyword,
                    // hotKeyword: res.data.hotKeywordList
                    historyKeyword: that.data.keywordList,
                    defaultKeyword: '木杆',
                    hotKeyword: that.data.keywordList
                });
            }
        });
    }
    ,

    inputChange: function (e) {
        this.setData({
            keyword: e.detail.value,
            searchStatus: false
        });

        if (e.detail.value) {
            this.getHelpKeyword();
        }
    }
    ,
    getHelpKeyword: function () {
        let that = this;
        util.request(api.SearchHelper, {
            keyword: that.data.keyword
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    helpKeyword: res.data
                });
            }
        });
    }
    ,
    inputFocus: function () {

        this.setData({
            searchStatus: false,
            productList: []
        });

        if (this.data.keyword) {
            this.getHelpKeyword();
        }

    }
    ,
    clearHistory: function () {
        this.setData({
            historyKeyword: []
        })

        util.request(api.SearchClearHistory, {}, 'POST')
            .then(function (res) {
                console.log('清除成功');
            });
    }
    ,
    getProductList: function () {
        // wx.showToast({
        //     title: '加载中...',
        //     icon: 'loading',
        // });

        let that = this;
        util.request(api.ProductList, {
            keyword: that.data.keyword,
            page: that.data.page,
            limit: that.data.limit,
            sort: that.data.currentSort,
            order: that.data.currentSortOrder,
            brandId: that.data.brandId,
            categoryId: that.data.categoryId
        }).then(function (res) {

            // wx.hideLoading()
            if (res.errno === 0) {
                that.setData({
                    searchStatus: true,
                    categoryFilter: false,
                    productList: res.data.list,
                    brand: res.data.brand
                });
            }
            // setTimeout(() => function hideLoading() {
            // }.bind(that), 800);
            //重新获取关键词
            // that.getSearchKeyword();
        });
    }
    ,
    onKeywordTap: function (event) {
        this.getSearchResult(event.target.dataset.keyword);

    }
    ,
    getSearchResult(keyword) {
        if (keyword === '') {
            keyword = this.data.defaultKeyword.keyword;
        }
        this.setData({
            keyword: keyword,
            page: 1,
            categoryId: 0,
            productList: []
        });
        this.getProductList();
    }
    ,
    openSortFilter: function (event) {
        let currentId = event.currentTarget.id;
        switch (currentId) {
            case 'categoryFilter':
                this.setData({
                    categoryFilter: !this.data.categoryFilter,
                    currentSortType: 'category',
                    currentSort: 'add_time',
                    currentSortOrder: 'desc'
                });
                break;
            case 'priceSort':
                let tmpSortOrder = 'asc';
                if (this.data.currentSortOrder == 'asc') {
                    tmpSortOrder = 'desc';
                }
                this.setData({
                    currentSortType: 'price',
                    currentSort: 'retail_price',
                    currentSortOrder: tmpSortOrder,
                    categoryFilter: false
                });

                this.getProductList();
                break;
            default:
                //综合排序
                this.setData({
                    currentSortType: 'default',
                    currentSort: 'name',
                    currentSortOrder: 'desc',
                    categoryFilter: false,
                    categoryId: 0,
                });
                this.getProductList();
        }
    }
    ,
    selectCategory: function (event) {
        let currentIndex = event.target.dataset.categoryIndex;
        let filterCategory = this.data.filterCategory;
        let currentCategory = null;
        for (let key in filterCategory) {
            if (key == currentIndex) {
                filterCategory[key].selected = true;
                currentCategory = filterCategory[key];
            } else {
                filterCategory[key].selected = false;
            }
        }
        this.setData({
            filterCategory: filterCategory,
            categoryFilter: false,
            categoryId: currentCategory.id,
            page: 1,
            productList: []
        });
        this.getProductList();
    }
    ,
    onKeywordConfirm(event) {
        this.getSearchResult(event.detail.value);
    }
})