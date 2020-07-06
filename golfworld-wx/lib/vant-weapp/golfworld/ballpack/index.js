import {link} from '../../mixins/link';
import {VantComponent} from '../../common/component';

VantComponent({
    classes: [
        'num-class',
        'desc-class',
        'thumb-class',
        'title-class',
        'price-class',
        'origin-price-class',
    ],
    mixins: [link],
    props: {
        ballPack: Object,
        border:Boolean,
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
        thumbMode: {
            type: String,
            value: 'aspectFit'
        }
    },
    methods: {
        onClickThumb() {
            this.jumpLink('thumbLink');
        },
        changeBallPack(val) {
            this.setData({
                ballPack: val
            });
        },

        goBallPack: function (e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/ucenter/ballpack/detail/detail?id=' + id
            });

        },
    }

});
