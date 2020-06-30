package org.golfworld.core.system;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * 系统设置
 */
public class SystemConfig {
    // 小程序相关配置
    public final static String WX_INDEX_NEW = "wx_index_new";
    public final static String WX_INDEX_HOT = "wx_index_hot";
    public final static String WX_INDEX_BRAND = "wx_index_brand";
    public final static String WX_INDEX_TOPIC = "wx_index_topic";
    public final static String WX_INDEX_CATLOG_LIST = "wx_catlog_list";
    public final static String WX_INDEX_CATLOG_GOODS = "wx_catlog_product";
    public final static String WX_SHARE = "wx_share";
    // 运费相关配置
    public final static String EXPRESS_FREIGHT_VALUE = "express_freight_value";
    public final static String EXPRESS_FREIGHT_MIN = "express_freight_min";
    // 订单相关配置
    public final static String ORDER_UNPAID = "order_unpaid";
    public final static String ORDER_UNCONFIRM = "order_unconfirm";
    public final static String ORDER_COMMENT = "order_comment";
    // 商场相关配置
    public final static String MALL_NAME = "mall_name";
    public final static String MALL_ADDRESS = "mall_address";
    public final static String MALL_PHONE = "mall_phone";
    public final static String MALL_QQ = "mall_qq";
    public final static String MALL_LONGITUDE = "mall_longitude";
    public final static String MALL_Latitude = "mall_latitude";

    //所有的配置均保存在该 HashMap 中
    private static Map<String, String> SYSTEM_CONFIGS = new HashMap<>();

    private static String getConfig(String keyName) {
        return SYSTEM_CONFIGS.get(keyName);
    }

    private static Integer getConfigInt(String keyName) {
        return Integer.parseInt(SYSTEM_CONFIGS.get(keyName));
    }

    private static Boolean getConfigBoolean(String keyName) {
        return Boolean.valueOf(SYSTEM_CONFIGS.get(keyName));
    }

    private static BigDecimal getConfigBigDec(String keyName) {
        return new BigDecimal(SYSTEM_CONFIGS.get(keyName));
    }

    public static Integer getNewLimit() {
        return getConfigInt(WX_INDEX_NEW);
    }

    public static Integer getHotLimit() {
        return getConfigInt(WX_INDEX_HOT);
    }

    public static Integer getBrandLimit() {
        return getConfigInt(WX_INDEX_BRAND);
    }

    public static Integer getTopicLimit() {
        return getConfigInt(WX_INDEX_TOPIC);
    }

    public static Integer getCatlogListLimit() {
        return getConfigInt(WX_INDEX_CATLOG_LIST);
    }

    public static Integer getCatlogMoreLimit() {
        return getConfigInt(WX_INDEX_CATLOG_GOODS);
    }

    public static boolean isAutoCreateShareImage() {
        return getConfigBoolean(WX_SHARE);
    }

    public static BigDecimal getFreight() {
        return getConfigBigDec(EXPRESS_FREIGHT_VALUE);
    }

    public static BigDecimal getFreightLimit() {
        return getConfigBigDec(EXPRESS_FREIGHT_MIN);
    }

    public static Integer getOrderUnpaid() {
        return getConfigInt(ORDER_UNPAID);
    }

    public static Integer getOrderUnconfirm() {
        return getConfigInt(ORDER_UNCONFIRM);
    }

    public static Integer getOrderComment() {
        return getConfigInt(ORDER_COMMENT);
    }

    public static String getMallName() {
        return getConfig(MALL_NAME);
    }

    public static String getMallAddress() {
        return getConfig(MALL_ADDRESS);
    }

    public static String getMallPhone() {
        return getConfig(MALL_PHONE);
    }

    public static String getMallQQ() {
        return getConfig(MALL_QQ);
    }

    public static String getMallLongitude() {
        return getConfig(MALL_LONGITUDE);
    }

    public static String getMallLatitude() {
        return getConfig(MALL_Latitude);
    }

    public static void setConfigs(Map<String, String> configs) {
        SYSTEM_CONFIGS = configs;
    }

    public static void updateConfigs(Map<String, String> data) {
        for (Map.Entry<String, String> entry : data.entrySet()) {
            SYSTEM_CONFIGS.put(entry.getKey(), entry.getValue());
        }
    }
}