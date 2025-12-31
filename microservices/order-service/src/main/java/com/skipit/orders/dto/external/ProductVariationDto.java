package com.skipit.orders.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariationDto {
    private Integer id;
    private String name;
    private String productName;
    private BigDecimal price;
    private Integer stock;
}
