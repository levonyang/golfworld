package org.golfworld.wx.web;

import com.github.pagehelper.PageInfo;
import com.mysql.jdbc.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.system.SystemConfig;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.core.validator.OrderValidateInterface;
import org.golfworld.core.validator.Sort;
import org.golfworld.db.domain.*;
import org.golfworld.db.service.*;
import org.golfworld.db.util.LikeTypeConstant;
import org.golfworld.wx.annotation.LoginUser;
import org.golfworld.wx.dto.ProductInfo;
import org.golfworld.wx.dto.decorator.ProductInfoDecorator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * 商品服务
 */
@RestController
@RequestMapping("/wx/product")
@Validated
public class WxProductController {
    private final Log logger = LogFactory.getLog(WxProductController.class);

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductInfoDecorator productInfoDecorator;

    @Autowired
    private IssueService productIssueService;

    @Autowired
    private ProductAttributeService productAttributeService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private CollectService collectService;

    @Autowired
    private FootprintService footprintService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SearchHistoryService searchHistoryService;

    @Autowired
    private LikeService likeService;


    private final static ArrayBlockingQueue<Runnable> WORK_QUEUE = new ArrayBlockingQueue<>(9);

    private final static RejectedExecutionHandler HANDLER = new ThreadPoolExecutor.CallerRunsPolicy();

    private static ThreadPoolExecutor executorService = new ThreadPoolExecutor(16, 16, 1000, TimeUnit.MILLISECONDS, WORK_QUEUE, HANDLER);

    /**
     * 商品详情
     * <p>
     * 用户可以不登录。
     * 如果用户登录，则记录用户足迹以及返回用户收藏信息。
     *
     * @param userId 用户ID
     * @param id     商品ID
     * @return 商品详情
     */
    @GetMapping("detail")
    public Object detail(@LoginUser Integer userId, @NotNull Integer id) {
        // 商品信息
        Product info = productService.findById(id);

        // 商品属性
        Callable<List> productAttributeListCallable = () -> productAttributeService.queryByGid(id);
        // 商品问题，这里是一些通用问题
        Callable<List> issueCallable = () -> productIssueService.querySelective("", 1, 4, "", "");

        // 商品品牌商
        Callable<Brand> brandCallable = () -> {
            Integer brandId = info.getBrandId();
            Brand brand;
            if (brandId == 0) {
                brand = new Brand();
            } else {
                brand = brandService.findById(info.getBrandId());
            }
            return brand;
        };

        // 评论
        Callable<Map> commentsCallable = () -> {
            List<Comment> comments = commentService.queryProductByGid(id, 0, 2);
            List<Map<String, Object>> commentsVo = new ArrayList<>(comments.size());
            long commentCount = PageInfo.of(comments).getTotal();
            for (Comment comment : comments) {
                Map<String, Object> c = new HashMap<>();
                c.put("id", comment.getId());
                c.put("addTime", comment.getAddTime());
                c.put("content", comment.getContent());
                c.put("adminContent", comment.getAdminContent());
                User user = userService.findById(comment.getUserId());
                c.put("nickname", user == null ? "" : user.getNickname());
                c.put("avatar", user == null ? "" : user.getAvatar());
                c.put("picList", comment.getPicUrls());
                commentsVo.add(c);
            }
            Map<String, Object> commentList = new HashMap<>();
            commentList.put("count", commentCount);
            commentList.put("data", commentsVo);
            return commentList;
        };


        // 用户收藏
        int userHasCollect = 0;
        int userHasLike = 0;
        int userHasUnlike = 0;
        if (userId != null) {
            userHasCollect = collectService.count(userId, id);
            userHasLike = likeService.count(userId, id, LikeTypeConstant.LIKE);
            userHasUnlike = likeService.count(userId, id, LikeTypeConstant.UN_LIKE);
        }
        // 记录用户的足迹 异步处理
        if (userId != null) {
            executorService.execute(() -> {
                Footprint footprint = new Footprint();
                footprint.setUserId(userId);
                footprint.setProductId(id);
                footprintService.add(footprint);
            });
        }
        FutureTask<List> productAttributeListTask = new FutureTask<>(productAttributeListCallable);
        FutureTask<List> issueCallableTask = new FutureTask<>(issueCallable);
        FutureTask<Map> commentsCallableTsk = new FutureTask<>(commentsCallable);
        FutureTask<Brand> brandCallableTask = new FutureTask<>(brandCallable);

        executorService.submit(productAttributeListTask);
        executorService.submit(issueCallableTask);
        executorService.submit(commentsCallableTsk);
        executorService.submit(brandCallableTask);

        Map<String, Object> data = new HashMap<>();
        ProductInfo productInfo = productInfoDecorator.convert(info);
        try {
            data.put("info", productInfo);
            data.put("userHasCollect", userHasCollect);
            data.put("userHasLike", userHasLike);
            data.put("userHasUnlike", userHasUnlike);
            data.put("issue", issueCallableTask.get());
            data.put("comment", commentsCallableTsk.get());
            data.put("attribute", productAttributeListTask.get());
            data.put("brand", brandCallableTask.get());
            //SystemConfig.isAutoCreateShareImage()
            data.put("share", SystemConfig.isAutoCreateShareImage());

        } catch (Exception e) {
            e.printStackTrace();
        }

        //商品分享图片地址
        data.put("shareImage", info.getShareUrl());
        return ResponseUtil.ok(data);
    }

