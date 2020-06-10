package org.golfworld.admin.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.golfworld.admin.annotation.RequiresPermissionsDesc;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.core.validator.OrderValidateInterface;
import org.golfworld.core.validator.Sort;
import org.golfworld.db.domain.Brand;
import org.golfworld.db.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/admin/brand")
@Validated
public class AdminBrandController {
    private final Log logger = LogFactory.getLog(AdminBrandController.class);

    @Autowired
    private BrandService brandService;

    @RequiresPermissions("admin:brand:list")
    @RequiresPermissionsDesc(menu = {"产品管理", "品牌管理"}, button = "查询")
    @GetMapping("/list")
    public Object list(String id, String name,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort @RequestParam(defaultValue = "add_time") String sort,
                       @OrderValidateInterface @RequestParam(defaultValue = "desc") String order) {
        List<Brand> brandList = brandService.querySelective(id, name, page, limit, sort, order);
        return ResponseUtil.okList(brandList);
    }

    private Object validate(Brand brand) {
        String name = brand.getName();
        if (StringUtils.isEmpty(name)) {
            return ResponseUtil.badArgument();
        }

        String desc = brand.getDesc();
        if (StringUtils.isEmpty(desc)) {
            return ResponseUtil.badArgument();
        }
        return null;
    }

    @RequiresPermissions("admin:brand:create")
    @RequiresPermissionsDesc(menu = {"产品管理", "品牌管理"}, button = "添加")
    @PostMapping("/create")
    public Object create(@RequestBody Brand brand) {
        Object error = validate(brand);
        if (error != null) {
            return error;
        }
        brandService.add(brand);
        return ResponseUtil.ok(brand);
    }

    @RequiresPermissions("admin:brand:read")
    @RequiresPermissionsDesc(menu = {"产品管理", "品牌管理"}, button = "详情")
    @GetMapping("/read")
    public Object read(@NotNull Integer id) {
        Brand brand = brandService.findById(id);
        return ResponseUtil.ok(brand);
    }

    @RequiresPermissions("admin:brand:update")
    @RequiresPermissionsDesc(menu = {"产品管理", "品牌管理"}, button = "编辑")
    @PostMapping("/update")
    public Object update(@RequestBody Brand brand) {
        Object error = validate(brand);
        if (error != null) {
            return error;
        }
        if (brandService.updateById(brand) == 0) {
            return ResponseUtil.updatedDataFailed();
        }
        return ResponseUtil.ok(brand);
    }

    @RequiresPermissions("admin:brand:delete")
    @RequiresPermissionsDesc(menu = {"产品管理", "品牌管理"}, button = "删除")
    @PostMapping("/delete")
    public Object delete(@RequestBody Brand brand) {
        Integer id = brand.getId();
        if (id == null) {
            return ResponseUtil.badArgument();
        }
        brandService.deleteById(id);
        return ResponseUtil.ok();
    }

}
