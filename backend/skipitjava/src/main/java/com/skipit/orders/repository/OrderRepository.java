package com.skipit.orders.repository;

import com.skipit.orders.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    // Buscar órdenes por userId (String)
    List<Order> findByUserIdOrderByIsoDateDesc(String userId);
}
