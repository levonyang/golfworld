const wxml = `
     <view>
        <image class="avatar" src="https://qiujutong-1253811604.file.myqcloud.com/57q0dq13hkp9yzv6rtdo.png"></image>  
        <view>
            <view>tony</view>
            <view>给你分享了一个好物</view>
        </view>
    </view>
        
      <image class="img" src="https://qiujutong-1253811604.file.myqcloud.com/57q0dq13hkp9yzv6rtdo.png"></image>
</view>
`

const style = {
    container: {
        width: 300,
        height: 200,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ccc',
        alignItems: 'center',
    },
    avatar:{
        width: 100,
        height: 70,
        borderRadius: 50,
    },
    itemBox: {
        width: 80,
        height: 60,
    },
    red: {
        backgroundColor: '#ff0000'
    },
    green: {
        backgroundColor: '#00ff00'
    },
    blue: {
        backgroundColor: '#0000ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        width: 80,
        height: 60,
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    img: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
}

module.exports = {
    wxml,
    style
}
