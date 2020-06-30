package org.golfworld.wx.web;

import com.github.pagehelper.PageInfo;
import com.sun.istack.NotNull;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.util.JacksonUtil;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.db.domain.BallPack;
import org.golfworld.db.domain.BallPackProduct;
import org.golfworld.db.domain.Product;
import org.golfworld.db.domain.UserVo;
import org.golfworld.db.service.BallPackProductService;
import org.golfworld.db.service.BallPackService;
import org.golfworld.db.service.ProductService;
import org.golfworld.db.service.UserService;
import org.golfworld.wx.annotation.LoginUser;
import org.golfworld.wx.dto.ProductInfo;
import org.golfworld.wx.dto.decorator.ProductInfoDecorator;
import org.golfworld.wx.vo.BallPackVo;
import org.golfworld.wx.vo.BallProductVo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户访问足迹服务
 */
@RestController
@RequestMapping("/wx/ballPack")
public class WxBallPcakController {
    private final Log logger = LogFactory.getLog(WxBallPcakController.class);

    @Autowired
    private BallPackService ballPackService;

    @Autowired
    private BallPackProductService ballPackProductService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductInfoDecorator productInfoDecorator;

    @Autowired
    private UserService userService;

    /**
     *
     */
    @PostMapping("/submit")
    public Object submit(@LoginUser Integer userId, @RequestBody String body) {
        if (userId == null) {
            return ResponseUtil.unlogin();
        }
        if (body == null) {
            return ResponseUtil.badArgument();
        }

//        String title = JacksonUtil.parseString(body, "title");
//        String desc = JacksonUtil.parseString(body, "desc");
        BallProductVo ballPackVo = JacksonUtil.parseObject(body, "backPack", BallProductVo.class);
        if (ballPackVo.getTitle() == null) {
            return ResponseUtil.badArgument();
        }
        BallPack ballPack = new BallPack();
        BeanUtils.copyProperties(ballPackVo, ballPack);
        ballPack.setUserId(userId);
        ballPackService.add(ballPack);
        for (BallPackProduct ballPackProduct : ballPackVo.getProductList()) {
            ballPackProduct.setBallPackId(ballPack.getId());
            ballPackProductService.add(ballPackProduct);
        }
        return ResponseUtil.ok(ballPack);
    }


    /**
     * 商品详情页面“用户关注”商品
     */
    @GetMapping("ballPack/product/list")
    public Object ballPack(
                            @LoginUser Integer userId ,
                            Integer valueId,
                           @RequestParam(defaultValue = "1") Integer page,
                           @RequestParam(defaultValue = "10") Integer limit) {

        List<BallPackProduct> ballPackProducts = ballPackProductService.queryByAddTime(valueId, page, limit);
        PageInfo<BallPackProduct> pagedList = PageInfo.of(ballPackProducts);

        List<ProductInfo> list = ballPackProducts.stream().map(ballPack -> {
            Product product = productService.findById(ballPack.getId());
            if (null != product) {
                ProductInfo productInfo = productInfoDecorator.convert(product,userId);
                return productInfo;
            }
            return null;
        }).filter(productInfo -> null != productInfo).collect(Collectors.toList());
        Map<String, Object> entity = new HashMap<>();
        entity.put("list", list);
        entity.put("pages", pagedList.getPages());
        return ResponseUtil.ok(entity);
    }

    /**
     * 　我的球包列表
     */
    @RequestMapping("/list")
    public Object list(@LoginUser Integer userId,
                       @RequestParam(defaultValue = "false") boolean all,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit) {
        List<BallPack> ballPacks = ballPackService.queryByAddTime(userId, all, page, limit);
        PageInfo<BallPack> ballPackPagedList = PageInfo.of(ballPacks);

        List<BallPackVo> collect = ballPacks.stream().map(ballPack -> {
            BallPackVo ballPackVo = new BallPackVo();
            BeanUtils.copyProperties(ballPack, ballPackVo);
            List<BallPackProduct> list = ballPackProductService.findByBallPackId(ballPack.getId());
            PageInfo<BallPackProduct> pagedList = PageInfo.of(list);
            ballPackVo.setTotal(pagedList.getTotal());
            if (list.size() > 0) {
                Integer productId = list.get(0).getValueId();
                Product product = productService.findById(productId);
                String picUrl = product.getPicUrl();
                ballPackVo.setPicUrl(picUrl);
            }
            BeanUtils.copyProperties(ballPack, ballPackVo);

            return ballPackVo;
        }).collect(Collectors.toList());
        Map<String, Object> entity = new HashMap<>();
        entity.put("list", collect);
        entity.put("pages", ballPackPagedList.getPages());
        entity.put("total", ballPackPagedList.getTotal());
        return ResponseUtil.ok(entity);
    }

    /**
     *
     */
    @GetMapping("/detail")
    public Object detail(@LoginUser Integer userId, @NotNull Integer id) {
        BallPack ballPack = ballPackService.findById(id);
        List<BallPackProduct> list = ballPackProductService.findByBallPackId(ballPack.getId());
        PageInfo<BallPackProduct> pagedList = PageInfo.of(list);
        BallPackVo ballPackVo = new BallPackVo();
        BeanUtils.copyProperties(ballPack, ballPackVo);
        ballPackVo.setTotal(pagedList.getTotal());
        List<ProductInfo> productList = list.stream().map(ballPackProduct -> {
            Product product = productService.findById(ballPackProduct.getValueId());
            ProductInfo productInfo = productInfoDecorator.convert(product,userId);
            productInfo.setReason(ballPackProduct.getReason());
            return productInfo;
        }).collect(Collectors.toList());
        UserVo userInfo = userService.findUserVoById(ballPack.getUserId());
        Map<String, Object> entity = new HashMap<>();
        entity.put("ballPack", ballPackVo);
        entity.put("productList", productList);
        entity.put("userInfo", userInfo);
        return ResponseUtil.ok(entity);
    }

}