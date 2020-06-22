package org.golfworld.wx.dto;

import java.time.LocalDate;
import java.util.List;

public class ProductInfo {

    private Integer id;
    private String name;
    private Integer categoryId;
    private Integer brandId;
    private String gallery;
    private String brief;
    private String picUrl;
    private Boolean isHot;
    private LocalDate releaseTime;
    private int releaseTimeAfterStr;
    private float score;
    private int commentAmount;
    private int talkingAmount;
    private int like;
    /**
     * recent five user
     */
    private List<String> recentTalkUserAvatar;

    public int getLike() {
        return like;
    }

    public void setLike(int like) {
        this.like = like;
    }

    public String getBrief() {
        return brief;
    }

    public void setBrief(String brief) {
        this.brief = brief;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Integer getBrandId() {
        return brandId;
    }

    public void setBrandId(Integer brandId) {
        this.brandId = brandId;
    }

    public String getGallery() {
        return gallery;
    }

    public void setGallery(String gallery) {
        this.gallery = gallery;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public int getReleaseTimeAfterStr() {
        return releaseTimeAfterStr;
    }

    public void setReleaseTimeAfterStr(int releaseTimeAfterStr) {
        this.releaseTimeAfterStr = releaseTimeAfterStr;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public Boolean getHot() {
        return isHot;
    }

    public void setHot(Boolean hot) {
        isHot = hot;
    }

    public LocalDate getReleaseTime() {
        return releaseTime;
    }

    public void setReleaseTime(LocalDate releaseTime) {
        this.releaseTime = releaseTime;
    }

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }

    public int getCommentAmount() {
        return commentAmount;
    }

    public void setCommentAmount(int commentAmount) {
        this.commentAmount = commentAmount;
    }

    public int getTalkingAmount() {
        return talkingAmount;
    }

    public void setTalkingAmount(int talkingAmount) {
        this.talkingAmount = talkingAmount;
    }

    public List<String> getRecentTalkUserAvatar() {
        return recentTalkUserAvatar;
    }

    public void setRecentTalkUserAvatar(List<String> recentTalkUserAvatar) {
        this.recentTalkUserAvatar = recentTalkUserAvatar;
    }
}