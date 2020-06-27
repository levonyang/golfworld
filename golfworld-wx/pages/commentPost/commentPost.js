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
            type:0,
            lightspot: '',
            drawback: '',
            hasPicture: false,
            picUrls: []
        },
        orderId: 0,
        type: 0,
        valueId: 0,
        orderProduct: {},
        content: '',
        lightspot: '',
        drawback: '',
        stars: [0, 1, 2, 3, 4],
        star: 5,
        starText: '十分满意',
        picUrls: [],
        files: []
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
    onChange: function (e) {
        let that = this
        that.data.comment.star = e.detail
        that.setData({
            comment: that.data.comment
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
    selectRater: function (e) {
        var star = e.currentTarget.dataset.star + 1;
        var starText;
        if (star == 1) {
            starText = '很差';
        } else if (star == 2) {
            starText = '不太满意';
        } else if (star == 3) {
            starText = '满意';
        } else if (star == 4) {
            starText = '比较满意';
        } else {
            starText = '十分满意'
        }
        this.setData({
            star: star,
            starText: starText
        })

    },
    onLoad: function (options) {
        var that = this;
        that.data.comment.valueId = options.valueId
        that.setData({
            orderId: options.orderId,
            type: options.type,
            valueId: options.valueId,
            comment: that.data.comment
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
                wx.setNavigationBarTitle({title: res.data.info.name})
                that.setData({
                    product: res.data.info
                })
            }
        })
    },
    getOrderProduct: function () {
        let that = this;
        util.request(api.OrderProduct, {
            orderId: that.data.orderId,
            productId: that.data.valueId
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    orderProduct: res.data,
                });
            }
        });
    }
    ,
    onClose: function () {
        wx.navigateBack();
    }
    ,
    onPost: function () {
        let that = this;
        if (!this.data.comment.content &&
            !this.data.comment.lightspot && !this.data.comment.drawback) {
            util.showErrorToast('请填写评论')
            return false;
        }
        if (that.data.comment.picUrls.length >0 ) {
            that.data.comment.picUrls = JSON.stringify(that.data.comment.picUrls)
        }else {
            that.data.comment.picUrls = '[]'
        }
        console.log(that.data.comment)
        util.request(api.CommentPost, that.data.comment, 'POST').then(function (res) {
            console.log(res)
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
        });
    }
    ,
    bindInputValue(event) {
        let that = this
        let value = event.detail.value;
        let type = event.currentTarget.dataset.type;
        if (value && value.length > 140) {
            return false;
        }
        if (type == 'content') that.data.comment.content = event.detail.value
        if (type == 'lightspot') that.data.comment.lightspot = event.detail.value
        if (type == 'drawback') that.data.comment.drawback = event.detail.value
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