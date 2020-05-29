package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.StorageMapper;
import org.golfworld.db.domain.StorageInfo;
import org.golfworld.db.domain.StorageExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InternalStorageService {
    @Autowired
    private StorageMapper storageMapper;

    public void deleteByKey(String key) {
        StorageExample example = new StorageExample();
        example.or().andKeyEqualTo(key);
        storageMapper.logicalDeleteByExample(example);
    }

    public void add(StorageInfo storageInfo) {
        storageInfo.setAddTime(LocalDateTime.now());
        storageInfo.setUpdateTime(LocalDateTime.now());
        storageMapper.insertSelective(storageInfo);
    }

    public StorageInfo findByKey(String key) {
        StorageExample example = new StorageExample();
        example.or().andKeyEqualTo(key).andDeletedEqualTo(false);
        return storageMapper.selectOneByExample(example);
    }

    public int update(StorageInfo storageInfo) {
        storageInfo.setUpdateTime(LocalDateTime.now());
        return storageMapper.updateByPrimaryKeySelective(storageInfo);
    }

    public StorageInfo findById(Integer id) {
        return storageMapper.selectByPrimaryKey(id);
    }

    public List<StorageInfo> querySelective(String key, String name, Integer page, Integer limit, String sort, String order) {
        StorageExample example = new StorageExample();
        StorageExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(key)) {
            criteria.andKeyEqualTo(key);
        }
        if (!StringUtils.isEmpty(name)) {
            criteria.andNameLike("%" + name + "%");
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, limit);
        return storageMapper.selectByExample(example);
    }
}
