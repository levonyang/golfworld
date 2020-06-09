package org.golfworld.wx.task;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.system.SystemConfig;
import org.golfworld.core.task.Task;
import org.golfworld.core.util.BeanUtil;
import org.golfworld.db.domain.Order;

import org.golfworld.db.service.OrderService;
import org.golfworld.db.util.OrderUtil;

import java.time.LocalDateTime;
import java.util.List;

public class OrderUnpaidTask extends Task {
    private final Log logger = LogFactory.getLog(OrderUnpaidTask.class);
    private int orderId = -1;

    public OrderUnpaidTask(Integer orderId, long delayInMilliseconds){
        super("OrderUnpaidTask-" + orderId, delayInMilliseconds);
        this.orderId = orderId;
    }

    public OrderUnpaidTask(Integer orderId){
        super("OrderUnpaidTask-" + orderId, SystemConfig.getOrderUnpaid() * 60 * 1000);
        this.orderId = orderId;
    }

    @Override
    public void run() {
        logger.info("系统开始处理延时任务---订单超时未付款---" + this.orderId);

    }
}
