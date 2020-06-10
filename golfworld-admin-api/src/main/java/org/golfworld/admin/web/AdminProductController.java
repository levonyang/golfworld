package org.golfworld.admin.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.golfworld.admin.annotation.RequiresPermissionsDesc;
import org.golfworld.admin.dto.ProductAllinone;
import org.golfworld.admin.service.AdminProductService;
import org.golfworld.core.validator.OrderValidateInterface;
import org.golfworld.core.validator.Sort;
import org.golfworld.db.domain.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

@RestController
@RequestMapping("/admin/product")
@Validated
public class AdminProductController {
    private final Log logger = LogFactory.getLog(AdminProductController.class);

    @Autowired
    private AdminProductService adminProductService;

    /**
     * 查询商品
     *
     * @param productId
     * @param productSn
     * @param name
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @return
     */
    @RequiresPermissions("admin:product:list")
    @RequiresPermissionsDesc(menu = {"产品管理", "产品管理"}, button = "查询")
    @GetMapping("/list")
    public Object list(Integer productId, String productSn, String name,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort @RequestParam(defaultValue = "add_time") String sort,
                       @OrderValidateInterface @RequestParam(defaultValue = "desc") String order) {
        return adminProductService.list(productId, productSn, name, page, limit, sort, order);
    }

    @GetMapping("/catAndBrand")
    public Object list2() {
        return adminProductService.list2();
    }

    /**
     * 编辑商品
     *
     * @param productAllinone
     * @return
     */
    @RequiresPermissions("admin:product:update")
    @RequiresPermissionsDesc(menu = {"产品管理", "产品管理"}, button = "编辑")
    @PostMapping("/update")
    public Object update(@RequestBody ProductAllinone productAllinone) {
        return adminProductService.update(productAllinone);
    }

    /**
     * 删除商品
     *
     * @param product
     * @return
     */
    @RequiresPermissions("admin:product:delete")
    @RequiresPermissionsDesc(menu = {"产品管理", "产品管理"}, button = "删除")
    @PostMapping("/delete")
    public Object delete(@RequestBody Product product) {
        return adminProductService.delete(product);
    }

    /**
     * 添加商品
     *
     * @param productAllinone
     * @return
     */
    @RequiresPermissions("admin:product:create")
    @RequiresPermissionsDesc(menu = {"产品管理", "产品管理"}, button = "上架")
    @PostMapping("/create")
    public Object create(@RequestBody ProductAllinone productAllinone) {
        return adminProductService.create(productAllinone);
    }

    /**
     * 商品详情
     *
     * @param id
     * @return
     */
    @RequiresPermissions("admin:product:read")
    @RequiresPermissionsDesc(menu = {"产品管理", "产品管理"}, button = "详情")
    @GetMapping("/detail")
    public Object detail(@NotNull Integer id) {
        return adminProductService.detail(id);

    }

}
