var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
var user = require('../../../../utils/user.js');
import Poster from '../../../../lib/canvas/poster/poster';

const app = getApp();

Page({

    data: {
        shareImage: '',
        showEditOption: false,
        showBrief: false,
        showLoadMore: false,
        showIcon: false,
        loading: false,
        page: 1,
        type: 3,
        limit: 5,
        total: 0,
        showPopup: false,
        showShare: false,
        id: '',
        content: '',
        ballPackCreator: '',
        product: {},
        comment: {
            star: 0,
            valueId: 0,
            content: '1',
            type: 3,
            lightspot: '',
            drawback: '',
            hasPicture: false,
            picUrls: []
        },
        productList: [],
        ballPack: {},
        userInfo: {
            avatarUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
            nickName: 'allen zhu',
        },
        commentList: [{
            userInfo: {
                avatarUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                nickName: 'allen zhu',
            },
            content: '很好',
            star: 4.7,
            like: 0,
            addTime: '4月15日　15:00'
        },
            {
                userInfo: {
                    avatarUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                    nickName: 'allen zhu',
                },
                content: '很好',
                star: 4.7,
                like: 2,
                addTime: '4月15日　15:00'
            }
        ]
    },
    onCreatePoster() {
        if (!app.globalData.hasLogin) {
            this.goLogin()
            return
        } else {
            let userInfo = wx.getStorageSync('userInfo');
            this.setData({
                userInfo: userInfo,
            });
        }
        let posterConfig = this.posterConfig()
        this.setData({posterConfig: posterConfig}, () => {
            Poster.create(true);    // 入参：true为抹掉重新生成
        });
    },
    posterConfig() {
        const posterConfig = {
            width: 670,
            height: 800,
            backgroundColor: '#fff',
            debug: false,
            pixelRatio: 1,
            texts: [
                {
                    zIndex: 3,
                    x: 187,
                    y: 95,
                    baseLine: 'middle',
                    text: this.data.userInfo.nickName,
                    fontSize: 32,
                    color: '#150c0c',
                },
                {
                    zIndex: 3,
                    x: 187,
                    y: 146,
                    baseLine: 'top',
                    text: '向你推荐一个球包',
                    fontSize: 28,
                    color: '#150c0c',
                },
                {
                    x: 40,
                    y: 488,
                    fontSize: 48,
                    baseLine: 'middle',
                    text: this.data.product.name,
                    width: 444,
                    lineNum: 1,
                    color: '#150c0c',
                    zIndex: 200,
                },
                {
                    x: 293,
                    y: 705,
                    baseLine: 'top',
                    text: '长按识别小程序码查看产品',
                    fontSize: 23,
                    color: '#5C8D96',
                },
            ],
            images: [
                {
                    zIndex: 3,
                    width: 102,
                    height: 102,
                    x: 71,
                    y: 71,
                    borderRadius: 102,
                    url: this.data.userInfo.avatarUrl,
                },
                {
                    width: 112,
                    height: 32,
                    x: 293,
                    y: 659,
                    url: '/static/images/logo.png',
                },
                {
                    width: 726,
                    height: 600,
                    x: 0,
                    y: 0,
                    url: this.data.product.picUrl,
                },
                {
                    width: 104,
                    height: 102,
                    x: 160,
                    y: 645,
                    url: this.data.product.shareUrl,
                },
            ]
        }
        return posterConfig
    },
    saveTap: function () {
        var self = this
        wx.getSetting({
            success(res) {
                //判断是否已授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            //授权成功
                            self.saveShare()
                        },
                        fail: function () {
                            //未授权
                            self.imageErrorAuth()
                        }
                    })
                } else {
                    //已授权直接保存图片
                    self.saveShare()
                }
            },
        })
    },
    onClose: function () {
        this.setData({
            showShare: false,
            showEditOption: false,
        });
    }
    ,
    edit: function () {
        this.setData({
            showEditOption: true,
        });
    }
    ,
    imageErrorAuth() {
        //打开设置必须在按钮点击事件中所以搞一个modal
        wx.showModal({
            title: '提示',
            content: '需要您授权保存至相册',
            showCancel: false,
            success: modalSuccess => {
                wx.openSetting({
                    success(settingData) {
                        if (settingData.authSetting['scope.writePhotosAlbum']) {
                            wx.showModal({
                                title: '提示',
                                content: '获取权限成功,再次保存图片即可',
                                showCancel: false
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '获取权限失败，将无法保存到相册',
                                showCancel: false
                            })
                        }
                    },
                    fail(failData) {
                        console.log("failData", failData)
                    },
                    complete(finishData) {
                        console.log("finishData", finishData)
                    }
                })
            }
        })
    },
    delete() {
        let that = this
        util.request(api.BallPackDelete, {
            id: that.data.id
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                wx.showToast({
                    title: '删除成功',
                    complete: function () {
                        wx.navigateBack()
                    }
                })
            }
        });
    },
    deleteBallPack() {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确认删除球包,确认后无法复原',
            cancelTextText: '取消',
            confirmText: '删除',
            success: function (res) {
                if (res.confirm) {
                    that.delete()
                }
            }
        })
    },
    saveShare: function () {
        let that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImage,
            success: function (res) {
                wx.showModal({
                    title: '生成海报成功',
                    content: '海报已成功保存到相册，可以分享到朋友圈了',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#a78845',
                    success: function (res) {
                        if (res.confirm) {
                            that.setData({
                                showShare: false
                            })
                        }
                    }
                })
            },
            fail: function (res) {
                that.setData({
                    showShare: false
                })
            }
        })
    }
    ,
    inputContent(e) {
        this.setData({
            content: e.detail.value
        });
    }
    ,
    refreshComment: function () {
        this.getCommentList();
    }
    ,
    onPosterSuccess(e) {
        const {detail} = e;
        this.setData({
            showShare: true,
            shareImage: detail
        })
    } ,
    onLoad: function (options) {
        // options.id = 26
        this.setData({
            id: options.id
        })
        this.getBallPack()
        this.getCommentList()
        let userInfo = wx.getStorageSync('userInfo');
        console.log(userInfo)
        this.setData({
            userInfo: userInfo,
        });
    }
    ,
    goEdit() {
        wx.navigateTo({
            url: '../add/add?id=' + this.data.id
        })
    }
    ,
    goAll() {
        wx.navigateTo({
            url: '../all/all'
        })
    }
    ,
    goAdd() {
        wx.navigateTo({
            url: '../add/add'
        })
    }
    ,
    submitReply(e) {
        if (!app.globalData.hasLogin) {
            this.goLogin()
            return
        } else {
            let userInfo = wx.getStorageSync('userInfo');
            this.setData({
                userInfo: userInfo,
            });
        }
        let that = this;
        if (!that.data.content) {
            util.showErrorToast('请填写评论')
            return false;
        }
        that.data.comment.valueId = e.currentTarget.dataset.valueId
        that.data.comment.content = that.data.content
        that.data.comment.picUrls = '[]'
        util.request(api.CommentPost, that.data.comment, 'POST').then(function (res) {
            if (res.errno === 0) {
                wx.showToast({
                    title: '评论成功',
                    complete: function () {
                        that.getCommentList()
                    }
                })
            }
        });
    }
    ,
    addCollectOrNot: function () {
        let that = this;
        util.request(api.CollectAddOrDelete, {
            type: 1,
            valueId: this.data.id
        }, "POST")
            .then(function (res) {
                that.getBallPack()
            });

    }
    ,
    getCommentList() {
        let that = this;

        util.request(api.CommentList, {
            valueId: that.data.id,
            type: that.data.type,
            page: that.data.page,
            limit: that.data.limit
        }).then(function (res) {
            if (res.errno === 0) {
                let commentList = res.data.list
                // if (that.data.commentList.length > 0) {//is same type
                //     if (that.data.commentList[0].type == that.data.type) {
                //         commentList.push.apply(...that.data.commentList)
                //     }
                // }
                that.setData({

                    showLoadMore: that.data.showLoadMore,
                    commentList: commentList,
                });
            }
        });
    },
    getBallPack() {
        wx.showLoading({
            title: '加载中...',
        });
        let that = this
        util.request(api.BallPackDetail, {
            id: that.data.id
        }).then(function (res) {
            wx.hideLoading()
            if (res.errno === 0) {
                that.setData({
                    productList: res.data.productList,
                    product: res.data.productList[0],
                    ballPack: res.data.ballPack,
                    ballPackCreator: res.data.userInfo,
                });
            }
        });
    }
    ,
})
;