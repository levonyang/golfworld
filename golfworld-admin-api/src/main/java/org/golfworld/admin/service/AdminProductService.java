package org.golfworld.admin.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.admin.dto.ProductAllinone;
import org.golfworld.admin.vo.CatVo;
import org.golfworld.core.qcode.QCodeService;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.db.domain.*;
import org.golfworld.db.service.BrandService;
import org.golfworld.db.service.CategoryService;
import org.golfworld.db.service.ProductAttributeService;
import org.golfworld.db.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.golfworld.admin.util.AdminResponseCode.GOODS_NAME_EXIST;

@Service
public class AdminProductService {
    private final Log logger = LogFactory.getLog(AdminProductService.class);

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductAttributeService attributeService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private BrandService brandService;
    @Autowired
    private QCodeService qCodeService;

    public Object list(Integer productId, String productSn, String name,
                       Integer page, Integer limit, String sort, String order) {
        List<Product> productList = productService.querySelective(productId, productSn, name, page, limit, sort, order);
        return ResponseUtil.okList(productList);
    }

    private Object validate(ProductAllinone productAllinone) {
        Product product = productAllinone.getProduct();
        String name = product.getName();
        if (StringUtils.isEmpty(name)) {
            return ResponseUtil.badArgument();
        }
        // 品牌商可以不设置，如果设置则需要验证品牌商存在
        Integer brandId = product.getBrandId();
        if (brandId != null && brandId != 0) {
            if (brandService.findById(brandId) == null) {
                return ResponseUtil.badArgumentValue();
            }
        }
        // 分类可以不设置，如果设置则需要验证分类存在
        Integer categoryId = product.getCategoryId();
        if (categoryId != null && categoryId != 0) {
            if (categoryService.findById(categoryId) == null) {
                return ResponseUtil.badArgumentValue();
            }
        }

        ProductAttribute[] attributes = productAllinone.getAttributes();
        for (ProductAttribute attribute : attributes) {
            String attr = attribute.getAttribute();
            if (StringUtils.isEmpty(attr)) {
                return ResponseUtil.badArgument();
            }
            String value = attribute.getValue();
            if (StringUtils.isEmpty(value)) {
                return ResponseUtil.badArgument();
            }
        }

        BigDecimal officialPrice = product.getOfficialPrice();
        if (officialPrice == null) {
            return ResponseUtil.badArgument();
        }
        return null;
    }

    /**
     * 编辑商品
     * <p>
     * NOTE：
     * 由于商品涉及到四个表，特别是litemall_product_product表依赖litemall_product_specification表，
     * 这导致允许所有字段都是可编辑会带来一些问题，因此这里商品编辑功能是受限制：
     * （1）litemall_product表可以编辑字段；
     * （2）litemall_product_specification表只能编辑pic_url字段，其他操作不支持；
     * （3）litemall_product_product表只能编辑price, number和url字段，其他操作不支持；
     * （4）litemall_product_attribute表支持编辑、添加和删除操作。
     * <p>
     * NOTE2:
     * 前后端这里使用了一个小技巧：
     * 如果前端传来的update_time字段是空，则说明前端已经更新了某个记录，则这个记录会更新；
     * 否则说明这个记录没有编辑过，无需更新该记录。
     * <p>
     * NOTE3:
     * （1）购物车缓存了一些商品信息，因此需要及时更新。
     * 目前这些字段是product_sn, product_name, price, pic_url。
     * （2）但是订单里面的商品信息则是不会更新。
     * 如果订单是未支付订单，此时仍然以旧的价格支付。
     */
    @Transactional
    public Object update(ProductAllinone productAllinone) {
        Object error = validate(productAllinone);
        if (error != null) {
            return error;
        }

        Product product = productAllinone.getProduct();
        ProductAttribute[] attributes = productAllinone.getAttributes();

        //将生成的分享图片地址写入数据库
        String url = qCodeService.createGoodShareImage(product.getId().toString(), product.getPicUrl(), product.getName());
        product.setShareUrl(url);


        // 商品基本信息表litemall_product
        if (productService.updateById(product) == 0) {
            throw new RuntimeException("更新数据失败");
        }

        Integer gid = product.getId();
//
//        // 商品规格表litemall_product_specification
//        for (ProductSpecification specification : specifications) {
//            // 目前只支持更新规格表的图片字段
//            if (specification.getUpdateTime() == null) {
//                specification.setSpecification(null);
//                specification.setValue(null);
//                specificationService.updateById(specification);
//            }
//        }


        // 商品参数表product_attribute
        for (ProductAttribute attribute : attributes) {
            if (attribute.getId() == null || attribute.getId().equals(0)) {
                attribute.setProductId(product.getId());
                attributeService.add(attribute);
            } else if (attribute.getDeleted()) {
                attributeService.deleteById(attribute.getId());
            } else if (attribute.getUpdateTime() == null) {
                attributeService.updateById(attribute);
            }
        }
        return ResponseUtil.ok();
    }

