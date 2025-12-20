package com.skipit.backend.controller;

import com.skipit.backend.dto.order.CreateOrderRequest;
import com.skipit.backend.dto.order.OrderDto;
import com.skipit.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody @Valid CreateOrderRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(orderService.createOrder(request, userEmail));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<OrderDto>> getMyHistory() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(orderService.getUserHistory(userEmail));
    }
}
