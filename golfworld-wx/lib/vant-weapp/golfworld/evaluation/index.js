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
        evaluationList: Array,
        rating: String,
        thumb: String,
        total:Number,
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
        goEvaluation: function (e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/evaluation/detail/detail?id=' + id
            });

        },
    }

});
