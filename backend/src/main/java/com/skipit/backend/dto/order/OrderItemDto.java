package com.skipit.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Integer id;
    private Integer variationId;
    private String productName;
    private String variationName;
    private Integer quantity;
    private Integer claimed;
    private BigDecimal priceAtPurchase;
}
