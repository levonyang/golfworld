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
        product: Object,
        rating: String,
        thumb: String,
        starColor: {
            type: String,
            value: '#ffd21e'
        },
        lazyLoad: Boolean,
        isReview: Boolean,
        isTalking: Boolean,
        isTag: Boolean,
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
        changeProduct(val) {
            this.setData({
                product: val
            });
        },
        goProduct: function (e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/product/product?id=' + id
            });

        },
    }

});
