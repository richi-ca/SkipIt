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
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "discount_text")
    private String discountText;

    @Enumerated(EnumType.STRING)
    @Column(name = "style_variant", columnDefinition = "ENUM('orange-red', 'blue-purple', 'green-emerald')")
    private StyleVariant styleVariant;

    @Column(name = "icon_name")
    private String iconName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column
    private boolean active;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", columnDefinition = "ENUM('LINK', 'ADD_TO_CART', 'NONE')")
    private ActionType actionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_variation_id")
    private ProductVariation linkedVariation;

    public enum StyleVariant {
        orange_red("orange-red"), 
        blue_purple("blue-purple"), 
        green_emerald("green-emerald");

        private final String value;
        StyleVariant(String value) { this.value = value; }
        public String getValue() { return value; }
    }

    public enum ActionType {
        LINK, ADD_TO_CART, NONE
    }
}
