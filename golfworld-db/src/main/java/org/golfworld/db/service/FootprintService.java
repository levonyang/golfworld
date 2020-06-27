package org.golfworld.db.service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.FootprintMapper;
import org.golfworld.db.domain.Footprint;
import org.golfworld.db.domain.FootprintExample;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FootprintService {
    @Resource
    private FootprintMapper footprintMapper;

    public List<Footprint> queryByAddTime(Integer userId, Integer page, Integer size) {
        FootprintExample example = new FootprintExample();
        FootprintExample.Criteria criteria = example.createCriteria();
        criteria.andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        PageHelper.startPage(page, size);
        return footprintMapper.selectByExample(example);
    }

    public Footprint findById(Integer id) {
        return footprintMapper.selectByPrimaryKey(id);
    }

    public Footprint findById(Integer userId, Integer id) {
        FootprintExample example = new FootprintExample();
        example.or().andIdEqualTo(id).andUserIdEqualTo(userId).andDeletedEqualTo(false);
        return footprintMapper.selectOneByExample(example);
    }

    public void deleteById(Integer id) {
        footprintMapper.logicalDeleteByPrimaryKey(id);
    }

    public void add(Footprint footprint) {
        footprint.setAddTime(LocalDateTime.now());
        footprint.setUpdateTime(LocalDateTime.now());
        footprintMapper.insertSelective(footprint);
    }

    public List<Footprint> querySelective(String userId, String productId, Integer page, Integer size, String sort, String order) {
        FootprintExample example = new FootprintExample();
        FootprintExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(userId)) {
            criteria.andUserIdEqualTo(Integer.valueOf(userId));
        }
        if (!StringUtils.isEmpty(productId)) {
            criteria.andProductIdEqualTo(Integer.valueOf(productId));
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return footprintMapper.selectByExample(example);
    }

    public List<Footprint> findByUserId(Integer userId) {
        FootprintExample example = new FootprintExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        return footprintMapper.selectByExample(example);
    }

    public List<Footprint> querySelective(Integer userId, Integer page, Integer limit, String sort, String order) {
              FootprintExample example = new FootprintExample();
        FootprintExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(userId)) {
            criteria.andUserIdEqualTo(Integer.valueOf(userId));
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }
        PageHelper.startPage(page, limit);
        return footprintMapper.selectByExample(example);
    }
}
