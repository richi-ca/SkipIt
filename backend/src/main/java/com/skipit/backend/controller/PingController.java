package com.skipit.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ping")
public class PingController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "SkipIT Backend is running!");
        
        try (Connection conn = dataSource.getConnection()) {
            response.put("database", "Connected");
            response.put("db_product", conn.getMetaData().getDatabaseProductName());
            response.put("db_version", conn.getMetaData().getDatabaseProductVersion());
        } catch (SQLException e) {
            response.put("database", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }

        return ResponseEntity.ok(response);
    }
}
