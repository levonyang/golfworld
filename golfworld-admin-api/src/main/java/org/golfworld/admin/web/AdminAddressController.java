package org.golfworld.admin.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.golfworld.admin.annotation.RequiresPermissionsDesc;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.core.validator.OrderValidateInterface;
import org.golfworld.core.validator.Sort;
import org.golfworld.db.domain.Address;
import org.golfworld.db.service.AddressService;
import org.golfworld.db.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

//@RestController
//@RequestMapping("/admin/address")
//@Validated
public class AdminAddressController {
    private final Log logger = LogFactory.getLog(AdminAddressController.class);

    @Autowired
    private AddressService addressService;

    @Autowired
    private RegionService regionService;

    @RequiresPermissions("admin:address:list")
    @RequiresPermissionsDesc(menu = {"用户管理", "收货地址"}, button = "查询")
    @GetMapping("/list")
    public Object list(Integer userId, String name,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort @RequestParam(defaultValue = "add_time") String sort,
                       @OrderValidateInterface @RequestParam(defaultValue = "desc") String order) {

        List<Address> addressList = addressService.querySelective(userId, name, page, limit, sort, order);
        return ResponseUtil.okList(addressList);
    }
}
