package org.golfworld.db.service;

import com.github.pagehelper.PageHelper;
import org.golfworld.db.dao.CommentMapper;
import org.golfworld.db.domain.Comment;
import org.golfworld.db.domain.CommentExample;
import org.golfworld.db.domain.Like;
import org.golfworld.db.domain.User;
import org.golfworld.db.util.CommonTypeConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Resource
    private CommentMapper commentMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private LikeService likeService;

    public List<Comment> queryProductByGid(Integer id, int offset, int limit) {
        CommentExample example = new CommentExample();
        example.setOrderByClause(Comment.Column.addTime.desc());
        example.or().andValueIdEqualTo(id).andTypeEqualTo((byte) 0).andDeletedEqualTo(false);
        PageHelper.startPage(offset, limit);
        return commentMapper.selectByExample(example);
    }

    public List<Comment> query(Byte type, Integer valueId, Integer showType, Integer offset, Integer limit) {
        if (null == type) type = CommonTypeConstant.PRODUCT_COMMENT;
        CommentExample example = new CommentExample();
        example.setOrderByClause(Comment.Column.addTime.desc());
        if (null == showType) {
            example.or().andValueIdEqualTo(valueId).andTypeEqualTo(type).andDeletedEqualTo(false);
        } else if (showType == 0) {
            example.or().andValueIdEqualTo(valueId).andTypeEqualTo(type).andDeletedEqualTo(false);
        } else if (showType == 1) {
            example.or().andValueIdEqualTo(valueId).andTypeEqualTo(type).andHasPictureEqualTo(true).andDeletedEqualTo(false);
        }
        if (null !=limit &&!StringUtils.isEmpty(String.valueOf(limit))
            &&null !=offset &&!StringUtils.isEmpty(String.valueOf(offset))) {
            PageHelper.startPage(offset, limit);
        }
        return commentMapper.selectByExample(example);
    }

    public List<Comment> queryReply(Integer valueId) {
        CommentExample example = new CommentExample();
        example.setOrderByClause(Comment.Column.addTime.asc());
        example.or().andValueIdEqualTo(valueId).andDeletedEqualTo(false);
//        PageHelper.startPage(offset, limit);
        return commentMapper.selectByExample(example);
    }

    public int count(Byte type, Integer valueId, Integer showType) {
        CommentExample example = new CommentExample();
        if (null == showType || showType == 0) {
            example.or().andValueIdEqualTo(valueId).andTypeEqualTo(type).andDeletedEqualTo(false);
        } else if (showType == 1) {
            example.or().andValueIdEqualTo(valueId).andTypeEqualTo(type).andHasPictureEqualTo(true).andDeletedEqualTo(false);
        }
        return (int) commentMapper.countByExample(example);
    }

    public int count(Byte type, Integer valueId) {
        CommentExample example = new CommentExample();
        example.or().andValueIdEqualTo(valueId).andTypeEqualTo(type).andDeletedEqualTo(false);
        return (int) commentMapper.countByExample(example);
    }

    public int save(Comment comment) {
        comment.setAddTime(LocalDateTime.now());
        comment.setUpdateTime(LocalDateTime.now());
        return commentMapper.insertSelective(comment);
    }

    public List<Comment> querySelective(byte type, String valueId, String userId, Integer page, Integer size, String sort, String order) {
        CommentExample example = new CommentExample();
        CommentExample.Criteria criteria = example.createCriteria();

//        criteria.andTypeNotEqualTo((byte) 2);

        if (!StringUtils.isEmpty(userId)) {
            criteria.andUserIdEqualTo(Integer.valueOf(userId));
        }
        if (!StringUtils.isEmpty(valueId)) {
            criteria.andValueIdEqualTo(Integer.valueOf(valueId));
        }
        if (!StringUtils.isEmpty(type)) {
            criteria.andTypeEqualTo(type);
        }
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, size);
        return commentMapper.selectByExample(example);
    }

    public void deleteById(Integer id) {
        List<Like> likes = likeService.findByValueId(id);
        for (Like like : likes) {
            likeService.deleteById(like.getId());
        }
        commentMapper.logicalDeleteByPrimaryKey(id);
    }

    public Comment findById(Integer id) {
        return commentMapper.selectByPrimaryKey(id);
    }

    public int updateById(Comment comment) {
        return commentMapper.updateByPrimaryKeySelective(comment);
    }

    public float countScore(Integer valueId) {
        CommentExample example = new CommentExample();
        example.or().andValueIdEqualTo(valueId).andTypeEqualTo(CommonTypeConstant.PRODUCT_COMMENT).andDeletedEqualTo(false);
        List<Comment> comments = commentMapper.selectByExample(example);
        if (comments.isEmpty()) return 0;
        float baseScore = comments.size() * 5;
        float totalScore = comments.stream().mapToInt(Comment::getStar).sum();
        return (totalScore / baseScore) * 10;
    }

    public List<String> getRecentTalkUserAvatar(int productId, int size) {
        Set<String> recentTalkUserAvatar = new HashSet<>();
        int total = this.count(CommonTypeConstant.PRODUCT_TALKING, productId, null);
        int page = 1;
        while (recentTalkUserAvatar.size() < size) {
            List<Comment> recentlyComments = this.querySelective(CommonTypeConstant.PRODUCT_TALKING, Integer.toString(productId), null,
                    page, size, "add_time", "desc");
            Set<String> collect = recentlyComments.stream()
                    .map(comment -> {
                        User user = userService.findById(comment.getUserId());
                        return user.getAvatar();
                    }).collect(Collectors.toSet());
            recentTalkUserAvatar.addAll(collect);
            total -= recentlyComments.size();
            if (total <= 0) return new ArrayList<>(recentTalkUserAvatar);
            page += 1;
        }
        return new ArrayList<>(recentTalkUserAvatar);
    }

    public void deleteByValueId(Integer valueId) {
        deleteByReply(valueId);
        CommentExample example = new CommentExample();
        example.or().andValueIdEqualTo(valueId);
        commentMapper.deleteByExample(example);

    }

    public void deleteByReply(Integer valueId) {
        CommentExample qeury = new CommentExample();
        qeury.or().andValueIdEqualTo(valueId);
        List<Comment> comments = commentMapper.selectByExample(qeury);
        if (comments.size() == 0) return ;
        List<Integer> ids = comments.stream().map(Comment::getId).collect(Collectors.toList());
        CommentExample example = new CommentExample();
        example.or().andValueIdIn(ids);
        commentMapper.deleteByExample(example);
    }
}
