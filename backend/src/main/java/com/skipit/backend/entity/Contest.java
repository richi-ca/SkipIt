package com.skipit.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contests")
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "prize_text")
    private String prizeText;

    @Column(name = "end_date")
    private String endDate;

    @Column(name = "image_url")
    private String imageUrl;

    @Column
    private boolean active;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", columnDefinition = "ENUM('LINK', 'ADD_TO_CART', 'NONE')")
    private ActionType actionType;

    @Column(name = "action_url")
    private String actionUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_variation_id")
    private ProductVariation linkedVariation;

    public enum ActionType {
        LINK, ADD_TO_CART, NONE
    }
}
