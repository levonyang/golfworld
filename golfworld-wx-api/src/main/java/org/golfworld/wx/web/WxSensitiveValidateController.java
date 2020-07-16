package org.golfworld.wx.web;

import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.util.JacksonUtil;
import org.golfworld.core.util.ResponseUtil;
import org.golfworld.wx.service.SensitiveValidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/wx/validate")
@Validated
public class WxSensitiveValidateController {
    private final Log logger = LogFactory.getLog(WxSensitiveValidateController.class);

    @Autowired
    private SensitiveValidateService sensitiveValidateService;


    @PostMapping("text")
    public Object text(@RequestBody String body) throws WxErrorException {
        String text = JacksonUtil.parseString(body, "text");
        Boolean result = sensitiveValidateService.validateText(text);
        return ResponseUtil.ok(result);
    }

    @GetMapping("image")
    public Object image(@RequestParam("file") MultipartFile file) throws WxErrorException, IOException {
        Boolean result = sensitiveValidateService.validateImage(file);
        return ResponseUtil.ok(result);
    }
}