    @Transactional
    public Object delete(Product product) {
        Integer id = product.getId();
        if (id == null) {
            return ResponseUtil.badArgument();
        }

        Integer gid = product.getId();
        productService.deleteById(gid);
        attributeService.deleteByGid(gid);
//        productService.deleteByGid(gid);
        return ResponseUtil.ok();
    }

    @Transactional
    public Object create(ProductAllinone productAllinone) {
        Object error = validate(productAllinone);
        if (error != null) {
            return error;
        }

        Product product = productAllinone.getProduct();
        ProductAttribute[] attributes = productAllinone.getAttributes();
        ProductSpecification[] specifications = productAllinone.getSpecifications();
        ProductProduct[] products = productAllinone.getProducts();

        String name = product.getName();
        if (productService.checkExistByName(name)) {
            return ResponseUtil.fail(GOODS_NAME_EXIST, "商品名已经存在");
        }


        // 商品基本信息表product
        productService.add(product);

        //将生成的分享图片地址写入数据库
        String url = qCodeService.createGoodShareImage(product.getId().toString(), product.getPicUrl(), product.getName());
        if (!StringUtils.isEmpty(url)) {
            product.setShareUrl(url);
            if (productService.updateById(product) == 0) {
                throw new RuntimeException("更新数据失败");
            }
        }

        // 商品参数表litemall_product_attribute
        for (ProductAttribute attribute : attributes) {
            attribute.setProductId(product.getId());
            attributeService.add(attribute);
        }


        return ResponseUtil.ok();
    }

    public Object list2() {
        // http://element-cn.eleme.io/#/zh-CN/component/cascader
        // 管理员设置“所属分类”
        List<Category> l1CatList = categoryService.queryL1();
        List<CatVo> categoryList = new ArrayList<>(l1CatList.size());

        for (Category l1 : l1CatList) {
            CatVo l1CatVo = new CatVo();
            l1CatVo.setValue(l1.getId());
            l1CatVo.setLabel(l1.getName());

            List<Category> l2CatList = categoryService.queryByPid(l1.getId());
            List<CatVo> children = new ArrayList<>(l2CatList.size());
            for (Category l2 : l2CatList) {
                CatVo l2CatVo = new CatVo();
                l2CatVo.setValue(l2.getId());
                l2CatVo.setLabel(l2.getName());
                children.add(l2CatVo);
            }
            l1CatVo.setChildren(children);

            categoryList.add(l1CatVo);
        }

        // http://element-cn.eleme.io/#/zh-CN/component/select
        // 管理员设置“所属品牌商”
        List<Brand> list = brandService.all();
        List<Map<String, Object>> brandList = new ArrayList<>(l1CatList.size());
        for (Brand brand : list) {
            Map<String, Object> b = new HashMap<>(2);
            b.put("value", brand.getId());
            b.put("label", brand.getName());
            brandList.add(b);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("categoryList", categoryList);
        data.put("brandList", brandList);
        return ResponseUtil.ok(data);
    }

    public Object detail(Integer id) {
        Product product = productService.findById(id);
//        List<ProductProduct> products = productService.queryByGid(id);
        List<ProductAttribute> attributes = attributeService.queryByGid(id);

        Integer categoryId = product.getCategoryId();
        Category category = categoryService.findById(categoryId);
        Integer[] categoryIds = new Integer[]{};
        if (category != null) {
            Integer parentCategoryId = category.getPid();
            categoryIds = new Integer[]{parentCategoryId, categoryId};
        }

        Map<String, Object> data = new HashMap<>();
        data.put("product", product);
//        data.put("products", products);
        data.put("attributes", attributes);
        data.put("categoryIds", categoryIds);

        return ResponseUtil.ok(data);
    }

}
