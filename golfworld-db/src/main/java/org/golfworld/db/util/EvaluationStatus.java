package org.golfworld.db.util;

public enum EvaluationStatus {
    PENDING(0, "未开始"),
    APPLYING(1, "申请中"),
    CONFIRMING(2, "确认中"),
    EXPERIENCING(3, "体验中"),
    END(4, "已结束"),
    ;

    EvaluationStatus(int code, String label) {
        this.code = code;
        this.label = label;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    private Integer code;
    private String label;

}
