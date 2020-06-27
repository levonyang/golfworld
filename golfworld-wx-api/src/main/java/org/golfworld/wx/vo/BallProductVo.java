package org.golfworld.wx.vo;

import org.golfworld.db.domain.BallPack;
import org.golfworld.db.domain.BallPackProduct;

import java.util.List;

public class BallProductVo extends BallPack {

    private List<BallPackProduct> productList;

    public List<BallPackProduct> getProductList() {
        return productList;
    }

    public void setProductList(List<BallPackProduct> productList) {
        this.productList = productList;
    }
}
