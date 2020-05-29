package org.golfworld.core.validator;

import com.google.common.collect.Lists;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class OrderValidator implements ConstraintValidator<OrderValidateInterface, String> {
    private List<String> valueList;

    @Override
    public void initialize(OrderValidateInterface order) {
        valueList = Lists.newArrayList();
        for (String val : order.accepts()) {
            valueList.add(val.toUpperCase());
        }
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (!valueList.contains(s.toUpperCase())) {
            return false;
        }
        return true;
    }
}
