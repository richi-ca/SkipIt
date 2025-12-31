package com.skipit.orders.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Integer id;
    private String name;
    private LocalDate isoDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private String imageUrl;
    private BigDecimal price;
}
