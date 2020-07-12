const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

//获取应用实例
const app = getApp();

Page({
    data: {
        banner: [
            {
                id: 1,
                name: "合作 谁是你的菜",
                link: "1181026",
                url: "https://qiujutong-1253811604.file.myqcloud.com/setbvlr8ggu00xka7xz0.jpg",
                position: 1,
                content: "合作 谁是你的菜",
                enabled: true,
                addTime: "2018-02-01 00:00:00",
                updateTime: "2020-06-24 12:58:23",
                deleted: false
            },
            {
                id: 2,
                name: "活动 美食节",
                link: "1181021",
                url: "http://yanxuan.nosdn.127.net/bff2e49136fcef1fd829f5036e07f116.jpg",
                position: 1,
                content: "活动 美食节",
                enabled: true,
                addTime: "2018-02-01 00:00:00",
                updateTime: "2020-06-24 12:52:55",
                deleted: false
            },
            {
                id: 3,
                name: "活动 美食节",
                link: "1181021",
                url: "https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg",
                position: 1,
                content: "活动 美食节",
                enabled: true,
                addTime: "2018-02-01 00:00:00",
                updateTime: "2020-06-24 12:52:55",
                deleted: false
            },
        ],
        evaluationList: [
            {
                title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
                hasPrize: true,
                statusText: '未开始',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
                status: 0,
                quota: 5,
                officialPrice: 6666,
                talkingAmount: 104,
                recentTalkUserAvatar: [
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                ],
            },
                  {
                title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
                hasPrize: false,
                statusText: '未开始',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
                status: 0,
                quota: 5,
                officialPrice: 6666,
                talkingAmount: 104,
                recentTalkUserAvatar: [
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                ],
            },
            {
                title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
                hasPrize: true,
                statusText: '申请中',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
                status: 1,
                quota: 5,
                officialPrice: 6666,
                talkingAmount: 104,
                recentTalkUserAvatar: [
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                ],
            },
             {
                title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
                hasPrize: true,
                statusText: '确认中',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
                status: 2,
                quota: 5,
                officialPrice: 6666,
                talkingAmount: 104,
                recentTalkUserAvatar: [
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                ],
            },
            {
                title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
                hasPrize: true,
                isOpen: true,
                statusText: '体验中',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
                status: 3,
                quota: 5,
                officialPrice: 6666,
                talkingAmount: 104,
                recentTalkUserAvatar: [
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                ],
            },
            {
                title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
                hasPrize: true,
                isOpen: true,
                statusText: '已结束',
                picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
                status: 4,
                quota: 5,
                officialPrice: 6666,
                talkingAmount: 104,
                recentTalkUserAvatar: [
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                    'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                ],
            }
        ],
        total: 100,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        circular: true,
        interval: 2000,
        duration: 500,
        newProductIndex: 0,
        newProductTotal: 0,
        newReleaseProduct: ''
    },
    onLoad: function () {

    },
    onReady: function () {
        // 页面渲染完成
    },
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