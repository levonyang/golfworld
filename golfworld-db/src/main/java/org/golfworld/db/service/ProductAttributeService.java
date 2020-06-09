package org.golfworld.db.service;

import org.golfworld.db.dao.ProductAttributeMapper;
import org.golfworld.db.domain.ProductAttribute;
import org.golfworld.db.domain.ProductAttributeExample;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductAttributeService {
    @Resource
    private ProductAttributeMapper productAttributeMapper;

    public List<ProductAttribute> queryByGid(Integer productId) {
        ProductAttributeExample example = new ProductAttributeExample();
        example.or().andProductIdEqualTo(productId).andDeletedEqualTo(false);
        return productAttributeMapper.selectByExample(example);
    }

    public void add(ProductAttribute productAttribute) {
        productAttribute.setAddTime(LocalDateTime.now());
        productAttribute.setUpdateTime(LocalDateTime.now());
        productAttributeMapper.insertSelective(productAttribute);
    }

    public ProductAttribute findById(Integer id) {
        return productAttributeMapper.selectByPrimaryKey(id);
    }

    public void deleteByGid(Integer gid) {
        ProductAttributeExample example = new ProductAttributeExample();
        example.or().andProductIdEqualTo(gid);
        productAttributeMapper.logicalDeleteByExample(example);
    }

    public void deleteById(Integer id) {
        productAttributeMapper.logicalDeleteByPrimaryKey(id);
    }

    public void updateById(ProductAttribute attribute) {
        attribute.setUpdateTime(LocalDateTime.now());
        productAttributeMapper.updateByPrimaryKeySelective(attribute);
    }
}
