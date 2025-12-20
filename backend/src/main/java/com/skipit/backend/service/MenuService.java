package com.skipit.backend.service;

import com.skipit.backend.dto.menu.CategoryDto;
import com.skipit.backend.dto.menu.MenuDto;
import com.skipit.backend.dto.menu.ProductDto;
import com.skipit.backend.dto.menu.ProductVariationDto;
import com.skipit.backend.entity.Category;
import com.skipit.backend.entity.Menu;
import com.skipit.backend.entity.Product;
import com.skipit.backend.entity.ProductVariation;
import com.skipit.backend.repository.MenuRepository;
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
