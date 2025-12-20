package com.skipit.backend.repository;

import com.skipit.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    // Buscar órdenes por usuario
    List<Order> findByUserIdOrderByIsoDateDesc(String userId);
}
