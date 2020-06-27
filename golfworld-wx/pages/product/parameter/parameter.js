Page({
    data: {
        parameter: [
            {
                name: '参数名称',
                value: '参数值'
            },
            {
                name: '参数名称',
                value: '参数值'
            },
            {
                name: '参数名称',
                value: '参数值'
            }
        ],
        valueId: '',

    },
    onLoad: function (options) {
        let parameter = []
        console.log(options)
        if (options.parameter != 'undefined') {
            parameter = JSON.parse(options.parameter)
        }
        this.setData({
            valueId: options.id,
            parameter: parameter
        })
    },
    feedback: function (e) {
        let that = this
        wx.navigateTo({
            url: '../../ucenter/feedback/feedback?valueId=' + that.data.valueId
        });
    }
});