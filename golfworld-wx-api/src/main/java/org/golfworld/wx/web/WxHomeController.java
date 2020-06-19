package org.golfworld.wx.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.system.SystemConfig;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.db.domain.Category;
import org.golfworld.db.domain.Product;
import org.golfworld.db.service.*;
import org.golfworld.db.util.CommonTypeConstant;
import org.golfworld.wx.annotation.LoginUser;
import org.golfworld.wx.dto.ProductInfo;
import org.golfworld.wx.service.HomeCacheManager;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * 首页服务
 */
@RestController
@RequestMapping("/wx/home")
@Validated
public class WxHomeController {
    private final Log logger = LogFactory.getLog(WxHomeController.class);

    @Autowired
    private AdService adService;

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private TopicService topicService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CommentService commentService;


    private final static ArrayBlockingQueue<Runnable> WORK_QUEUE = new ArrayBlockingQueue<>(9);

    private final static RejectedExecutionHandler HANDLER = new ThreadPoolExecutor.CallerRunsPolicy();

    private static ThreadPoolExecutor executorService = new ThreadPoolExecutor(9, 9, 1000, TimeUnit.MILLISECONDS, WORK_QUEUE, HANDLER);

    @GetMapping("/cache")
    public Object cache(@NotNull String key) {
        if (!key.equals("golfworld_cache")) {
            return ResponseUtil.fail();
        }

        // 清除缓存
        HomeCacheManager.clearAll();
        return ResponseUtil.ok("缓存已清除");
    }

    /**
     * 首页数据
     *
     * @param userId 当用户已经登录时，非空。为登录状态为null
     * @return 首页数据
     */
    @GetMapping("/index")
    public Object index(@LoginUser Integer userId) {
        //优先从缓存中读取
        if (HomeCacheManager.hasData(HomeCacheManager.INDEX)) {
            return ResponseUtil.ok(HomeCacheManager.getCacheData(HomeCacheManager.INDEX));
        }
        ExecutorService executorService = Executors.newFixedThreadPool(10);

        Callable<List> bannerListCallable = () -> adService.queryIndex();

        Callable<List> channelListCallable = () -> categoryService.queryChannel();


        Callable<List> newProductListCallable = () -> productService.queryByNew(0, SystemConfig.getNewLimit());

        Callable<List> hotProductListCallable = () -> productService.queryByHot(0, SystemConfig.getHotLimit());

        Callable<List> brandListCallable = () -> brandService.query(0, SystemConfig.getBrandLimit());

        Callable<List> topicListCallable = () -> topicService.queryList(0, SystemConfig.getTopicLimit());


        Callable<List> floorProductListCallable = this::getCategoryList;

        FutureTask<List> bannerTask = new FutureTask<>(bannerListCallable);
        FutureTask<List> channelTask = new FutureTask<>(channelListCallable);
        FutureTask<List> newProductListTask = new FutureTask<>(newProductListCallable);
        FutureTask<List> hotProductListTask = new FutureTask<>(hotProductListCallable);
        FutureTask<List> brandListTask = new FutureTask<>(brandListCallable);
        FutureTask<List> topicListTask = new FutureTask<>(topicListCallable);
        FutureTask<List> floorProductListTask = new FutureTask<>(floorProductListCallable);

        executorService.submit(bannerTask);
        executorService.submit(channelTask);
        executorService.submit(newProductListTask);
        executorService.submit(hotProductListTask);
        executorService.submit(brandListTask);
        executorService.submit(topicListTask);
        executorService.submit(floorProductListTask);

        Map<String, Object> entity = new HashMap<>();
        try {
            entity.put("banner", bannerTask.get());
            entity.put("channel", channelTask.get());
            entity.put("newProductList", newProductListTask.get());
            entity.put("hotProductList", hotProductListTask.get());
            entity.put("brandList", brandListTask.get());
            entity.put("topicList", topicListTask.get());
            entity.put("floorProductList", floorProductListTask.get());
            //缓存数据
            HomeCacheManager.loadData(HomeCacheManager.INDEX, entity);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            executorService.shutdown();
        }
        return ResponseUtil.ok(entity);
    }

    private List<Map> getCategoryListByL1() {
        List<Map> categoryList = new ArrayList<>();
        List<Category> catL1List = categoryService.queryL1WithoutRecommend(0, SystemConfig.getCatlogListLimit());
        for (Category catL1 : catL1List) {
            List<Product> categoryProduct = productService.queryByCategory(catL1.getId(), 0, SystemConfig.getCatlogMoreLimit());
            Map<String, Object> catProduct = new HashMap<>();
            catProduct.put("id", catL1.getId());
            catProduct.put("name", catL1.getName());
            catProduct.put("productList", categoryProduct);
            categoryList.add(catProduct);
        }
        return categoryList;
    }

    private List<Map> getCategoryList() {
        List<Map> categoryList = new ArrayList<>();
        List<Category> catL1List = categoryService.queryL1WithoutRecommend(0, SystemConfig.getCatlogListLimit());
        for (Category catL1 : catL1List) {
            List<Category> catL2List = categoryService.queryByPid(catL1.getId());
            List<Integer> l2List = new ArrayList<>();
            for (Category catL2 : catL2List) {
                l2List.add(catL2.getId());
            }
            List<Product> categoryProduct;
            if (l2List.size() == 0) {
                categoryProduct = new ArrayList<>();
            } else {
                categoryProduct = productService.queryByCategory(l2List, 0, SystemConfig.getCatlogMoreLimit());
            }
            List<ProductInfo> productInfos = getProductCommonAndTalk(categoryProduct);
            Map<String, Object> catProduct = new HashMap<>();
            catProduct.put("id", catL1.getId());
            catProduct.put("name", catL1.getName());
            catProduct.put("productList", productInfos);
            categoryList.add(catProduct);
        }
        return categoryList;
    }

    private List<ProductInfo> getProductCommonAndTalk(List<Product> categoryProduct) {
        List<ProductInfo> collect = categoryProduct.stream().map(product -> {
            ProductInfo productInfo = new ProductInfo();
            Integer productId = product.getId();
            BeanUtils.copyProperties(product, productInfo);
            int commonAmount = commentService.count(CommonTypeConstant.PRODUCT_COMMENT, productId);
            productInfo.setCommentAmount(commonAmount);
            float score = commentService.countScore(productId);
            productInfo.setScore(score);
            int talkingAmount = commentService.count(CommonTypeConstant.PRODUCT_TALKING, productId);
            productInfo.setTalkingAmount(talkingAmount);
            productInfo.setRecentTalkUserAvatar(commentService.getRecentTalkUserAvatar(productId, 5));
            return productInfo;
        }).collect(Collectors.toList());
        return collect;
    }

    /**
     * 商城介绍信息
     *
     * @return 商城介绍信息
     */
    @GetMapping("/about")
    public Object about() {
        Map<String, Object> about = new HashMap<>();
        about.put("name", SystemConfig.getMallName());
        about.put("address", SystemConfig.getMallAddress());
        about.put("phone", SystemConfig.getMallPhone());
        about.put("qq", SystemConfig.getMallQQ());
        about.put("longitude", SystemConfig.getMallLongitude());
        about.put("latitude", SystemConfig.getMallLatitude());
        return ResponseUtil.ok(about);
    }
}