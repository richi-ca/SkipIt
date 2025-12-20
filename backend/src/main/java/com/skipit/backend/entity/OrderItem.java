package com.skipit.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variation_id", nullable = false)
    private ProductVariation variation;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "variation_name", nullable = false)
    private String variationName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer claimed;

    @Column(name = "price_at_purchase", nullable = false)
    private BigDecimal priceAtPurchase;
}