    /**
     * 商品分类类目
     *
     * @param id 分类类目ID
     * @return 商品分类类目
     */
    @GetMapping("category")
    public Object category(@NotNull Integer id) {
        Category cur = categoryService.findById(id);
        Category parent = null;
        List<Category> children = null;

        if (cur.getPid() == 0) {
            parent = cur;
            children = categoryService.queryByPid(cur.getId());
            cur = children.size() > 0 ? children.get(0) : cur;
        } else {
            parent = categoryService.findById(cur.getPid());
            children = categoryService.queryByPid(cur.getPid());
        }
        Map<String, Object> data = new HashMap<>();
        data.put("currentCategory", cur);
        data.put("parentCategory", parent);
        data.put("brotherCategory", children);
        return ResponseUtil.ok(data);
    }

    /**
     * 根据条件搜素商品
     * <p>
     * 1. 这里的前五个参数都是可选的，甚至都是空
     * 2. 用户是可选登录，如果登录，则记录用户的搜索关键字
     *
     * @param categoryId 分类类目ID，可选
     * @param brandId    品牌商ID，可选
     * @param keyword    关键字，可选
     * @param isNew      是否新品，可选
     * @param isHot      是否热买，可选
     * @param userId     用户ID
     * @param page       分页页数
     * @param limit      分页大小
     * @param sort       排序方式，支持"add_time", "retail_price"或"name"
     * @param order      排序类型，顺序或者降序
     * @return 根据条件搜素的商品详情
     */
    @GetMapping("list")
    public Object list(
            Integer categoryId,
            Integer brandId,
            String keyword,
            String name,
            Boolean isNew,
            Boolean isHot,
            @LoginUser Integer userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit,
            @Sort(accepts = {"release_time", "add_time", "retail_price", "name"}) @RequestParam(defaultValue = "add_time") String sort,
            @OrderValidateInterface @RequestParam(defaultValue = "desc") String order) {

        //添加到搜索历史
        if (userId != null && !StringUtils.isNullOrEmpty(keyword)) {
            SearchHistory searchHistoryVo = new SearchHistory();
            searchHistoryVo.setKeyword(keyword);
            searchHistoryVo.setUserId(userId);
            searchHistoryVo.setFrom("wx");
            searchHistoryService.save(searchHistoryVo);
        }

        //查询列表数据
        List<Product> productList = productService.querySelective(categoryId, brandId, keyword, name, isHot, isNew, page, limit, sort, order);

        // 查询商品所属类目列表。
        List<Integer> productCatIds = productService.getCatIds(brandId, keyword, isHot, isNew);
        List<Category> categoryList = null;
        if (productCatIds.size() != 0) {
            categoryList = categoryService.queryL2ByIds(productCatIds);
        } else {
            categoryList = new ArrayList<>(0);
        }

        PageInfo<Product> pagedList = PageInfo.of(productList);
        List<ProductInfo> list = productInfoDecorator.convertList(productList);
        Map<String, Object> entity = new HashMap<>();
        entity.put("list", list);
        entity.put("total", pagedList.getTotal());
        entity.put("page", pagedList.getPageNum());
        entity.put("limit", pagedList.getPageSize());
        entity.put("pages", pagedList.getPages());
        entity.put("filterCategoryList", categoryList);
        // 因为这里需要返回额外的filterCategoryList参数，因此不能方便使用ResponseUtil.okList
        return ResponseUtil.ok(entity);
    }

