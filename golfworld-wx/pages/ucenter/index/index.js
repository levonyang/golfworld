var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({
    data: {
        userInfo: {
            nickName: '点击登录',
            avatarUrl: ''
        },
        like: 0,
        collect: 0,
        footPrint: 0,
        hasLogin: false
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function () {

    },
    onShow: function () {

        //获取用户的登录信息
        if (app.globalData.hasLogin) {
            let that = this;
            util.request(api.UserIndex).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        like: res.data.like,
                        collect: res.data.collect,
                        footPrint: res.data.footPrint
                    });
                }
            });
            let userInfo = wx.getStorageSync('userInfo');
            this.setData({
                userInfo: userInfo,
                hasLogin: true
            });
        }

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    goLogin() {
        if (!this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
    },
    goProfile() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/profile/profile"
            });
        }
    },
    goMember() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/integral/integral"
            });
        }
    },
    goAttention() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/attention/attention"
            });
        }
    },
    goCollect() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/collect/collect"
            });
        }
    },
    goLike() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/like/like"
            });
        }
    },
    goFeedback() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/feedback/feedback"
            });
        }
    },
    goOrder() {
        if (this.data.hasLogin) {
            try {
                wx.setStorageSync('tab', 0);
            } catch (e) {

            }
            console.log('login success')
            wx.navigateTo({
                url: "/pages/ucenter/index/index"
            });
        } else {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
    },
    goCollect() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/collect/collect"
            });
        } else {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
        ;
    },
    goFeedback(e) {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/feedback/feedback"
            });
        } else {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
        ;
    },
    goFootprint() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/footprint/footprint"
            });
        } else {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
        ;
    },
    goBallPack() {
        wx.navigateTo({
            url: "/pages/ucenter/ballpack/ballpack"
        });
    },
    goAddress() {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/address/address"
            });
        } else {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
        ;
    },
    bindPhoneNumber: function (e) {
        if (e.detail.errMsg !== "getPhoneNumber:ok") {
            // 拒绝授权
            return;
        }

        if (!this.data.hasLogin) {
            wx.showToast({
                title: '绑定失败：请先登录',
                icon: 'none',
                duration: 2000
            });
            return;
        }

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
            }
        });
    },
    goAfterSale: function () {
        if (this.data.hasLogin) {
            wx.navigateTo({
                url: "/pages/ucenter/aftersaleList/aftersaleList"
            });
        } else {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        }
        ;
    },
    aboutUs: function () {
        wx.navigateTo({
            url: '/pages/about/about'
        });
    },
    goHelp: function () {
        wx.navigateTo({
            url: '/pages/help/help'
        });
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (!res.confirm) {
                    return;
                }

                util.request(api.AuthLogout, {}, 'POST');
                app.globalData.hasLogin = false;
                wx.removeStorageSync('token');
                wx.removeStorageSync('userInfo');
                wx.reLaunch({
                    url: '/pages/index/index'
                });
            }
        })

    }
})