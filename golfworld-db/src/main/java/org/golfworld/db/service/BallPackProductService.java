package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.BallPackProductMapper;
import org.golfworld.db.domain.BallPackProduct;
import org.golfworld.db.domain.BallPackProductExample;
import org.golfworld.db.domain.Footprint;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BallPackProductService {
    @Resource
    private BallPackProductMapper ballPackProductMapper;

    public List<BallPackProduct> queryByAddTime(Integer valueId, Integer page, Integer size) {
        BallPackProductExample example = new BallPackProductExample();
        example.or().andValueIdEqualTo(valueId).andDeletedEqualTo(false);
        example.setOrderByClause(BallPackProduct.Column.addTime.desc());
        PageHelper.startPage(page, size);
        return ballPackProductMapper.selectByExample(example);
    }

    public BallPackProduct findById(Integer id) {
        return ballPackProductMapper.selectByPrimaryKey(id);
    }

    public BallPackProduct findById(Integer userId, Integer id) {
        BallPackProductExample example = new BallPackProductExample();
//        example.or().andIdEqualTo(id).andUserIdEqualTo(userId).andDeletedEqualTo(false);
        return ballPackProductMapper.selectOneByExample(example);
    }

    public void deleteById(Integer id) {
        ballPackProductMapper.logicalDeleteByPrimaryKey(id);
    }

    public void add(BallPackProduct ballPackProduct) {
        ballPackProduct.setAddTime(LocalDateTime.now());
        ballPackProduct.setUpdateTime(LocalDateTime.now());
        ballPackProductMapper.insertSelective(ballPackProduct);
    }

    public int count(Integer valueId) {
        BallPackProductExample example = new BallPackProductExample();
        example.or().andValueIdEqualTo(valueId).andDeletedEqualTo(false);
        List<BallPackProduct> ballPackProducts = ballPackProductMapper.selectByExample(example);
        return ballPackProducts.size();
    }

    public int count(Integer userId, Integer valueId, Integer type) {
        BallPackProductExample example = new BallPackProductExample();
//        example.or().andUserIdEqualTo(userId)
//                .andValueIdEqualTo(valueId)
//                .andActionTypeEqualTo(type).andDeletedEqualTo(false);
        List<BallPackProduct> ballPackProducts = ballPackProductMapper.selectByExample(example);
        return ballPackProducts.size();
    }

    public List<BallPackProduct> querySelective(String userId, String valueId, Integer page, Integer size, String sort, String order) {
        BallPackProductExample example = new BallPackProductExample();
        BallPackProductExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(valueId)) {
            criteria.andValueIdEqualTo(Integer.valueOf(valueId));
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return ballPackProductMapper.selectByExample(example);
    }

    public int deleteByValueId(Integer ballPackId) {
        BallPackProductExample example = new BallPackProductExample();
        example.or().andBallPackIdEqualTo(ballPackId);
        return ballPackProductMapper.deleteByExample(example);
    }

    public BallPackProduct findByUserIdAndValueId(Integer userId, Integer valueId) {
        BallPackProductExample example = new BallPackProductExample();
        return ballPackProductMapper.selectOneByExample(example);
    }

    public List<BallPackProduct> findByUserId(Integer userId) {
        BallPackProductExample example = new BallPackProductExample();
        example.setOrderByClause(Footprint.Column.addTime.desc());
        return ballPackProductMapper.selectByExample(example);
    }

    public List<BallPackProduct> findByValueId(Integer valueId) {
        BallPackProductExample example = new BallPackProductExample();
        example.or().andValueIdEqualTo(valueId);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        return ballPackProductMapper.selectByExample(example);
    }

    public List<BallPackProduct> findByBallPackId(Integer ballPackId) {
        BallPackProductExample example = new BallPackProductExample();
        example.or().andBallPackIdEqualTo(ballPackId).andDeletedEqualTo(false);
        example.setOrderByClause(Footprint.Column.addTime.desc());
        return ballPackProductMapper.selectByExample(example);
    }
}
