package com.skipit.orders.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "user_id", nullable = false)
    private String userId; // Refactorizado: ID directo

    @Column(name = "event_id", nullable = false)
    private Integer eventId; // Refactorizado: ID directo

    @Column(name = "iso_date", nullable = false)
    private LocalDate isoDate;

    @Column(name = "purchase_time")
    private LocalTime purchaseTime;

    @Column(nullable = false)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('COMPLETED', 'PARTIALLY_CLAIMED', 'FULLY_CLAIMED', 'CANCELLED')")
    private OrderStatus status;

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public enum OrderStatus {
        COMPLETED, PARTIALLY_CLAIMED, FULLY_CLAIMED, CANCELLED
    }
}
