package com.skipit.backend.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    
    @NotNull(message = "Variation ID is required")
    private Integer variationId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
