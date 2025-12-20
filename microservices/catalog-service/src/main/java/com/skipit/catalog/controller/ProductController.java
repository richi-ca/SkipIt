package com.skipit.catalog.controller;

import com.skipit.catalog.dto.menu.ProductVariationDto;
import com.skipit.catalog.entity.ProductVariation;
import com.skipit.catalog.repository.ProductVariationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductVariationRepository variationRepository;

    @GetMapping("/variations/{id}")
    public ResponseEntity<ProductVariationDto> getVariationById(@PathVariable Integer id) {
        ProductVariation variation = variationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variation not found"));

        return ResponseEntity.ok(ProductVariationDto.builder()
                .id(variation.getId())
                .name(variation.getName())
                .productName(variation.getProduct().getName()) // Ahora sí podemos enviar esto
                .price(variation.getPrice())
                .stock(variation.getStock())
                .build());
    }
}