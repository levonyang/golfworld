// 上传组件 基于https://github.com/Tencent/weui-wxss/tree/master/src/example/uploader
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({
    data: {
        comment: {
            star: 3,
            valueId: 0,
            content: '1',
            type: 1,
            lightspot: '',
            drawback: '',
            hasPicture: false,
            picUrls: []
        },
        files: [],
        content: '',
        orderId: 0,
        type: 0,
        valueId: 0,
        picUrls: []
    },
    chooseImage: function (e) {
        if (this.data.files.length >= 5) {
            util.showErrorToast('只能上传五张图片')
            return false;
        }

        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
                that.upload(res);
            }
        })
    },
    upload: function (res) {
        var that = this;
        const uploadTask = wx.uploadFile({
            url: api.StorageUpload,
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: function (res) {
                var _res = JSON.parse(res.data);
                if (_res.errno === 0) {
                    var url = _res.data.url
                    that.data.comment.picUrls.push(url)
                    that.data.comment.hasPicture = true
                    that.setData({
                        comment: that.data.comment
                    })
                }
            },
            fail: function (e) {
                wx.showModal({
                    title: '错误',
                    content: '上传失败',
                    showCancel: false
                })
            },
        })

        uploadTask.onProgressUpdate((res) => {
            console.log('上传进度', res.progress)
            console.log('已经上传的数据长度', res.totalBytesSent)
            console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })

    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },

    onLoad: function (options) {
        let that = this;
        // options.valueId = 1181448
        that.data.comment.valueId = options.valueId
        that.setData({
            // type: options.type,
            valueId: options.valueId,
        });
        this.getProductInfo();
    },
    getProductInfo: function () {
        let that = this;
        util.request(api.ProductDetail, {
            id: that.data.valueId
        }).then(function (res) {
            console.log(res)
            if (res.errno === 0) {
                that.setData({
                    product: res.data.info
                })
            }
        })
    },
    onClose: function () {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
            type: '1',
        })
        wx.navigateBack();
    },
    onPost: function () {
        let that = this;
        if (!this.data.comment.content &&
            !this.data.comment.lightspot && !this.data.comment.drawback) {
            util.showErrorToast('请填写评论')
            return false;
        }
        if (that.data.comment.picUrls.length > 0) {
            that.data.comment.picUrls = JSON.stringify(that.data.comment.picUrls)
        } else {
            that.data.comment.picUrls = '[]'
        }
        util.request(api.CommentPost, that.data.comment, 'POST').then(function (res) {
            if (res.errno === 0) {
                wx.showToast({
                    title: '评论成功',
                    complete: function () {
                        // wx.navigateBack({changed: true});
                        wx.navigateTo({
                            url: '../product/product?id=' + that.data.valueId
                        })
                    }
                })
            }
            if (res.errno === 415) {
                wx.showToast(
                    {
                        icon: "none",
                        title: res.errmsg
                    }
                )
            }
        });
    }
    ,
    bindInputValue(event) {
        let that = this
        let value = event.detail.value;
        let type = event.currentTarget.dataset.type;
        if (value && value.length > 1000) {
            return false;
        }
        if (type == 'content') that.data.comment.content = event.detail.value
        this.setData({
            comment: that.data.comment
        })
    }
    ,
    onReady: function () {

    }
    ,
    onShow: function () {
        // 页面显示

    }
    ,
    onHide: function () {
        // 页面隐藏

    }
    ,
    onUnload: function () {
        // 页面关闭

    }
})