    /**
     * 商品详情页面“用户关注”商品
     */
    @GetMapping("like")
    public Object like(@LoginUser Integer userId,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit) {
        if (userId == null) {
            return ResponseUtil.unlogin();
        }

        List<Like> likes = likeService.queryByAddTime(userId, page, limit);
        PageInfo<Like> pagedList = PageInfo.of(likes);

        List<ProductInfo> list = likes.stream().map(like -> {
            Product product = productService.findById(like.getValueId());
            if (null != product) {
                ProductInfo productInfo = productInfoDecorator.convert(product);
                return productInfo;
            }
            return null;
        }).filter(productInfo -> null != productInfo).collect(Collectors.toList());
        Map<String, Object> entity = new HashMap<>();
        entity.put("list", list);
        entity.put("pages", pagedList.getPages());
        entity.put("total", pagedList.getTotal());
        return ResponseUtil.ok(entity);
    }

    /**
     * 商品详情页面“用户收藏”商品
     */
    @GetMapping("collect")
    public Object collect(@LoginUser Integer userId,
                          @RequestParam(defaultValue = "1") Integer page,
                          @RequestParam(defaultValue = "10") Integer limit) {
        if (userId == null) {
            return ResponseUtil.unlogin();
        }
        List<Collect> collects = collectService.queryByAddTime(userId, page, limit);
        PageInfo<Collect> pagedList = PageInfo.of(collects);
        List<ProductInfo> list = collects.stream().map(collect -> {
            Product product = productService.findById(collect.getValueId());
            if (null != product) {
                ProductInfo productInfo = productInfoDecorator.convert(product);
                return productInfo;
            }
            return null;
        }).filter(productInfo -> null != productInfo).collect(Collectors.toList());
        Map<String, Object> entity = new HashMap<>();
        entity.put("list", list);
        entity.put("pages", pagedList.getPages());
        entity.put("total", pagedList.getTotal());
        return ResponseUtil.ok(entity);
    }

    /**
     * 商品详情页面“用户收藏”商品
     */
    @GetMapping("footprint")
    public Object footprint(@LoginUser Integer userId,
                            @RequestParam(defaultValue = "1") Integer page,
                            @RequestParam(defaultValue = "10") Integer limit,
                            @Sort(accepts = {"add_time"}) @RequestParam(defaultValue = "add_time") String sort,
                            @OrderValidateInterface @RequestParam(defaultValue = "desc") String order) {
        if (userId == null) {
            return ResponseUtil.unlogin();
        }
        List<Footprint> footprints = footprintService.querySelective(userId, page, limit, sort, order);
        PageInfo<Footprint> pagedList = PageInfo.of(footprints);
        List<ProductInfo> list = footprints.stream().map(footprint -> {
            Product product = productService.findById(footprint.getProductId());
            if (null != product) {
                ProductInfo productInfo = productInfoDecorator.convert(product);
                return productInfo;
            }
            return null;

        }).filter(productInfo -> null != productInfo).collect(Collectors.toList());
        Map<String, Object> entity = new HashMap<>();
        entity.put("list", list);
        entity.put("pages", pagedList.getPages());
        entity.put("total", pagedList.getTotal());
        return ResponseUtil.ok(entity);
    }

    /**
     * 商品详情页面“大家都在看”推荐商品
     *
     * @param id, 商品ID
     * @return 商品详情页面推荐商品
     */
    @GetMapping("related")
    public Object related(@NotNull Integer id) {
        Product product = productService.findById(id);
        if (product == null) {
            return ResponseUtil.badArgumentValue();
        }

        // 目前的商品推荐算法仅仅是推荐同类目的其他商品
        int cid = product.getCategoryId();

        // 查找六个相关商品
        int related = 6;
        List<Product> productList = productService.queryByCategory(cid, 0, related);
        productList = productList.stream()
                .filter(product1 -> Integer.compare(product1.getId(), product.getId()) != 0)
                .collect(Collectors.toList());
        List<ProductInfo> productInfos = productInfoDecorator.convertList(productList);
        return ResponseUtil.okList(productInfos);
    }

    /**
     * 在售的商品总数
     *
     * @return 在售的商品总数
     */
    @GetMapping("count")
    public Object count() {
        Integer productCount = productService.queryOnSale();
        return ResponseUtil.ok(productCount);
    }

}