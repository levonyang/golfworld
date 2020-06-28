var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
var user = require('../../../../utils/user.js');

Page({

    data: {
        id: '',
        productList: [{
            id: 1181022,
            name: 'TITLEIST TS3 DRIVER',
            picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/thetfafo79mw3jx0ihki.jpg',
            score: 8,
            tag: ['护眼', '蓝牙4.2', '双线'],
            reason: 'Pro V1，V1X真的是各方面都做得最均衡。怪不得是世界第一球！大赞！\n' +
                '        虽然Callaway：Super Soft打的最软，操控较好，但是1号木击球的声音不会清脆，不稳定。',
        }],
        ballPack: {
            picUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
            title: '2020最受欢迎的高尔夫球杆',
            nickname: 'tony',
            total: '10',
            desc: ' 值得一提的是Callaway3款都用Chrome的球核技术，真的不错！其中 Truvis 把高尔夫球变成足球的图案很是有意思，同时对于击球和推杆很有帮助，还是“米克尔森”用球（不带团案版本）',
            avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2482891506,3188782599&fm=26&gp=0.jpg',
            commentAmount: 5,
            updateTime: '2020-09-00 09:01'
        },
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
    onLoad: function (options) {
        // options.id = 18
        this.setData({
            id: options.id
        })
        this.getBallPack()
    },
    goAll() {
        wx.navigateTo({
            url: '../all/all'
        })
    },
    goAdd() {
        wx.navigateTo({
            url: '../add/add'
        })
    },
    getBallPack() {
        let that = this
        util.request(api.BallPackDetail, {
            id: that.data.id
        }).then(function (res) {
            console.log(res)
            if (res.errno === 0) {
                that.setData({
                    productList: res.data.productList,
                    ballPack: res.data.ballPack,
                    userInfo: res.data.userInfo,
                });
            }
        });
    },
});