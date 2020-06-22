package org.golfworld.wx.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.util.JacksonUtil;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.db.domain.Like;
import org.golfworld.db.service.LikeService;
import org.golfworld.db.service.ProductService;
import org.golfworld.wx.annotation.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 用户访问足迹服务
 */
@RestController
@RequestMapping("/wx/like")
@Validated
public class WxLikeController {
    private final Log logger = LogFactory.getLog(WxLikeController.class);

    @Autowired
    private LikeService likeService;
    @Autowired
    private ProductService productService;

    /**
     * 删除用户足迹
     *
     * @param userId 用户ID
     * @param body   请求内容， { id: xxx }
     * @return 删除操作结果
     */
    @PostMapping("/submit")
    public Object submit(@LoginUser Integer userId, @RequestBody String body) {
        if (userId == null) {
            return ResponseUtil.unlogin();
        }
        if (body == null) {
            return ResponseUtil.badArgument();
        }
        Integer valueId = JacksonUtil.parseInteger(body, "valueId");
        if (valueId == null) {
            return ResponseUtil.badArgument();
        }
        Like like = new Like();
        like.setUserId(userId);
        like.setValueId(valueId);
        likeService.add(like);
        return ResponseUtil.ok(like);
    }

    /**
     * 用户足迹列表
     */
    @GetMapping("/list")
    public Object list(@LoginUser Integer valueId) {
        if (valueId == null) {
            return ResponseUtil.unlogin();
        }
        int count = likeService.count(valueId);
        return ResponseUtil.ok(count);
    }

}