const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');

Page({
    data: {
        pack: {
            picUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
            name: '2020最受欢迎的高尔夫球杆',
            total: '10'
        },
        ballPackList: [],
        productIds: []

    },
    onLoad: function (options) {
        // if (null != options.productIds) {
        //     this.setData(
        //         {
        //             productIds: JSON.parse(options.productIds)
        //         })
        // }
        this.getBallPack()

    },
    goSearch: function () {
        wx.navigateTo({
            url: 'all/all'
        })
    },
    getBallPack: function () {
        let that = this;
        util.request(api.BallPackList, {}).then(function (res) {

            if (res.errno === 0) {
                that.setData({
                    ballPackList: res.data.list,
                });
                if (that.data.ballPackList.length == 0) {
                    that.setData({
                        empty: true
                    })
                }
            }
        });
    },
    onAdd: function (e) {
        wx.navigateTo({
            url: '/pages/ucenter/ballpack/add/add'
        })
    },
    goBallPackDetail(e) {
        wx.navigateTo({
            url: 'detail/detail?id=' + e.currentTarget.dataset.id
        })
    }
});