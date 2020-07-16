package org.golfworld.wx.service;

import me.chanjar.weixin.common.error.WxErrorException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class WxSensitiveValidatServiceTest {
    @Autowired
    private SensitiveValidateService sensitiveValidateService;

    @Test
    public void testTextValidate() throws WxErrorException {
        Boolean result = sensitiveValidateService.validateText("特3456书yuuo莞6543李zxcz蒜7782法fgnv级完2347全dfji试3726测asad感3847知qwez到");
        Assert.assertFalse(result);
    }

}
