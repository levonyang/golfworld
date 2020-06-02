Page({
    data: {
        show: true,
        showPopup:false
    },
    onLoad: function (options) {

    },
    showOrHide: function () {
        this.show = this.show ? false : true
        this.setData({show: this.show});
    },
    showExplanation:function(){
        this.setData({showPopup:true});
    },
    onClose:function () {
        this.setData({showPopup: false});
    }

});