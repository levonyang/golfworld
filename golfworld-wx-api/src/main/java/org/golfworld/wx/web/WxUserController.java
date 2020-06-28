package org.golfworld.wx.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.db.service.CollectService;
import org.golfworld.db.service.FootprintService;
import org.golfworld.db.service.LikeService;
import org.golfworld.wx.annotation.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户服务
 */
@RestController
@RequestMapping("/wx/user")
@Validated
public class WxUserController {
    private final Log logger = LogFactory.getLog(WxUserController.class);

    @Autowired
    private LikeService likeService;
    @Autowired
    private CollectService collectService;
    @Autowired
    private FootprintService footprintService;

    /**
     * 用户个人页面数据
     * <p>
     * 目前是喜欢,收藏,关注
     *
     * @param userId 用户ID
     * @return 用户个人页面数据
     */
    @GetMapping("index")
    public Object list(@LoginUser Integer userId) {
        if (userId == null) {
            return ResponseUtil.unlogin();
        }

        Map<Object, Object> data = new HashMap<Object, Object>();
        int like = likeService.countByUserId(userId);
        int collect = collectService.countByUserId(userId);
        int footPrint = footprintService.countByUserId(userId);
        data.put("like", like);
        data.put("collect", collect);
        data.put("footPrint", footPrint);
        return ResponseUtil.ok(data);
    }

}