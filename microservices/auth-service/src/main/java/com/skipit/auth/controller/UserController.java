package com.skipit.auth.controller;

import com.skipit.auth.config.JwtService;
import com.skipit.auth.dto.user.UserDto;
import com.skipit.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@RequestHeader("Authorization") String token) {
        // Extract email from token
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtService.extractUsername(jwtToken);
        
        return ResponseEntity.ok(authService.getUserByEmail(email));
    }

    @org.springframework.web.bind.annotation.PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @RequestHeader("Authorization") String token,
            @org.springframework.web.bind.annotation.RequestBody UserDto request
    ) {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtService.extractUsername(jwtToken);
        
        return ResponseEntity.ok(authService.updateUser(email, request));
    }
}
