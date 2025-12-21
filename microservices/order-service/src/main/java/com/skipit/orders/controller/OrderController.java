package com.skipit.orders.controller;

import com.skipit.orders.dto.order.CreateOrderRequest;
import com.skipit.orders.dto.order.OrderDto;
import com.skipit.orders.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody @Valid CreateOrderRequest request,
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(orderService.createOrder(request, token));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<OrderDto>> getMyHistory(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(orderService.getUserHistory(token));
    }

    @PostMapping("/{orderId}/claim")
    public ResponseEntity<OrderDto> claimOrder(
            @PathVariable String orderId,
            @RequestBody com.skipit.orders.dto.order.ClaimOrderRequest request
    ) {
        return ResponseEntity.ok(orderService.claimOrder(orderId, request));
    }
}
