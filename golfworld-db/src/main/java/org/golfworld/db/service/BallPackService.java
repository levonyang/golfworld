package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.BallPackMapper;
import org.golfworld.db.domain.BallPack;
import org.golfworld.db.domain.BallPackExample;
import org.golfworld.db.domain.Footprint;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BallPackService {
    @Resource
    private BallPackMapper ballPackMapper;

    public List<BallPack> queryByAddTime(Integer userId, Integer page, Integer size) {
        BallPackExample example = new BallPackExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(BallPack.Column.addTime.desc());
        PageHelper.startPage(page, size);
        return ballPackMapper.selectByExample(example);
    }

    public BallPack findById(Integer id) {
        return ballPackMapper.selectByPrimaryKey(id);
    }

    public BallPack findById(Integer userId, Integer id) {
        BallPackExample example = new BallPackExample();
        example.or().andIdEqualTo(id).andUserIdEqualTo(userId).andDeletedEqualTo(false);
        return ballPackMapper.selectOneByExample(example);
    }

    public void deleteById(Integer id) {
        ballPackMapper.logicalDeleteByPrimaryKey(id);
    }

    public void add(BallPack ballPack) {
        ballPack.setAddTime(LocalDateTime.now());
        ballPack.setUpdateTime(LocalDateTime.now());
        ballPackMapper.insertSelective(ballPack);
    }

    public int count(Integer valueId) {
        BallPackExample example = new BallPackExample();
//        example.or().andValueIdEqualTo(valueId).andActionTypeEqualTo(BallPackTypeConstant.LIKE).andDeletedEqualTo(false);
        List<BallPack> ballPacks = ballPackMapper.selectByExample(example);
        return ballPacks.size();
    }

    public int count(Integer userId, Integer valueId, Integer type) {
        BallPackExample example = new BallPackExample();
        List<BallPack> ballPacks = ballPackMapper.selectByExample(example);
        return ballPacks.size();
    }

    public List<BallPack> querySelective(String userId, Integer page, Integer size, String sort, String order) {
        BallPackExample example = new BallPackExample();
        BallPackExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(userId)) {
            criteria.andUserIdEqualTo(Integer.valueOf(userId));
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return ballPackMapper.selectByExample(example);
    }


    public BallPack findByUserIdAndValueId(Integer userId, Integer valueId) {
        BallPackExample example = new BallPackExample();
        return ballPackMapper.selectOneByExample(example);
    }

    public List<BallPack> findByUserId(Integer userId) {
        BallPackExample example = new BallPackExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        return ballPackMapper.selectByExample(example);
    }

    public List<BallPack> queryByAddTime(Integer userId, boolean all, Integer page, Integer size) {
        BallPackExample example = new BallPackExample();
        if (!all) {
            example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        } else {
            example.or().andDeletedEqualTo(false);
        }
        example.setOrderByClause(BallPack.Column.addTime.desc());
        PageHelper.startPage(page, size);
        return ballPackMapper.selectByExample(example);
    }

    public void update(BallPack ballPack) {
        ballPackMapper.updateByPrimaryKey(ballPack);
    }
}
