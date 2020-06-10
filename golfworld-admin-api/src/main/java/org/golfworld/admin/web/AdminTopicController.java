package org.golfworld.admin.web;

import io.swagger.models.auth.In;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.golfworld.admin.annotation.RequiresPermissionsDesc;
import org.golfworld.core.util.JacksonUtil;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.core.validator.OrderValidateInterface;
import org.golfworld.core.validator.Sort;
import org.golfworld.db.domain.Product;
import org.golfworld.db.domain.Topic;
import org.golfworld.db.service.ProductService;
import org.golfworld.db.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//@RestController
//@RequestMapping("/admin/topic")
//@Validated
public class AdminTopicController {
    private final Log logger = LogFactory.getLog(AdminTopicController.class);

    @Autowired
    private TopicService topicService;
    @Autowired
    private ProductService productService;

    @RequiresPermissions("admin:topic:list")
    @RequiresPermissionsDesc(menu = {"推广管理", "专题管理"}, button = "查询")
    @GetMapping("/list")
    public Object list(String title, String subtitle,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort(accepts = {"id", "add_time", "price"}) @RequestParam(defaultValue = "add_time") String sort,
                       @OrderValidateInterface @RequestParam(defaultValue = "desc") String order) {
        List<Topic> topicList = topicService.querySelective(title, subtitle, page, limit, sort, order);
        return ResponseUtil.okList(topicList);
    }

    private Object validate(Topic topic) {
        String title = topic.getTitle();
        if (StringUtils.isEmpty(title)) {
            return ResponseUtil.badArgument();
        }
        String content = topic.getContent();
        if (StringUtils.isEmpty(content)) {
            return ResponseUtil.badArgument();
        }
        BigDecimal price = topic.getPrice();
        if (price == null) {
            return ResponseUtil.badArgument();
        }
        return null;
    }

    @RequiresPermissions("admin:topic:create")
    @RequiresPermissionsDesc(menu = {"推广管理", "专题管理"}, button = "添加")
    @PostMapping("/create")
    public Object create(@RequestBody Topic topic) {
        Object error = validate(topic);
        if (error != null) {
            return error;
        }
        topicService.add(topic);
        return ResponseUtil.ok(topic);
    }

    @RequiresPermissions("admin:topic:read")
    @RequiresPermissionsDesc(menu = {"推广管理", "专题管理"}, button = "详情")
    @GetMapping("/read")
    public Object read(@NotNull Integer id) {
        Topic topic = topicService.findById(id);
        Integer[] productIds = topic.getProduct();
        List<Product> productList = null;
        if (productIds == null || productIds.length == 0) {
            productList = new ArrayList<>();
        } else {
            productList = productService.queryByIds(productIds);
        }
        Map<String, Object> data = new HashMap<>(2);
        data.put("topic", topic);
        data.put("productList", productList);
        return ResponseUtil.ok(data);
    }

    @RequiresPermissions("admin:topic:update")
    @RequiresPermissionsDesc(menu = {"推广管理", "专题管理"}, button = "编辑")
    @PostMapping("/update")
    public Object update(@RequestBody Topic topic) {
        Object error = validate(topic);
        if (error != null) {
            return error;
        }
        if (topicService.updateById(topic) == 0) {
            return ResponseUtil.updatedDataFailed();
        }
        return ResponseUtil.ok(topic);
    }

    @RequiresPermissions("admin:topic:delete")
    @RequiresPermissionsDesc(menu = {"推广管理", "专题管理"}, button = "删除")
    @PostMapping("/delete")
    public Object delete(@RequestBody Topic topic) {
        topicService.deleteById(topic.getId());
        return ResponseUtil.ok();
    }

    @RequiresPermissions("admin:topic:batch-delete")
    @RequiresPermissionsDesc(menu = {"推广管理", "专题管理"}, button = "批量删除")
    @PostMapping("/batch-delete")
    public Object batchDelete(@RequestBody String body) {
        List<Integer> ids = JacksonUtil.parseIntegerList(body, "ids");
        topicService.deleteByIds(ids);
        return ResponseUtil.ok();
    }
}
