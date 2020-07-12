package org.golfworld.wx.vo;

import java.time.LocalDateTime;

public class BallPackVo {
    private Integer id;
    private String title;
    private String desc;
    private String picUrl;
    private  Integer userHasCollect;
    private Integer collectAmount ;
    private LocalDateTime updateTime;
    private LocalDateTime addTime;
    private long total;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserHasCollect() {
        return userHasCollect;
    }

    public void setUserHasCollect(Integer userHasCollect) {
        this.userHasCollect = userHasCollect;
    }

    public Integer getCollectAmount() {
        return collectAmount;
    }

    public void setCollectAmount(Integer collectAmount) {
        this.collectAmount = collectAmount;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public LocalDateTime getAddTime() {
        return addTime;
    }


    public void setAddTime(LocalDateTime addTime) {
        this.addTime = addTime;
    }
}
