package com.skipit.orders.dto.order;

import com.skipit.orders.dto.external.EventDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private String orderId;
    private EventDto event; // "Inflated" event data
    private LocalDate isoDate;
    private LocalTime purchaseTime;
    private BigDecimal total;
    private String status;
    private String qrCodeData;
    private List<OrderItemDto> items;
}
