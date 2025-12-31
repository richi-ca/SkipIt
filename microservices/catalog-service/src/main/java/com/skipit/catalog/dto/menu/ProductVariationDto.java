package com.skipit.catalog.dto.menu;

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
    private String name; // Nombre de la variación (330ml)
    private String productName; // Nombre del producto padre (Corona) - NUEVO CAMPO
    private BigDecimal price;
    private Integer stock;
}