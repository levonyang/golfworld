/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * Promise封装wx.login
 */
function login() {
    return new Promise(function (resolve, reject) {
        wx.login( {
                lang: 'zh_CN',
                success: function (res) {
                    if (res.code) {
                        console.log(res)
                        resolve(res);
                    } else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);
                }
            });
    });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
    return new Promise(function (resolve, reject) {
        return login().then((res) => {
            //登录远程服务器
            util.request(api.AuthLoginByWeixin, {
                code: res.code,
                userInfo: userInfo
            }, 'POST').then(res => {
                if (res.errno === 0) {
                    //存储用户信息
                    wx.setStorageSync('userInfo', res.data.userInfo);
                    wx.setStorageSync('token', res.data.token);

                    resolve(res);
                } else {
                    reject(res);
                }
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
    return new Promise(function (resolve, reject) {
        // resolve(true);
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
            wx.checkSession({
                success: function () {
                    console.log('success')
                    resolve(true);
                },
                fail: function () {
                    console.log('fail')
                    reject(false);
                }
            })
        } else {
            console.log('checkSession3')
            reject(false);
        }
    });
}

module.exports = {
    loginByWeixin,
    checkLogin,
};