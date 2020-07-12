package org.golfworld.wx.dto.decorator;

import org.golfworld.db.domain.Product;
import org.golfworld.db.service.CommentService;
import org.golfworld.db.service.LikeService;
import org.golfworld.db.service.ProductService;
import org.golfworld.db.util.CommonTypeConstant;
import org.golfworld.db.util.LikeTypeConstant;
import org.golfworld.wx.dto.ProductInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductInfoDecorator extends ProductService {

    @Autowired
    private CommentService commentService;

    @Autowired
    private LikeService likeService;


    public ProductInfo convert(Product product, Integer userId) {
        ProductInfo productInfo = new ProductInfo();
        Integer productId = product.getId();
        BeanUtils.copyProperties(product, productInfo);
        int commonAmount = commentService.count(CommonTypeConstant.PRODUCT_COMMENT, productId);
        productInfo.setCommentAmount(commonAmount);
        float score = commentService.countScore(productId);
        DecimalFormat df = new DecimalFormat("#.0");
        productInfo.setScore(Float.valueOf(df.format(score)));
        int talkingAmount = commentService.count(CommonTypeConstant.PRODUCT_TALKING, productId);
        productInfo.setTalkingAmount(talkingAmount);
        productInfo.setRecentTalkUserAvatar(commentService.getRecentTalkUserAvatar(productId, 5));
        Integer userHasLike = 0;
        if (userId != null) {
            userHasLike = likeService.count(userId, productId, LikeTypeConstant.LIKE);
        }
        productInfo.setUserHaslike(userHasLike);
        if (null != product.getReleaseTime()) {
            Period duration = Period.between(LocalDate.now(), productInfo.getReleaseTime());
            productInfo.setReleaseTimeAfterStr((int) duration.getDays());
        }
        productInfo.setLike(likeService.count(productId));
        return productInfo;
    }

    public List<ProductInfo> convertList(List<Product> productList, Integer userId) {
        List<ProductInfo> collect = productList.stream().parallel().map(product -> {
            ProductInfo productInfo = this.convert(product, userId);
            return productInfo;
        }).collect(Collectors.toList());
        return collect;
    }
       public List<ProductInfo> convertList(List<Product> productList) {
        List<ProductInfo> collect = productList.stream().parallel().map(product -> {
            ProductInfo productInfo = this.convert(product,null);
            return productInfo;
        }).collect(Collectors.toList());
        return collect;
    }


}
