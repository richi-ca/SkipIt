package com.skipit.backend.service;

import com.skipit.backend.config.JwtService;
import com.skipit.backend.dto.auth.AuthResponse;
import com.skipit.backend.dto.auth.LoginRequest;
import com.skipit.backend.dto.auth.RegisterRequest;
import com.skipit.backend.dto.user.UserDto;
import com.skipit.backend.entity.User;
import com.skipit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Verificar si el email ya existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Crear usuario
        // Mapear String gender a Enum
        User.Gender genderEnum = null;
        if (request.getGender() != null) {
            try {
                genderEnum = User.Gender.valueOf(request.getGender());
            } catch (IllegalArgumentException e) {
                // Manejar o dejar null
            }
        }

        var user = User.builder()
                .id(UUID.randomUUID().toString()) // Generar UUID
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.user_cli) // Por defecto es cliente
                .phone(request.getPhone())
                .dob(request.getDob())
                .gender(genderEnum)
                .hasPriorityAccess(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapUserToDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapUserToDto(user))
                .build();
    }

    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .dob(user.getDob())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .hasPriorityAccess(user.isHasPriorityAccess())
                .build();
    }
}
