package org.golfworld.admin;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.golfworld.core.qcode.QCodeService;
import org.golfworld.db.domain.Product;
import org.golfworld.db.service.ProductService;
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
    ProductService litemallProductService;

    @Test
    public void test() {
        Product good = litemallProductService.findById(1181010);
        qCodeService.createGoodShareImage(good.getId().toString(), good.getPicUrl(), good.getName());
    }
}
