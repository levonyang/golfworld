package org.golfworld.wx.dto;

public class SensitiveValidateResult {
    private int errcode;
    private String errMsg;

    public int getErrcode() {
        return errcode;
    }

    public void setErrcode(int errcode) {
        this.errcode = errcode;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

    public Boolean isPass(){
       return this.errcode == 0 ;
    }
}
