package com.skipit.backend.service;

import com.skipit.backend.dto.event.EventDto;
import com.skipit.backend.dto.order.CartItemDto;
import com.skipit.backend.dto.order.CreateOrderRequest;
import com.skipit.backend.dto.order.OrderDto;
import com.skipit.backend.dto.order.OrderItemDto;
import com.skipit.backend.entity.*;
import com.skipit.backend.repository.EventRepository;
import com.skipit.backend.repository.OrderRepository;
import com.skipit.backend.repository.ProductVariationRepository;
import com.skipit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ProductVariationRepository productVariationRepository;

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, String userEmail) {
        // 1. Obtener Usuario
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Obtener Evento
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 3. Procesar Items y Calcular Total
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderId(orderId)
                .user(user)
                .event(event)
                .isoDate(LocalDate.now())
                .purchaseTime(LocalTime.now())
                .status(Order.OrderStatus.COMPLETED) // Asumimos pago exitoso por ahora
                .build();

        for (CartItemDto itemDto : request.getItems()) {
            ProductVariation variation = productVariationRepository.findById(itemDto.getVariationId())
                    .orElseThrow(() -> new RuntimeException("Product Variation not found: " + itemDto.getVariationId()));

            // Snapshot de datos
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .variation(variation)
                    .productName(variation.getProduct().getName())
                    .variationName(variation.getName())
                    .quantity(itemDto.getQuantity())
                    .claimed(0)
                    .priceAtPurchase(variation.getPrice())
                    .build();

            orderItems.add(orderItem);

            // Sumar al total
            BigDecimal itemTotal = variation.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            total = total.add(itemTotal);
        }

        order.setItems(orderItems);
        order.setTotal(total);
        
        // Generar QR Data simple (JSON String)
        order.setQrCodeData("{\"orderId\":\"" + orderId + "\",\"userId\":\"" + user.getId() + "\"}");

        // 4. Guardar Orden (Cascade guardará los items)
        Order savedOrder = orderRepository.save(order);

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserIdOrderByIsoDateDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .variationId(item.getVariation().getId())
                        .productName(item.getProductName())
                        .variationName(item.getVariationName())
                        .quantity(item.getQuantity())
                        .claimed(item.getClaimed())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .build())
                .collect(Collectors.toList());

        EventDto eventDto = EventDto.builder()
                .id(order.getEvent().getId())
                .name(order.getEvent().getName())
                .imageUrl(order.getEvent().getImageUrl())
                // Mapear otros campos básicos del evento si es necesario para el historial
                .build();

        return OrderDto.builder()
                .orderId(order.getOrderId())
                .event(eventDto)
                .isoDate(order.getIsoDate())
                .purchaseTime(order.getPurchaseTime())
                .total(order.getTotal())
                .status(order.getStatus().name())
                .qrCodeData(order.getQrCodeData())
                .items(itemDtos)
                .build();
    }
}
