var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {

    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function convertDate(date, isChinese) {
    let datas = date.split('-')
    let dateTimeStr = datas[1] + '月' + datas[2] + '号'
    return dateTimeStr
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-wx-Token': wx.getStorageSync('token')
            },
            success: function (res) {

                if (res.statusCode == 200) {

                    if (res.data.errno == 501) {
                        // 清除登录相关内容
                        try {
                            wx.removeStorageSync('userInfo');
                            wx.removeStorageSync('token');
                        } catch (e) {
                            // Do something when catch error
                        }
                        // 切换到登录页面
                        wx.navigateTo({
                            url: '/pages/auth/login/login'
                        });
                    } else {
                        resolve(res.data);
                    }
                } else {
                    reject(res.errMsg);
                }

            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}

function redirect(url) {

    //判断页面是否需要登录
    if (false) {
        wx.redirectTo({
            url: '/pages/auth/login/login'
        });
        return false;
    } else {
        wx.redirectTo({
            url: url
        });
    }
}

function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png'
    })
}

function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    formatMoney,
    formatTime,
    request,
    redirect,
    showErrorToast
}