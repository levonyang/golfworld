const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
// const fecha = require('../../../utils/fecha.js');
const dateFormat = require('../../../utils/dateFormat.js');
const STATUS = require('../../../config/evaluationStatus.js');


//获取应用实例
const app = getApp();

Page({
    data: {
        evaluation: {
            statusText: STATUS.CONFIRMING.text,
            // status:STATUS.APPLYING.code,
            status: STATUS.CONFIRMING.code,
            term: 28,
            title: "INOVAI 6.0 Crescent Neck Left Handed Putter",
            desc: '描述描述描述描述描述描述',
            content: '本期的众测产品是「魅族17系列」，魅族17系列5G梦想旗舰，在工业设计、硬件性能和影像拍摄等方面都设定了新标准； 本次众测产品含魅族17、魅族17Pro共4本期的众测产品是「魅族17系列」，魅族17系列5G梦想旗舰，在工业设计、硬件性能和影像拍摄等方面都设定了新标准； 本次众测产品含魅族17、魅族17Pro共4本期的众测产品是「魅族17系列」，魅族17系列5G梦想旗舰，在工业设计、硬件性能和影像拍摄等方面都设定了新标准； 本次众测产品含魅族17、魅族17Pro共4本期的众测产品是「魅族17系列」，魅族17系列5G梦想旗舰，在工业设计、硬件性能和影像拍摄等方面都设定了新标准； 本次众测产品含魅族17、魅族17Pro共4',
            hasPrize: false,
            picUrl: 'https://qiujutong-1253811604.file.myqcloud.com/umxr20ypyu12bafzcmx2.jpg',
            quota: 5,
            officialPrice: 6666,
            effectiveTime: '11:11',
            talkingAmount: 9999,
            more: false,
            recentTalkUserAvatar: [
                'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
            ],
        },
        taskList: [
            {
                id: 1,
                dateRangeWeek: '今天',
                from: '2020-05-25',
                to: '2020-05-26',
                title: '外观设计',
                content: '外观设计'
            },
            {
                id: 2,
                from: '2020-05-27',
                to: '2020-05-28',
                title: '佩戴体验',
                content: '佩戴体验'
            },
            {

                id: 3,
                from: '2020-05-29',
                to: '2020-05-30',
                title: '游戏模式',
                content: '游戏模式'
            },
            {
                id: 4,
                from: '2020-05-31',
                to: '2020-05-01',
                title: '电池续航',
                content: '电池续航'
            },
            {
                id: 5,
                from: '2020-05-02',
                to: '2020-05-03',
                title: '核心体',
                content: '核心体'
            }
        ],
        selected: {},
        experiencerList: [
            {
                nickname: 'tony',
                avatarUrl: 'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                profession: '自媒体人'
            },
            {
                nickname: 'tony',
                avatarUrl: 'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                profession: '摄影师'
            },
            {
                nickname: 'tony',
                avatarUrl: 'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                profession: '吃鸡玩家'
            },
            {
                nickname: 'tony',
                avatarUrl: 'https://qiujutong-1253811604.file.myqcloud.com/hjjwe1fzjr2x9unzq8f3.jpg',
                profession: '教练'
            }
        ],
        commentList: [],
        total: 100,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        circular: true,
        interval: 2000,
        duration: 500,
        type: 1,
        newProductIndex: 0,
        newProductTotal: 0,
        newReleaseProduct: ''
    },
    onLoad: function () {
        let that = this
        that.data.evaluation.officialPrice = util.formatMoney(that.data.evaluation.officialPrice)
        that.data.taskList = this.formatTaskListDate()
        that.setData({
            id: 1181008,
            evaluation: that.data.evaluation,
            taskList: that.data.taskList,
            selected: that.data.taskList[0]
        })
        this.getCommentList()
    },
    getCommentList() {
        let that = this;
        util.request(api.CommentList, {
            valueId: that.data.id,
            type: that.data.type,
        }).then(function (res) {
            if (res.errno === 0) {
                let commentList = []
                res.data.list.forEach(comment => {
                    comment.picUrls = JSON.parse(comment.picUrls)
                    commentList.push(comment)
                })
                that.setData({
                    commentList: commentList,
                });
            }
        });
    },
    tapTask: function (e) {
        let id = e.currentTarget.dataset.id
        let filter = this.data.taskList.filter(task => task.id == id);
        this.setData({
            selected: filter[0]
        })
    },
    formatTaskListDate: function () {
        let that = this
        let taskList = []
        that.data.taskList.forEach(task => {
            let from = task.from
            let to = task.to
            task.from = dateFormat.toDate(from, 'DD')
            task.to = dateFormat.toDate(to, 'DD')
            let fromWeek = dateFormat.toDate(from, 'ddd')
            let toWeek = dateFormat.toDate(to, 'ddd')
            let fromDateWithMon = dateFormat.toDate(to, 'M/DD')
            let toDateWithMon = dateFormat.toDate(to, 'M/DD')
            Object.assign(task, {
                fromWeek: fromWeek, toWeek: toWeek, fromDateWithMon, fromDateWithMon,
                toDateWithMon, toDateWithMon
            })
            taskList.push(task)
        })
        return taskList
    },
    onReady: function () {
        // 页面渲染完成
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
    },
    more: function () {
        let more = !this.data.more
        this.setData({
            more: more
        })

    },
    goRule: function () {
        wx.navigateTo({
            url: "./rule/rule"
        });
    }
})