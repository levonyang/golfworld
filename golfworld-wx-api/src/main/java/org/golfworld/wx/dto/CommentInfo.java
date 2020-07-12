package org.golfworld.wx.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CommentInfo {
    private Integer id ;
    private Integer userId ;
    private UserInfo userInfo;
    private UserInfo replyTo;
    private List<CommentInfo> replyList;
    private Integer valueId;
    private Byte type;
    private String content;
    private String adminContent;
    private Boolean hasPicture;
    private String picList;
    private Short star;
    private LocalDateTime addTime;
    private LocalDateTime updateTime;
    private String lightspot;
    private Integer userHasLike;
    /**
     * comment like total
     */
    private Integer like;



    public Integer getValueId() {
        return valueId;
    }

    public void setValueId(Integer valueId) {
        this.valueId = valueId;
    }

    public Byte getType() {
        return type;
    }

    public void setType(Byte type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAdminContent() {
        return adminContent;
    }

    public void setAdminContent(String adminContent) {
        this.adminContent = adminContent;
    }

    public String getPicList() {
        return picList;
    }

    public void setPicList(String picList) {
        this.picList = picList;
    }

    public Boolean getHasPicture() {
        return hasPicture;
    }

    public void setHasPicture(Boolean hasPicture) {
        this.hasPicture = hasPicture;
    }


    public Short getStar() {
        return star;
    }

    public void setStar(Short star) {
        this.star = star;
    }

    public LocalDateTime getAddTime() {
        return addTime;
    }

    public void setAddTime(LocalDateTime addTime) {
        this.addTime = addTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }


    public String getLightspot() {
        return lightspot;
    }

    public void setLightspot(String lightspot) {
        this.lightspot = lightspot;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public UserInfo getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(UserInfo replyTo) {
        this.replyTo = replyTo;
    }

    public List<CommentInfo> getReplyList() {
        return replyList;
    }

    public void setReplyList(List<CommentInfo> replyList) {
        this.replyList = replyList;
    }

    public Integer getUserHasLike() {
        return userHasLike;
    }

    public void setUserHasLike(Integer userHasLike) {
        this.userHasLike = userHasLike;
    }

    public Integer getLike() {
        return like;
    }

    public void setLike(Integer like) {
        this.like = like;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
