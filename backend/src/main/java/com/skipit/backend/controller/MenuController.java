package com.skipit.backend.controller;

import com.skipit.backend.dto.menu.MenuDto;
import com.skipit.backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> getMenuById(@PathVariable Integer id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }
}
