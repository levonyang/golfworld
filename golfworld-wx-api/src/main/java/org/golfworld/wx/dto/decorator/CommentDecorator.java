package org.golfworld.wx.dto.decorator;

import org.golfworld.db.domain.Comment;
import org.golfworld.db.service.CommentService;
import org.golfworld.db.service.LikeService;
import org.golfworld.db.util.CommonTypeConstant;
import org.golfworld.db.util.LikeTypeConstant;
import org.golfworld.wx.dto.CommentInfo;
import org.golfworld.wx.dto.UserInfo;
import org.golfworld.wx.service.UserInfoService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentDecorator extends CommentService {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserInfoService userService;

    public CommentInfo convert(Comment comment, Integer userId) {
        CommentInfo commentInfo = new CommentInfo();
        Integer CommentId = comment.getId();
        BeanUtils.copyProperties(comment, commentInfo);
        Integer userHasLike = 0;
        if (userId != null) {
            userHasLike = likeService.count(userId, CommentId, LikeTypeConstant.LIKE);
        }
        commentInfo.setUserHasLike(userHasLike);
        commentInfo.setLike(likeService.count(CommentId));
        UserInfo userInfo = userService.getInfo(comment.getUserId());
        if (null != comment.getReplyTo()) {
            UserInfo replyTo = userService.getInfo(comment.getReplyTo());
            commentInfo.setReplyTo(replyTo);
        }
        commentInfo.setUserInfo(userInfo);
        return commentInfo;
    }

    public List<CommentInfo> convertList(List<Comment> CommentList, Integer userId) {
        List<CommentInfo> collect = CommentList.stream().parallel().map(Comment -> {
            CommentInfo commentInfo = this.convert(Comment, userId);
            if (commentInfo.getType() != CommonTypeConstant.REPLY) {
                List<Comment> comments = this.queryReply(commentInfo.getId());
                if (comments.size() > 0) {
                    List<CommentInfo> commentInfos = this.convertList(comments, userId);
                    commentInfo.setReplyList(commentInfos);
                }
            }
            return commentInfo;
        }).collect(Collectors.toList());
        return collect;
    }

    public List<CommentInfo> convertList(List<Comment> CommentList) {
        List<CommentInfo> collect = CommentList.stream().parallel().map(Comment -> {
            CommentInfo commentInfo = this.convert(Comment, null);
            List<Comment> comments = this.queryReply(commentInfo.getId());
            if (comments.size() > 0) {
                List<CommentInfo> commentInfos = this.convertList(comments);
                commentInfo.setReplyList(commentInfos);
            }
            return commentInfo;
        }).collect(Collectors.toList());
        return collect;
    }


}
