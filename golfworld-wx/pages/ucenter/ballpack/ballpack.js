const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');

Page({
    data: {
        pack: { },
        ballPackList: [],
        productIds: []

    },
    onLoad: function (options) {

    },
    onShow: function () {
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
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: 'detail/detail?id=' + e.currentTarget.dataset.id
        })
    }
});