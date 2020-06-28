package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.CollectMapper;
import org.golfworld.db.domain.Collect;
import org.golfworld.db.domain.CollectExample;
import org.golfworld.db.domain.Footprint;
import org.golfworld.db.domain.FootprintExample;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CollectService {
    @Resource
    private CollectMapper collectMapper;

    public int count(int uid, Integer gid) {
        CollectExample example = new CollectExample();
        example.or().andUserIdEqualTo(uid).andValueIdEqualTo(gid).andDeletedEqualTo(false);
        return (int) collectMapper.countByExample(example);
    }

    public List<Collect> queryByType(Integer userId, Byte type, Integer page, Integer limit, String sort, String order) {
        CollectExample example = new CollectExample();
        CollectExample.Criteria criteria = example.createCriteria();

        if (type != null) {
            criteria.andTypeEqualTo(type);
        }
        criteria.andUserIdEqualTo(userId);
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, limit);
        return collectMapper.selectByExample(example);
    }

    public int countByType(Integer userId, Byte type) {
        CollectExample example = new CollectExample();
        example.or().andUserIdEqualTo(userId).andTypeEqualTo(type).andDeletedEqualTo(false);
        return (int) collectMapper.countByExample(example);
    }

    public Collect queryByTypeAndValue(Integer userId, Byte type, Integer valueId) {
        CollectExample example = new CollectExample();
        example.or().andUserIdEqualTo(userId).andValueIdEqualTo(valueId).andTypeEqualTo(type).andDeletedEqualTo(false);
        return collectMapper.selectOneByExample(example);
    }

    public void deleteById(Integer id) {
        collectMapper.logicalDeleteByPrimaryKey(id);
    }

    public int add(Collect collect) {
        collect.setAddTime(LocalDateTime.now());
        collect.setUpdateTime(LocalDateTime.now());
        return collectMapper.insertSelective(collect);
    }

    public List<Collect> querySelective(String userId, String valueId, Integer page, Integer size, String sort, String order) {
        CollectExample example = new CollectExample();
        CollectExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(userId)) {
            criteria.andUserIdEqualTo(Integer.valueOf(userId));
        }
        if (!StringUtils.isEmpty(valueId)) {
            criteria.andValueIdEqualTo(Integer.valueOf(valueId));
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return collectMapper.selectByExample(example);
    }

    public List<Collect> findByUserId(Integer userId) {
        CollectExample example = new CollectExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        return collectMapper.selectByExample(example);
    }

    public List<Collect> queryByAddTime(Integer userId, Integer page, Integer limit) {
        CollectExample example = new CollectExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        PageHelper.startPage(page, limit);
        return collectMapper.selectByExample(example);
    }

    public int countByUserId(Integer userId) {
        CollectExample example = new CollectExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        List<Collect> collects = collectMapper.selectByExample(example);
        return collects.size();
    }
}
