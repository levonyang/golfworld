var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
    data: {
        userInfo: {}
    },
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
            userInfo: userInfo
        })
    },
    authAddress: function () {
        let that = this;
        wx.chooseAddress({
            lang: 'zh_CN',
            success(res) {
                console.log(res)
                let address = res.provinceName + res.cityName + res.countyName + res.detailInfo
                that.setData({
                    "userInfo.address": address,
                })
            }
        })
    },
    getPhoneNumber: function (e) {
        let that = this;
        util.request(api.AuthBindPhone, {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                wx.showToast({
                    title: '绑定手机号码成功',
                    icon: 'success',
                    duration: 2000
                });
                that.setData({'userInfo.mobile': res.data.mobile}
                )
            }
        });
    },
    inputNickName: function (e) {
        this.setData({
            "userInfo.nickName": e.detail
        })
    }, inputDesc: function (e) {
        this.setData({
            "userInfo.desc": e.detail
        })
    }, inputProfession: function (e) {
        this.setData({
            "userInfo.profession": e.detail
        })
    }, inputNickName: function (e) {
        this.setData({
            "userInfo.nickName": e.detail
        })
    },
    save: function () {
        let that = this;
        util.request(api.UpdateAccount, that.data.userInfo
            , 'POST').then(function (res) {
            console.log(res)
            if (res.errno === 0) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                });
            }
        });
    }
});