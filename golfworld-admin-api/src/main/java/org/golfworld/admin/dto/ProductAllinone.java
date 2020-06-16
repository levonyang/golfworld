package org.golfworld.admin.dto;

import org.golfworld.db.domain.Product;
import org.golfworld.db.domain.ProductAttribute;
import org.golfworld.db.domain.ProductProduct;

public class ProductAllinone {
    Product product;
    ProductAttribute[] attributes;
    ProductProduct[] products;


    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductProduct[] getProducts() {
        return products;
    }

    public void setProducts(ProductProduct[] products) {
        this.products = products;
    }

    public ProductAttribute[] getAttributes() {
        return attributes;
    }

    public void setAttributes(ProductAttribute[] attributes) {
        this.attributes = attributes;
    }

}
