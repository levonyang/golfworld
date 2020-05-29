package org.golfworld.admin;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.golfworld.core.qcode.QCodeService;
import org.golfworld.db.domain.Goods;
import org.golfworld.db.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class CreateShareImageTest {
    @Autowired
    QCodeService qCodeService;
    @Autowired
    GoodsService litemallGoodsService;

    @Test
    public void test() {
        Goods good = litemallGoodsService.findById(1181010);
        qCodeService.createGoodShareImage(good.getId().toString(), good.getPicUrl(), good.getName());
    }
}
