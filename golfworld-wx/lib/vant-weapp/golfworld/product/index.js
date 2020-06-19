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
        // productList: {
        //     type: Array,
        //     value: [],
        //     observer: function (productList) {
        //         console.log('productList')
        //         console.log(productList)
        //         this.setData({
        //             productList: productList
        //         })
        //     }
        // },
        rating: String,
        thumb: String,
        lazyLoad: Boolean,
        thumbLink: String,
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
