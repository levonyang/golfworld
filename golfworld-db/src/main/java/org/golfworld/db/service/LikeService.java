package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.LikeMapper;
import org.golfworld.db.domain.Like;
import org.golfworld.db.domain.LikeExample;
import org.golfworld.db.util.LikeTypeConstant;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LikeService {
    @Resource
    private LikeMapper likeMapper;

    public List<Like> queryByAddTime(Integer userId, Integer page, Integer size) {
        LikeExample example = new LikeExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Like.Column.addTime.desc());
        PageHelper.startPage(page, size);
        return likeMapper.selectByExample(example);
    }

    public Like findById(Integer id) {
        return likeMapper.selectByPrimaryKey(id);
    }

    public Like findById(Integer userId, Integer id) {
        LikeExample example = new LikeExample();
        example.or().andIdEqualTo(id).andUserIdEqualTo(userId).andDeletedEqualTo(false);
        return likeMapper.selectOneByExample(example);
    }

    public void deleteById(Integer id) {
        likeMapper.logicalDeleteByPrimaryKey(id);
    }

    public void add(Like like) {
        like.setAddTime(LocalDateTime.now());
        like.setUpdateTime(LocalDateTime.now());
        likeMapper.insertSelective(like);
    }

    public int count(Integer valueId) {
        LikeExample example = new LikeExample();
        example.or().andValueIdEqualTo(valueId).andActionTypeEqualTo(LikeTypeConstant.LIKE).andDeletedEqualTo(false);
        List<Like> likes = likeMapper.selectByExample(example);
        return likes.size();
    }

    public int count(Integer userId, Integer valueId, Integer type) {
        LikeExample example = new LikeExample();
        example.or().andUserIdEqualTo(userId)
                .andValueIdEqualTo(valueId)
                .andActionTypeEqualTo(type).andDeletedEqualTo(false);
        List<Like> likes = likeMapper.selectByExample(example);
        return likes.size();
    }

    public List<Like> querySelective(String userId, String productId, Integer page, Integer size, String sort, String order) {
        LikeExample example = new LikeExample();
        LikeExample.Criteria criteria = example.createCriteria();

        if (!StringUtils.isEmpty(userId)) {
            criteria.andUserIdEqualTo(Integer.valueOf(userId));
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return likeMapper.selectByExample(example);
    }

    public int deleteByUserIdAndValueId(Integer userId, Integer valueId) {
        LikeExample example = new LikeExample();
        example.or().andValueIdEqualTo(valueId).andUserIdEqualTo(userId).andDeletedEqualTo(false);
        return likeMapper.deleteByExample(example);
    }

    public Like findByUserIdAndValueId(Integer userId, Integer valueId) {
        LikeExample example = new LikeExample();
        example.or().andValueIdEqualTo(valueId).andUserIdEqualTo(userId).andDeletedEqualTo(false);
        return likeMapper.selectOneByExample(example);
    }

    public List<Like> findByUserId(Integer userId) {
        LikeExample example = new LikeExample();
        example.or().andUserIdEqualTo(userId).andDeletedEqualTo(false);
        example.setOrderByClause(Like.Column.addTime.desc());
        return likeMapper.selectByExample(example);
    }

    public int countByUserId(Integer userId) {
        LikeExample example = new LikeExample();
        example.or().andUserIdEqualTo(userId).andActionTypeEqualTo(LikeTypeConstant.LIKE).andDeletedEqualTo(false);
        List<Like> likes = likeMapper.selectByExample(example);
        return likes.size();
    }

    public List<Like> findByValueId(Integer id) {
        LikeExample example = new LikeExample();
        example.or().andValueIdEqualTo(id).andDeletedEqualTo(false);
        example.setOrderByClause(Like.Column.addTime.desc());
        return likeMapper.selectByExample(example);
    }
}
