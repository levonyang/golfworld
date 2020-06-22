var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');

Page({
    data: {
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
            name: 'TITLEIST TS3 DRIVER',
            picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/thetfafo79mw3jx0ihki.jpg',
            recentTalkUserAvatar: [
                'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2443852970,3855863032&fm=26&gp=0.jpg',
                'http://img5.imgtn.bdimg.com/it/u=1145485238,1285470591&fm=11&gp=0.jpg',
                'http://img3.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=26&gp=0.jpg'
            ],
            commentList: [
                {
                    content: '相当好看',
                    start: 4.5,
                    nickname: 'sam',
                    avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
                    addTime: '2020-06-16'
                }
            ],
            brief: '杆身最长、杆面角度最小的木杆，主要用来在梯台上开出长距离球。它通常也是球包里最昂贵的球杆，有的高达上万元。职业选手用发球木在梯台上能打出300码左右。 大多数发球木的杆面角度在7度（打出低弹道）至12度（打出高弹道）之间，杆面的甜蜜点有的达到6平方英寸。为了使球击出更远，有些发球木采用了类似蹦床反弹效果的杆面，但这种木杆一般都会被规则禁止使用，比如Callaway ERC发球木就被禁止使用。 R&A是欧洲高尔夫规则的制定机构，他们和美国高尔夫球协会出版了一份关于球杆和球的新规则，就旨在禁止高科技带来的破坏',
            //brief: '测试',
            score: 8,
            commentAmount: 7,
            talkingAmount: 5,
            like: 1
        },
        showBrief: false,
        selectedComment:true
    },

    // 页面分享
    onShareAppMessage: function () {
        let that = this;
        return {
            title: that.data.product.name,
            desc: '唯爱与美食不可辜负',
            path: '/pages/index/index?goodId=' + this.data.id
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
                                    console.log('用户点击确定');
                                }
                            }
                        })
                    },
                    fail: function (res) {
                        console.log('fail')
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
            if (res.errno === 0) {
                //
                // let _specificationList = res.data.specificationList
                // // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
                // if (_specificationList.length == 1) {
                //     if (_specificationList[0].valueList.length == 1) {
                //         _specificationList[0].valueList[0].checked = true
                //
                //         // 如果仅仅存在一种货品，那么商品价格应该和货品价格一致
                //         // 这里检测一下
                //         // let _productPrice = res.data.productList[0].price;
                //         let _productPrice = res.data.info.retailPrice;
                //         if (_productPrice != _productPrice) {
                //             console.error('商品数量价格和货品不一致');
                //         }
                //
                //         that.setData({
                //             checkedSpecText: _specificationList[0].valueList[0].value,
                //             tmpSpecText: '已选择：' + _specificationList[0].valueList[0].value,
                //         });
                //     }
                // }
                //
                // that.setData({
                //     product: res.data.info,
                //     attribute: res.data.attribute,
                //     issueList: res.data.issue,
                //     comment: res.data.comment,
                //     brand: res.data.brand,
                //     specificationList: res.data.specificationList,
                //     productList: res.data.productList,
                //     userHasCollect: res.data.userHasCollect,
                //     shareImage: res.data.shareImage,
                //     checkedSpecPrice: res.data.info.retailPrice,
                //     groupon: res.data.groupon,
                //     canShare: res.data.share,
                // });
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
                // //获取推荐商品
                // that.getProductRelated();
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

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this
        that.data.productList = [that.data.product, that.data.product, that.data.product]
        that.data.ballPack = [that.data.pack, that.data.pack, that.data.pack]
        // that.data.ballPack = [that.data.pack]
        this.setData({
            productList: that.data.productList,
            ballPack: that.data.ballPack
        })
        if (options.id) {
            this.setData({
                id: parseInt(options.id)
            });
            this.getProductInfo();
        }

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

    //立即购买（先自动加入购物车）
    addFast: function () {
        var that = this;
        if (this.data.openAttr == false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr
            });
        } else {

            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                util.showErrorToast('请选择完整规格');
                return false;
            }

            //根据选中的规格，判断是否有对应的sku信息
            let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProductArray || checkedProductArray.length <= 0) {
                //找不到对应的product信息，提示没有库存
                util.showErrorToast('没有库存');
                return false;
            }

            let checkedProduct = checkedProductArray[0];
            //验证库存
            if (checkedProduct.number <= 0) {
                util.showErrorToast('没有库存');
                return false;
            }

            //验证团购是否有效
            let checkedGroupon = this.getCheckedGrouponValue();

            //立即购买
            util.request(api.CartFastAdd, {
                productId: this.data.product.id,
                number: this.data.number,
                productId: checkedProduct.id
            }, "POST")
                .then(function (res) {
                    if (res.errno == 0) {

                        // 如果storage中设置了cartId，则是立即购买，否则是购物车购买
                        try {
                            wx.setStorageSync('cartId', res.data);
                            wx.setStorageSync('grouponRulesId', checkedGroupon.id);
                            wx.setStorageSync('grouponLinkId', that.data.grouponLink.id);
                            wx.navigateTo({
                                url: '/pages/checkout/checkout'
                            })
                        } catch (e) {
                        }

                    } else {
                        util.showErrorToast(res.errmsg);
                    }
                });
        }


    },

    //添加到购物车
    addToCart: function () {
        var that = this;
        if (this.data.openAttr == false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr
            });
        } else {

            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                util.showErrorToast('请选择完整规格');
                return false;
            }

            //根据选中的规格，判断是否有对应的sku信息
            let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProductArray || checkedProductArray.length <= 0) {
                //找不到对应的product信息，提示没有库存
                util.showErrorToast('没有库存');
                return false;
            }

            let checkedProduct = checkedProductArray[0];
            //验证库存
            if (checkedProduct.number <= 0) {
                util.showErrorToast('没有库存');
                return false;
            }

            //添加到购物车
            util.request(api.CartAdd, {
                productId: this.data.product.id,
                number: this.data.number,
                productId: checkedProduct.id
            }, "POST")
                .then(function (res) {
                    let _res = res;
                    if (_res.errno == 0) {
                        wx.showToast({
                            title: '添加成功'
                        });
                        that.setData({
                            openAttr: !that.data.openAttr,
                            cartProductCount: _res.data
                        });
                        if (that.data.userHasCollect == 1) {
                            that.setData({
                                collect: true
                            });
                        } else {
                            that.setData({
                                collect: false
                            });
                        }
                    } else {
                        util.showErrorToast(_res.errmsg);
                    }

                });
        }

    },

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
            openShare: false,
        });
    },
    openCartPage: function () {
        wx.switchTab({
            url: '/pages/cart/cart'
        });
    },
    onReady: function () {
        // 页面渲染完成

    }


})