package org.golfworld.admin.task;

import org.golfworld.core.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminTaskStartupRunner implements ApplicationRunner {

    @Autowired
    private TaskService taskService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
//        List<GrouponRules> grouponRulesList = rulesService.queryByStatus(GrouponConstant.RULE_STATUS_ON);
//        for(GrouponRules grouponRules : grouponRulesList){
//            LocalDateTime now = LocalDateTime.now();
//            LocalDateTime expire =  grouponRules.getExpireTime();
//            if(expire.isBefore(now)) {
//                // 已经过期，则加入延迟队列
//                taskService.addTask(new GrouponRuleExpiredTask(grouponRules.getId(), 0));
//            }
//            else{
//                // 还没过期，则加入延迟队列
//                long delay = ChronoUnit.MILLIS.between(now, expire);
//                taskService.addTask(new GrouponRuleExpiredTask(grouponRules.getId(), delay));
//            }
//        }
    }
}