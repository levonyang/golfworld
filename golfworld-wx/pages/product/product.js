var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');
// import Wxml2Canvas from '../../utils/Wml2Canvas/index';
const {wxml, style} = require('./demo.js')

const app = getApp();
import Poster from '../../lib/canvas/poster/poster';


Page({
    data: {
        title: '',
        barBg: '',//#ff6600
        fixed: false,
        color: '#000000',//#ffffff
        touchStartY: 0,//触摸开始的Y坐标
        toggleBarShow: false,
        backStyle: 'normal',
        backEvent: false,
        backHomeEvent: false,
        src: '',
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
            title: '我的主页', //导航栏 中间的标题
        },
        shareUrl: '',
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
        showPopup: false,
        showShare: false,
        userHasCollect: 0,
        userHasLike: 0,
        userHasUnlike: 0,
        productTalkList: [{
            avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
            nickname: 'hugo',
            title: '透過Ball Fitting可以找出最適合你的高爾夫球',
            picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/w6lga6f7wpisvyxz03il.jpg'
        },
            {
                avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                nickname: 'hugo',
                title: '透過Ball Fitting可以找出最適合你的高爾夫球',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/mgyk2it0d878prsdp4bc.jpg'
            }
        ],
        productList: [],
        ballPackList: [],
        product: {},
        type: '0',
        commentList: [],
        shareImage: '',
        showBrief: false,
        showLoadMore: false,
        showIcon: false,
        loading: false,
        page: 1,
        limit: 5,
        total: 0,
        selectedComment: true,
    },
    /**
     * 异步生成海报
     */
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
    goBallPack() {
        wx.navigateTo({
            url: "/pages/ucenter/ballpack/ballpack"
        });
    },
    goSearch: function (e) {
        wx.navigateTo({
            url: '/pages/search/search?brandId=' + this.data.product.brandId
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
                    text: '向你推荐一个产品',
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

    onCreateOtherPoster() {
        this.setData({posterConfig: posterConfig.jdConfig}, () => {
            Poster.create(true);    // 入参：true为抹掉重新生成
        });
    },
    onPosterSuccess(e) {
        const {detail} = e;
        this.setData({
            showShare: true,
            shareImage: detail
        })
    },


    // 页面分享
    onShareAppMessage: function () {
        let that = this;
        return {
            title: that.data.product.name,
            desc: '唯爱与美食不可辜负',
            path: '/pages/product/product?id=' + this.data.id
        }
    },
    showBrief: function () {
        let showBrief = !this.data.showBrief
        this.setData({
            showBrief: showBrief
        })

    },
    shareFriendOrCircle: function () {
        //var that = this;
        if (this.data.openShare === false) {
            this.setData({
                openShare: !this.data.openShare
            });
        } else {
            return false;
        }
    },
    handleSetting: function (e) {
        var that = this;
        // console.log(e)
        if (!e.detail.authSetting['scope.writePhotosAlbum']) {
            wx.showModal({
                title: '警告',
                content: '不授权无法保存',
                showCancel: false
            })
            that.setData({
                canWrite: false
            })
        } else {
            wx.showToast({
                title: '保存成功'
            })
            that.setData({
                canWrite: true
            })
        }
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
    // 保存分享图
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
    },
    handlerGobackClick: function () {
        wx.navigateBack()
    }
    ,
    handlerGohomeClick: function () {
        wx.switchTab({
            url: "/pages/index/index"
        });
    }
    ,
// 获取商品信息
    getProductInfo: function () {
        let that = this;
        util.request(api.ProductDetail, {
            id: that.data.id
        }).then(function (res) {
            if (res.errno === 0) {
                res.data.info.officialPrice = that.formatMoney(res.data.info.officialPrice)
                that.setData({
                    product: res.data.info,
                    attribute: res.data.attribute,
                    issueList: res.data.issue,
                    comment: res.data.comment,
                    brand: res.data.brand,
                    userHasCollect: res.data.userHasCollect,
                    userHasLike: res.data.userHasLike,
                    userHasUnlike: res.data.userHasUnlike,
                    //     specificationList: res.data.specificationList,
                    //     productList: res.data.productList,
                    //     shareImage: res.data.shareImage,
                    //     checkedSpecPrice: res.data.info.retailPrice,
                    //     groupon: res.data.groupon,
                    //     canShare: res.data.share,
                });
                //
                // //如果是通过分享的团购参加团购，则团购项目应该与分享的一致并且不可更改
                // if (that.data.isGroupon) {
                //     let groupons = that.data.groupon;
                //     for (var i = 0; i < groupons.length; i++) {
                //         if (groupons[i].id != that.data.grouponLink.rulesId) {
                //             groupons.splice(i, 1);
                //         }
                //     }
                //     groupons[0].checked = true;
                //     //重设团购规格
                //     that.setData({
                //         groupon: groupons
                //     });
                //
                // }
                //
                // if (res.data.userHasCollect == 1) {
                //     that.setData({
                //         collect: true
                //     });
                // } else {
                //     that.setData({
                //         collect: false
                //     });
                // }
                //
                // WxParse.wxParse('productDetail', 'html', res.data.info.detail, that);
                //获取推荐商品
                that.getProductRelated();
            }
        });
    }
    ,

// 获取推荐商品
    getProductRelated: function () {
        let that = this;
        util.request(api.ProductRelated, {
            id: that.data.id
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    relatedProduct: res.data.list,
                });
            }
        });
    }
    ,
    likeOrUnlike(e) {
        let that = this
        util.request(api.like, {
            actionType: e.currentTarget.dataset.actionType,
            valueId: e.currentTarget.dataset.id
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                that.getProductInfo()
            }
        });

    }
    ,
    goLogin() {
        wx.navigateTo({
            url: "/pages/auth/login/login"
        });
    }
    ,
    commentPopup: function () {
        this.setData({
            showPopup: true
        })
    },
    onLoad: function (options) {
        // this.data.product.price = this.formatMoney(this.data.product.price)
        // this.setData({
        //     product: this.data.product
        // })

        // 页面初始化 options为页面跳转所带来的参数
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2000
        });
        let that = this
        that.data.productList = [that.data.product, that.data.product, that.data.product]
        // let type = options.type == undefined ? 0 : options.type
        this.setData({
            // type: type,
            productList: that.data.productList,
        })
        // options.id = 1181449
        if (options.id) {
            this.setData({
                id: parseInt(options.id)
            });
            this.getProductInfo();
            this.getProductRelated()
            this.getBallPack()
            this.getCommentList()
            wx.hideToast();
        }
        if (app.globalData.hasLogin) {
            let userInfo = wx.getStorageSync('userInfo');
            this.setData({
                userInfo: userInfo,
            });
        }

    }
    ,
    getBallPack: function () {
        let that = this;
        util.request(api.BallPackList, {
            page: 1,
            limit: 3
        }).then(function (res) {

            if (res.errno === 0) {
                that.setData({
                    ballPackList: res.data.list,
                });

            }
        });
    }
    ,
    goProduct: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../product/product?id=' + id
        });

    }
    ,
    goParameter: function () {
        let that = this
        console.log(that.data)
        wx.navigateTo({
            url: '../product/parameter/parameter?valueId=' + that.id + '&parameter='
                + JSON.stringify(that.data.attribute)
        });
    }
    ,
    getCommentList() {
        let that = this;
        // that.setData({
        //     showIcon: false,
        //     loading: true
        // })
        util.request(api.CommentList, {
            valueId: that.data.id,
            type: that.data.type,
            // page: that.data.page,
            // limit: that.data.limit
        }).then(function (res) {
            // if (that.data.page * that.data.limit >= res.data.total) {
            //     that.data.showLoadMore = false
            // }
            if (res.errno === 0) {
                let commentList = res.data.list
                // if (that.data.commentList.length > 0) {//is same type
                //     if (that.data.commentList[0].type == that.data.type) {
                //         commentList.push.apply(...that.data.commentList)
                //     }
                // }
                that.setData({
                    // showIcon: true,
                    // loading: false,
                    showLoadMore: that.data.showLoadMore,
                    commentList: commentList,
                });
            }
        });
    },
    refreshComment:function(){
       this.getCommentList();
    },
    convertCommentDate: function (list, isChinese) {
        let commentList = []
        list.forEach(item => {
            let comment = JSON.parse(JSON.stringify(item))
            if (comment.addTime) {
                let addDateTime = comment.addTime.split(' ')
                let date = addDateTime[0].split('-')
                let dateStr = date[1] + '月' + date[2] + '号'
                let time = addDateTime[1].split(':')
                let timeStr = time[0] + ':' + time[1]
                let dateTimeStr = dateStr + ' ' + timeStr
                Object.assign(comment, {addTime: dateTimeStr})
            }
            if (comment.hasOwnProperty('replyList')
                && comment.replyList.length > 0) {
                let replyList = this.convertCommentDate(comment.replyList)
                Object.assign(comment, {replyList: replyList})
            }
            commentList.push(comment)
        })
        return commentList
    },
    onShow: function () {
        // 页面显示
        var that = this;
        //     util.request(api.CartProductCount).then(function (res) {
        //         if (res.errno === 0) {
        //             that.setData({
        //                 cartProductCount: res.data
        //             });
        //         }
        //     });
    }
    ,

