package com.skipit.orders.service;

import com.skipit.orders.client.CatalogClient;
import com.skipit.orders.config.JwtService;
import com.skipit.orders.dto.external.EventDto;
import com.skipit.orders.dto.external.ProductVariationDto;
import com.skipit.orders.dto.order.CartItemDto;
import com.skipit.orders.dto.order.CreateOrderRequest;
import com.skipit.orders.dto.order.OrderDto;
import com.skipit.orders.dto.order.OrderItemDto;
import com.skipit.orders.entity.Order;
import com.skipit.orders.entity.OrderItem;
import com.skipit.orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
    private CatalogClient catalogClient;
    
    @Autowired
    private JwtService jwtService;

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, String token) {
        // 1. Obtener User ID del token (sin llamar a Auth Service, confiamos en el token)
        // El token viene como "Bearer <token>", necesitamos limpiarlo
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String userId;
        try {
            userId = jwtService.extractClaim(jwtToken, claims -> claims.get("userId", String.class));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        
        if (userId == null) {
            // Fallback: Si el claim userId no está, usamos el subject (email) o lanzamos error
            // Para mantener compatibilidad con el diseño, asumimos que Auth Service pone el userId en los claims
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token: userId claim missing");
        }

        // 2. Validar Evento (Llamada HTTP a Catalog Service)
        EventDto eventDto;
        try {
            eventDto = catalogClient.getEventById(request.getEventId());
        } catch (Exception e) {
            throw new RuntimeException("Event not found or Catalog Service unavailable");
        }

        // 3. Procesar Items y Calcular Total
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderId(orderId)
                .userId(userId) // Guardamos ID, no entidad
                .eventId(eventDto.getId()) // Guardamos ID
                .isoDate(LocalDate.now())
                .purchaseTime(LocalTime.now())
                .status(Order.OrderStatus.COMPLETED)
                .build();

        for (CartItemDto itemDto : request.getItems()) {
            // Llamada HTTP por cada item (Podría optimizarse con un endpoint batch en el futuro)
            ProductVariationDto variation;
            try {
                variation = catalogClient.getVariationById(itemDto.getVariationId());
            } catch (Exception e) {
                throw new RuntimeException("Product Variation not found: " + itemDto.getVariationId());
            }

            // Snapshot de datos
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .variationId(variation.getId())
                    .productName(variation.getProductName()) // Viene del DTO enriquecido
                    .variationName(variation.getName())
                    .quantity(itemDto.getQuantity())
                    .claimed(0)
                    .priceAtPurchase(variation.getPrice())
                    .build();

            orderItems.add(orderItem);

            // Sumar al total (Precio del backend * Cantidad)
            BigDecimal itemTotal = variation.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            total = total.add(itemTotal);
        }

        order.setItems(orderItems);
        order.setTotal(total);
        
        // Generar QR Data simple
        order.setQrCodeData("{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\"}");

        // 4. Guardar Orden
        Order savedOrder = orderRepository.save(order);

        return mapToDto(savedOrder, eventDto);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserHistory(String token) {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String userId;
        try {
            userId = jwtService.extractClaim(jwtToken, claims -> claims.get("userId", String.class));
        } catch (Exception e) {
             throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token: userId claim missing");
        }

        return orderRepository.findByUserIdOrderByIsoDateDesc(userId).stream()
                .map(order -> {
                    // Para el historial, necesitamos "inflar" el evento
                    // Nota: Esto podría ser lento (N+1 problema HTTP). 
                    // Solución ideal: Cachear eventos o guardar snapshot del nombre del evento en la Orden.
                    // Por ahora, hacemos la llamada.
                    EventDto eventDto = null;
                    try {
                        eventDto = catalogClient.getEventById(order.getEventId());
                    } catch (Exception e) {
                        // Si falla, retornamos un DTO vacío para no romper el historial
                        eventDto = EventDto.builder().id(order.getEventId()).name("Unknown Event").build();
                    }
                    return mapToDto(order, eventDto);
                })
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order, EventDto eventDto) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .variationId(item.getVariationId())
                        .productName(item.getProductName())
                        .variationName(item.getVariationName())
                        .quantity(item.getQuantity())
                        .claimed(item.getClaimed())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .build())
                .collect(Collectors.toList());

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
