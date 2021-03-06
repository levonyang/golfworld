package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.BrandMapper;
import org.golfworld.db.domain.Brand;
import org.golfworld.db.domain.Brand.Column;
import org.golfworld.db.domain.BrandExample;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BrandService {
    @Resource
    private BrandMapper brandMapper;
    private Column[] columns = new Column[]{Column.id, Column.name, Column.desc, Column.picUrl};

    public List<Brand> query(Integer page, Integer limit, String sort, String order) {
        BrandExample example = new BrandExample();
        example.or().andDeletedEqualTo(false);
        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }
        PageHelper.startPage(page, limit);
        return brandMapper.selectByExampleSelective(example, columns);
    }

    public List<Brand> query(Integer page, Integer limit) {
        return query(page, limit, null, null);
    }

    public Brand findById(Integer id) {
        return brandMapper.selectByPrimaryKey(id);
    }

    public List<Brand> querySelective(String id, String name, Integer page, Integer size, String sort, String order) {
        BrandExample example = new BrandExample();
        BrandExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(id)) {
            criteria.andIdEqualTo(Integer.valueOf(id));
        }
        if (!StringUtils.isEmpty(name)) {
            criteria.andNameLike("%" + name + "%");
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return brandMapper.selectByExample(example);
    }

    public int updateById(Brand brand) {
        brand.setUpdateTime(LocalDateTime.now());
        return brandMapper.updateByPrimaryKeySelective(brand);
    }

    public void deleteById(Integer id) {
        brandMapper.logicalDeleteByPrimaryKey(id);
    }

    public void add(Brand brand) {
        brand.setAddTime(LocalDateTime.now());
        brand.setUpdateTime(LocalDateTime.now());
        brandMapper.insertSelective(brand);
    }

    public List<Brand> all() {
        BrandExample example = new BrandExample();
        example.or().andDeletedEqualTo(false);
        return brandMapper.selectByExample(example);
    }

    public List<Brand> queryByKeyword(String keyword) {
        BrandExample example = new BrandExample();
        keyword = "%" + keyword + "%";
        example.or().andNameLike(keyword).andDeletedEqualTo(false);
        return brandMapper.selectByExample(example);
    }
}
