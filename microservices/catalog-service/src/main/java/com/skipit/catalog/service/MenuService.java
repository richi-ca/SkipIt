package com.skipit.catalog.service;

import com.skipit.catalog.dto.menu.CategoryDto;
import com.skipit.catalog.dto.menu.MenuDto;
import com.skipit.catalog.dto.menu.ProductDto;
import com.skipit.catalog.dto.menu.ProductVariationDto;
import com.skipit.catalog.entity.Category;
import com.skipit.catalog.entity.Menu;
import com.skipit.catalog.entity.Product;
import com.skipit.catalog.entity.ProductVariation;
import com.skipit.catalog.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public MenuDto getMenuById(Integer id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with ID: " + id));
        return mapToDto(menu);
    }

    // --- Mappers ---

    private MenuDto mapToDto(Menu menu) {
        // Ordenar categorías por displayOrder
        List<CategoryDto> categoryDtos = menu.getCategories().stream()
                .sorted(Comparator.comparingInt(c -> c.getDisplayOrder() != null ? c.getDisplayOrder() : 0))
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());

        return MenuDto.builder()
                .id(menu.getId())
                .name(menu.getName())
                .categories(categoryDtos)
                .build();
    }

    private CategoryDto mapCategoryToDto(Category category) {
        List<ProductDto> productDtos = category.getProducts().stream()
                .map(this::mapProductToDto)
                .collect(Collectors.toList());

        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .displayOrder(category.getDisplayOrder())
                .products(productDtos)
                .build();
    }

    private ProductDto mapProductToDto(Product product) {
        List<ProductVariationDto> variationDtos = product.getVariations().stream()
                .map(this::mapVariationToDto)
                .collect(Collectors.toList());

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .variations(variationDtos)
                .build();
    }

    private ProductVariationDto mapVariationToDto(ProductVariation variation) {
        return ProductVariationDto.builder()
                .id(variation.getId())
                .name(variation.getName())
                .price(variation.getPrice())
                .stock(variation.getStock())
                .build();
    }
}