//添加或是取消收藏
    addCollectOrNot: function () {
        let that = this;
        util.request(api.CollectAddOrDelete, {
            type: 0,
            valueId: this.data.id
        }, "POST")
            .then(function (res) {
                if (that.data.userHasCollect == 1) {
                    that.setData({
                        collect: false,
                        userHasCollect: 0
                    });
                } else {
                    that.setData({
                        collect: true,
                        userHasCollect: 1
                    });
                }

            });

    },
    goCommentPost: function (e) {
        let id = e.currentTarget.dataset.id;
        this.setData({
            showPopup: false
        })
        wx.navigateTo({
            url: '../commentPost/commentPost?valueId=' + id
        });
    }
    ,
    goTalk: function (e) {
        this.setData({
            showPopup: false
        })
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../talk/talk?valueId=' + id
        });

    },
    changeComment: function (e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            type: type,
            commentList: [],
            page: 1,
            total: 0,
            limit: 5
        })
        this.getCommentList()
    },
    onClose: function () {
        this.setData({
            showPopup: false
        })
    }
    ,
// //添加到购物车
// addToCart: function () {
//     var that = this;
//     if (this.data.openAttr == false) {
//         //打开规格选择窗口
//         this.setData({
//             openAttr: !this.data.openAttr
//         });
//     } else {
//
//         //提示选择完整规格
//         if (!this.isCheckedAllSpec()) {
//             util.showErrorToast('请选择完整规格');
//             return false;
//         }
//
//         //根据选中的规格，判断是否有对应的sku信息
//         let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
//         if (!checkedProductArray || checkedProductArray.length <= 0) {
//             //找不到对应的product信息，提示没有库存
//             util.showErrorToast('没有库存');
//             return false;
//         }
//
//         let checkedProduct = checkedProductArray[0];
//         //验证库存
//         if (checkedProduct.number <= 0) {
//             util.showErrorToast('没有库存');
//             return false;
//         }
//
//         //添加到购物车
//         util.request(api.CartAdd, {
//             productId: this.data.product.id,
//             number: this.data.number,
//             productId: checkedProduct.id
//         }, "POST")
//             .then(function (res) {
//                 let _res = res;
//                 if (_res.errno == 0) {
//                     wx.showToast({
//                         title: '添加成功'
//                     });
//                     that.setData({
//                         openAttr: !that.data.openAttr,
//                         cartProductCount: _res.data
//                     });
//                     if (that.data.userHasCollect == 1) {
//                         that.setData({
//                             collect: true
//                         });
//                     } else {
//                         that.setData({
//                             collect: false
//                         });
//                     }
//                 } else {
//                     util.showErrorToast(_res.errmsg);
//                 }
//
//             });
//     }
//
// },

    onHide: function () {
        // 页面隐藏

    }
    ,
    onUnload: function () {
        // 页面关闭

    },
    closeShare: function () {
        this.setData({
            showShare: false,
        });
    }
    ,
    goBallPackDetail(e) {
        console.log(e)
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({

            url: '../ucenter/ballpack/detail/detail?id=' + e.currentTarget.dataset.id
        })
    },
    onReady: function () {
        // 页面渲染完成
    }
    ,
    loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.getCommentList()
    }
    ,
    formatMoney: function (amount, decimalCount = 0, decimal = ".", thousands = ",") {
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


})