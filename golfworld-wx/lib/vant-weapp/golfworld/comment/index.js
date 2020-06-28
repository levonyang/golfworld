import {link} from '../../mixins/link';
import {VantComponent} from '../../common/component';

VantComponent({
    classes: [],
    mixins: [link],
    props: {
        comment: Object,
        hasStar: {
            type: Boolean,
            value: true
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
            console.log('changeProduct')
            console.log(val)
            this.setData({
                product: val
            });
        }
    }

});
