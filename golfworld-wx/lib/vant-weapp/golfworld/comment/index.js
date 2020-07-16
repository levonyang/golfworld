import {link} from '../../mixins/link';
import {VantComponent} from '../../common/component';

var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');

VantComponent({
    classes: [],
    mixins: [link],
    props: {
        // comment: Object,
        comment: {
            type: Object,
            value: {
                star: 0,
                valueId: 0,
                content: '1',
                type: 0,
                lightspot: '',
                drawback: '',
                hasPicture: false,
                picUrls: []
            }
        },
        inProgress: {
            type: Boolean,
            value: false
        },
        nameWithDate: {
            type: Boolean,
            value: false
        },
        nameWithStar: {
            type: Boolean,
            value: true
        },
        hasReply: Boolean,
        total: Number,
        commentList: {
            type: Array,
            // observer: function (newVal, oldV, changePath) {
            //     let that = this
            //     if (!that.data.showImage) return
            //     let commentList = []
            //     newVal.forEach(comment => {
            //         comment.picUrls = JSON.parse(comment.picUrls)
            //         commentList.push(comment)
            //     })
            //     console.log(commentList)
            //     that.setData({
            //         commentList: commentList
            //     })
            // }
        },
        replyId: String,
        content: String,
        hasStar: {
            type: Boolean,
            value: true
        },
        showPopup: {
            type: Boolean,
            value: false
        },
        showImage: {
            type: Boolean,
            value: false
        },
        showReply: {
            type: Boolean,
            value: false
        },
        rating: String,
        thumb: String,
        starColor: {
            type: String,
            value: '#ffd21e'
        },
        lazyLoad: Boolean,
        isReview: Boolean,
        isTalking: Boolean,
        originPrice: String,
        likeList: Array,
        id: String,
        thumbMode: {
            type: String,
            value: 'aspectFit'
        }
    },
//     observers
// :
// {
//     'commentList'
// :
//
//     function (newVal, oldV) {
//         let that = this
//         if (!that.data.showImage) return
//         let commentList = []
//         newVal.forEach(comment => {
//             comment.picUrls = JSON.parse(comment.picUrls)
//             commentList.push(comment)
//         })
//         console.log(commentList)
//         that.setData({
//             commentList: commentList
//         })
//     }
// }
    methods: {
        onClickThumb() {
            this.jumpLink('thumbLink');
        }
        ,
        onClose() {
            showPopup: false
        }
        ,
        changeProduct(val) {
            this.setData({
                product: val
            });
        }
        ,
        likeOrUnlike(e) {
            let that = this
            if (that.data.inProgress) {
                wx.showToast({
                    icon: "none",
                    title: "请勿频繁点击."
                })
                return;
            }
            let isLike = e.currentTarget.dataset.isLike
            let id = e.currentTarget.dataset.id;
            let userHasLike = isLike ? 1 : 0
            let like = userHasLike > 0 ? 1 : -1
            let commentList = []
            console.log(that.data.commentList)
            that.data.commentList.forEach(comment => {
                if (id == comment.id) {
                    comment.userHasLike = userHasLike
                    comment.like = comment.like + like
                }
                let replyList = []
                if (comment.replyList) {
                    comment.replyList.forEach(reply => {
                        if (reply.id == id) {
                            reply.userHasLike = userHasLike
                            reply.like = reply.like + like
                        }
                        replyList.push(reply)
                    })
                    comment.replyList = replyList

                }
                commentList.push(comment)
            })
            that.setData({
                commentList: commentList,
                inProgress: true
            })
            util.request(api.like, {
                actionType: 1,
                valueId: id
            }, 'POST').then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        inProgress: false
                    })
                    // that.triggerEvent('refreshcommentevent');
                }
            });
        }
        ,
        closeReply() {
            this.setData({
                replyId: ''
            });
        }
        ,
        reply(e) {
            this.setData({
                replyTo: e.currentTarget.dataset.replyId,
                replyId: e.currentTarget.dataset.id
            });
        }
        ,
        inputContent(e) {
            console.log(e)
            this.setData({
                content: e.detail.value
            });
        }
        ,
        submitReply(e) {
            let that = this;
            if (!that.data.content) {
                util.showErrorToast('请填写评论')
                return false;
            }
            that.data.comment.replyTo = e.currentTarget.dataset.replyTo
            that.data.comment.type = e.currentTarget.dataset.type
            that.data.comment.valueId = e.currentTarget.dataset.valueId
            that.data.comment.content = that.data.content
            that.data.comment.picUrls = '[]'
            util.request(api.CommentPost, that.data.comment, 'POST').then(function (res) {
                if (res.errno === 0) {
                    wx.showToast({
                        title: '评论成功',
                        complete: function () {
                            that.triggerEvent('refreshcommentevent');
                            that.setData({
                                replyId: ''
                            });
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
        moreOption(e) {
            console.log(e)
            this.setData({
                showPopup: true,
                id: e.currentTarget.dataset.id,
                content: e.currentTarget.dataset.content
            })
        }
        ,
        copyComment(e) {
            let that = this
            wx.setClipboardData({
                data: this.data.content,
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) {
                            wx.showToast({
                                title: '复制成功'
                            })
                            that.setData({
                                content: '',
                                showPopup: false,
                            })
                        }
                    })
                }
            })
        }
        ,
        deleteComment(e) {
            let that = this
            util.request(api.CommentDelete,
                {id: that.data.id}
                , 'POST').then(function (res) {
                if (res.errno === 0) {
                    wx.showToast({
                        title: '删除成功',
                        complete: function () {
                            that.triggerEvent('refreshcommentevent');
                            that.setData({
                                content: '',
                                id: '',
                                showPopup: false,
                            });
                        }
                    })
                }
            });
            this.setData({
                content: '',
                showPopup: false,
            })

        }
        ,
        cancel(e) {
            this.setData({
                content: '',
                id: '',
                showPopup: false,
            })
        }
    }
    ,
})
;
