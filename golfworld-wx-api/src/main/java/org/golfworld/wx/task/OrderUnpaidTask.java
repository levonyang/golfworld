package org.golfworld.wx.task;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.golfworld.core.system.SystemConfig;
import org.golfworld.core.task.Task;
import org.golfworld.core.util.BeanUtil;
import org.golfworld.db.domain.Order;
import org.golfworld.db.domain.OrderGoods;
import org.golfworld.db.service.GoodsProductService;
import org.golfworld.db.service.OrderGoodsService;
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

        OrderService orderService = BeanUtil.getBean(OrderService.class);
        OrderGoodsService orderGoodsService = BeanUtil.getBean(OrderGoodsService.class);
        GoodsProductService productService = BeanUtil.getBean(GoodsProductService.class);

        Order order = orderService.findById(this.orderId);
        if(order == null){
            return;
        }
        if(!OrderUtil.isCreateStatus(order)){
            return;
        }

        // 设置订单已取消状态
        order.setOrderStatus(OrderUtil.STATUS_AUTO_CANCEL);
        order.setEndTime(LocalDateTime.now());
        if (orderService.updateWithOptimisticLocker(order) == 0) {
            throw new RuntimeException("更新数据已失效");
        }

        // 商品货品数量增加
        Integer orderId = order.getId();
        List<OrderGoods> orderGoodsList = orderGoodsService.queryByOid(orderId);
        for (OrderGoods orderGoods : orderGoodsList) {
            Integer productId = orderGoods.getProductId();
            Short number = orderGoods.getNumber();
            if (productService.addStock(productId, number) == 0) {
                throw new RuntimeException("商品货品库存增加失败");
            }
        }
        logger.info("系统结束处理延时任务---订单超时未付款---" + this.orderId);
    }
}
