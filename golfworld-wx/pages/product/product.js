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
        ballPack: [],
        pack: {
            picUrls: [
                'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2443852970,3855863032&fm=26&gp=0.jpg',
                'http://img5.imgtn.bdimg.com/it/u=1145485238,1285470591&fm=11&gp=0.jpg',

            ],
            name: '2020最受欢迎的高尔夫球杆',
            total: '10'
        },
        product: {
            id: 1181022,
            name: 'TITLEIST TS3 DRIVER',
            picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/thetfafo79mw3jx0ihki.jpg',
            recentTalkUserAvatar: [
                'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2443852970,3855863032&fm=26&gp=0.jpg',
                'http://img5.imgtn.bdimg.com/it/u=1145485238,1285470591&fm=11&gp=0.jpg',
                'http://img3.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=26&gp=0.jpg'
            ],

            brief: '杆身最长、杆面角度最小的木杆，主要用来在梯台上开出长距离球。它通常也是球包里最昂贵的球杆，有的高达上万元。职业选手用发球木在梯台上能打出300码左右。 大多数发球木的杆面角度在7度（打出低弹道）至12度（打出高弹道）之间，杆面的甜蜜点有的达到6平方英寸。为了使球击出更远，有些发球木采用了类似蹦床反弹效果的杆面，但这种木杆一般都会被规则禁止使用，比如Callaway ERC发球木就被禁止使用。 R&A是欧洲高尔夫规则的制定机构，他们和美国高尔夫球协会出版了一份关于球杆和球的新规则，就旨在禁止高科技带来的破坏',
            //brief: '测试',
            score: 8,
            commentAmount: 7,
            talkingAmount: 5,
            shareUrl: 'https://lc-i0j7ktvk.cn-n1.lcfile.com/d719fdb289c955627735.jpg',
            like: 1
        },
        commentList: [],
        shareImage: '',
        showBrief: false,
        showLoadMore: true,
        showIcon: true,
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
        }
        let posterConfig = this.posterConfig()
        console.log(posterConfig)
        this.setData({posterConfig: posterConfig}, () => {
            Poster.create(true);    // 入参：true为抹掉重新生成
        });
    },
    posterConfig() {
        let userInfo = wx.getStorageSync('userInfo')
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
                    text: userInfo.nickName,
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
                    url: userInfo.avatarUrl,
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
        // wx.previewImage({
        //     current: detail,
        //     urls: [detail]
        // })
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
    // 保存分享图
    saveShare: function () {
        let that = this;
        wx.downloadFile({
            url: that.data.shareImage,
            success: function (res) {
                console.log(res)
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
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
            fail: function () {
                console.log('fail')
            }
        })
    },

    // 获取商品信息
    getProductInfo: function () {
        let that = this;
        util.request(api.ProductDetail, {
            id: that.data.id
        }).then(function (res) {
            console.log(res)
            if (res.errno === 0) {
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
    },

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
    },
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

    },
    goLogin() {
        wx.navigateTo({
            url: "/pages/auth/login/login"
        });
    },
    commentPopup: function () {
        this.setData({
            showPopup: true
        })
    },
    eventDraw() {
        let that = this
        if (!app.globalData.hasLogin) {
            this.goLogin()
            return
        }
        let userInfo = wx.getStorageSync('userInfo')
        wx.showLoading({
            title: '加载中...',
            mask: true
        })

        console.log(userInfo)
        console.log(that.data.product)
        that.setData({
            painting: {
                width: 375,
                height: 555,
                clear: true,
                views: [
                    {
                        type: 'image',
                        url: userInfo.avatarUrl,
                        zIndex: 13,
                        top: 27.5,
                        left: 29,
                        width: 55,
                        height: 55
                    },
                    {
                        type: 'image',
                        url: 'https://qiujutong-1253811604.file.myqcloud.com/96fiwe7kg85xk4ryzinr.jpeg',
                        top: 27.5,
                        left: 29,
                        width: 55,
                        height: 55
                    },
                    {
                        type: 'text',
                        content: userInfo.nickName,
                        fontSize: 16,
                        color: '#402D16',
                        textAlign: 'left',
                        top: 33,
                        left: 96,
                        bolder: true
                    },
                    {
                        type: 'text',
                        content: '向你推荐一个产品',
                        fontSize: 15,
                        color: '#563D20',
                        textAlign: 'left',
                        top: 59.5,
                        left: 96
                    },
                    {
                        type: 'image',
                        url: that.data.product.picUrl,
                        top: 0,
                        left: 42.5,
                        width: 600,
                        height: 400
                    },
                    {
                        type: 'image',
                        url: 'https://qiujutong-1253811604.file.myqcloud.com/96fiwe7kg85xk4ryzinr.jpeg',
                        top: 443,
                        left: 85,
                        width: 68,
                        height: 68
                    },
                    {
                        type: 'text',
                        content: that.data.product.name,
                        fontSize: 16,
                        lineHeight: 21,
                        color: '#383549',
                        textAlign: 'left',
                        top: 336,
                        left: 44,
                        width: 287,
                        MaxLineNumber: 2,
                        breakWord: true,
                        bolder: true
                    },
                    {
                        type: 'text',
                        content: '长按识别图中二维码帮我砍个价呗~',
                        fontSize: 14,
                        color: '#383549',
                        textAlign: 'left',
                        top: 460,
                        left: 165.5,
                        lineHeight: 20,
                        MaxLineNumber: 2,
                        breakWord: true,
                        width: 125
                    }
                ]
            }
        })
        setTimeout((function callback() {
            this.setData({
                showShare: true
            });
        }).bind(this), 600);
    },
    eventSave() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.shareImage,
            success(res) {
                wx.showToast({
                    title: '保存图片成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
    eventGetImage(event) {
        let that = this
        wx.hideLoading()
        const {tempFilePath, errMsg} = event.detail
        if (errMsg === 'canvasdrawer:ok') {
            that.setData({
                showShare: true,
                shareImage: tempFilePath
            })
        }
    },
    onLoad: function (options) {
        this.widget = this.selectComponent('.widget')
        // 页面初始化 options为页面跳转所带来的参数
        let that = this
        that.data.productList = [that.data.product, that.data.product, that.data.product]
        that.data.ballPack = [that.data.pack, that.data.pack, that.data.pack]
        // that.data.ballPack = [that.data.pack]
        this.setData({
            productList: that.data.productList,
            ballPack: that.data.ballPack
        })
        // options.id = 1181022
        if (options.id) {
            this.setData({
                id: parseInt(options.id)
            });
            this.getProductInfo();
            this.getProductRelated()
            this.getCommentList()
        }


    },
    goProduct: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../product/product?id=' + id
        });

    },
    goParameter: function () {
        let that = this
        console.log(that.data)
        wx.navigateTo({
            url: '../product/parameter/parameter?valueId=' + that.id + '&parameter='
                + JSON.stringify(that.data.attribute)
        });
    },
    getCommentList() {
        let that = this;
        that.setData({
            showIcon: false,
            loading: true
        })
        util.request(api.CommentList, {
            valueId: that.data.id,
            type: 0,
            page: that.data.page,
            limit: that.data.limit
        }).then(function (res) {
            if (that.data.page * that.data.limit >= res.data.total) {
                that.data.showLoadMore = false
            }
            if (res.errno === 0) {
                that.data.commentList.push(...res.data.list)
                that.setData({
                    showIcon: true,
                    loading: false,
                    showLoadMore: that.data.showLoadMore,
                    commentList: that.data.commentList,
                });
            }
        });
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
    },

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
    drawImage1() {
        let self = this;
        self.drawImage1 = new Wxml2Canvas({
            width: 340, // 宽， 以iphone6为基准，传具体数值，其他机型自动适配
            height: 210, // 高
            element: 'canvas1',
            background: '#f0f0f0',
            progress(percent) {
            },
            finish(url) {
                console.log(url)
                // let imgUrl = self.data.imgUrl;
                // imgUrl.push(url);

                self.setData({
                    imgUrl: url
                })
            },
            error(res) {
            }
        });

        let data = {
            list: [{
                type: 'wxml',
                class: '.share__canvas1 .draw_canvas', // draw_canvas指定待绘制的元素
                limit: '.share__canvas1', // 限定绘制元素的范围，取指定元素与它的相对位置
                x: 0,
                y: 0
            }]
        }

        this.drawImage1.draw(data);
    },
    drawCanvas() {
        let self = this;
        const systemInfo = wx.getSystemInfoSync();
        console.log(systemInfo);
        this.drawImage1 = new Wxml2Canvas({
            width: systemInfo.screenWidth, // 宽， 以iphone6为基准，传具体数值，其他机型自动适配
            height: systemInfo.screenHeight, // 高
            element: 'canvas1',
            background: '#fff',
            progress(percent) {
            },
            finish(url) {
                console.log(url);
                wx.saveImageToPhotosAlbum({
                    filePath: url,
                    success(res) {
                        wx.showToast({
                            title: '名片已经保存到相册中',
                        })
                    },
                    fail: function (err) {
                        console.log(err);
                    }
                })
            },
            error(res) {
            }
        });
        let data = {
            list: [{
                type: 'wxml',
                class: '.share__canvas1 .draw_canvas', // draw_canvas指定待绘制的元素
                limit: '.share__canvas1', // 限定绘制元素的范围，取指定元素与它的相对位置
                x: 0,
                y: 0
            }]
        }
        this.drawImage1.draw(data);
    },

    goCommentPost: function (e) {
        let id = e.currentTarget.dataset.id;
        this.setData({
            showPopup: false
        })
        wx.navigateTo({
            url: '../commentPost/commentPost?valueId=' + id
        });
    },
    goTalk: function (e) {
        this.setData({
            showPopup: false
        })
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../product/product?id=' + id
        });

    },
    onClose: function () {
        this.setData({
            showPopup: false
        })
    },
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

    cutNumber: function () {
        this.setData({
            number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
        });
    },
    addNumber: function () {
        this.setData({
            number: this.data.number + 1
        });
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭

    },
    switchAttrPop: function () {
        if (this.data.openAttr == false) {
            this.setData({
                openAttr: !this.data.openAttr
            });
        }
    },
    closeAttr: function () {
        this.setData({
            openAttr: false,
        });
    },
    closeShare: function () {
        this.setData({
            showShare: false,
        });
    },
    openCartPage: function () {
        wx.switchTab({
            url: '/pages/cart/cart'
        });
    },
    onReady: function () {
        // 页面渲染完成

    }, loadMore() {
        let that = this
        that.data.page += 1
        this.setData({
                page: that.data.page,
            }
        )
        this.getCommentList()
    }


})