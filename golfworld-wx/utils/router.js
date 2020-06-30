let PAGES =
    {
        "productDetail": 'pages/product/product'
    }

function go(url, parm) {
    if (null == page) throw 'page can not be null'
    if (parm != undefined) {
        url = url +'?'
        let index = 0
        parm.forEach((key, value) => {
            if (index > 0) {
                url = url+'&'
            }
            url = url+key+'='+value
            index += index
        })
    }

    this.wx.navigateTo({})
}


module.exports = {
    go,
    PAGES
}