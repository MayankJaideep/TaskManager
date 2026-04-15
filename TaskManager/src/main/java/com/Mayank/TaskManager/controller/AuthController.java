package com.Mayank.TaskManager.controller;

import com.Mayank.TaskManager.dto.request.LoginRequest;
import com.Mayank.TaskManager.dto.request.SignupRequest;
import com.Mayank.TaskManager.dto.response.JwtResponse;
import com.Mayank.TaskManager.dto.response.MessageResponse;
import com.Mayank.TaskManager.model.RefreshToken;
import com.Mayank.TaskManager.model.User;
import com.Mayank.TaskManager.repository.UserRepository;
import com.Mayank.TaskManager.security.JwtUtils;
import com.Mayank.TaskManager.security.UserDetailsImpl;
import com.Mayank.TaskManager.service.LoginAttemptService;
import com.Mayank.TaskManager.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    LoginAttemptService loginAttemptService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String loginKey = ipAddress + "-" + loginRequest.getUsername();
        if (loginAttemptService.isBlocked(loginKey)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new MessageResponse("Error: Too many login attempts. Account temporarily blocked."));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            loginAttemptService.loginSucceeded(loginKey);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(authentication);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            ResponseCookie jwtRefreshCookie = ResponseCookie.from("taskmanager-refresh-token", refreshToken.getToken())
                    .maxAge(24 * 60 * 60)
                    .httpOnly(true)
                    .path("/api/auth/refresh")
                    .secure(false) // Set to true for HTTPS
                    .sameSite("Strict")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                    .body(new JwtResponse(jwt,
                            userDetails.getId(),
                            userDetails.getUsername(),
                            userDetails.getEmail(),
                            roles));
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(loginKey);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Error: Invalid username or password!"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        System.out.println("[AuthController.register] Attempting to register user: " + signUpRequest.getUsername());
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            System.out.println("[AuthController.register] Username already exists: " + signUpRequest.getUsername());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            System.out.println("[AuthController.register] Email already in use: " + signUpRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);
        System.out.println("[AuthController.register] User saved successfully: " + signUpRequest.getUsername());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshtoken(@CookieValue(name = "taskmanager-refresh-token", required = false) String requestRefreshToken) {
        if (requestRefreshToken != null && !requestRefreshToken.isEmpty()) {
            return refreshTokenService.findByToken(requestRefreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUserId)
                    .map(userId -> {
                        User user = userRepository.findById(userId).orElseThrow();
                        String token = jwtUtils.generateTokenFromUsername(user.getUsername());
                        
                        // Rotate refresh token
                        refreshTokenService.deleteByToken(requestRefreshToken);
                        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(userId);
                        
                        ResponseCookie jwtRefreshCookie = ResponseCookie.from("taskmanager-refresh-token", newRefreshToken.getToken())
                            .maxAge(24 * 60 * 60)
                            .httpOnly(true)
                            .path("/api/auth/refresh")
                            .secure(false)
                            .sameSite("Strict")
                            .build();
                        
                        return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                            .body(new JwtResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRoles()));
                    })
                    .orElseThrow(() -> new com.Mayank.TaskManager.exception.TokenRefreshException(requestRefreshToken,
                            "Refresh token is not in database!"));
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Refresh Token is empty!"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            refreshTokenService.deleteByUserId(userDetails.getId());
        }

        ResponseCookie jwtRefreshCookie = ResponseCookie.from("taskmanager-refresh-token", "")
                .maxAge(0)
                .httpOnly(true)
                .path("/api/auth/refresh")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new MessageResponse("Log out successful!"));
    }
    @Autowired
    com.Mayank.TaskManager.service.PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        java.util.Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            com.Mayank.TaskManager.model.PasswordResetToken token = passwordResetService.createToken(user.getId());
            // Here you would typically send an email with the token.
            // For now, we simulate it by printing to console.
            System.out.println("password reset token for " + email + ": " + token.getToken());
            return ResponseEntity.ok(new MessageResponse("If the email exists, a password reset token has been generated. Check server logs for token"));
        }
        
        // Prevent enumerating emails
        return ResponseEntity.ok(new MessageResponse("If the email exists, a password reset token has been generated. Check server logs for token"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String tokenStr = request.get("token");
        String newPassword = request.get("newPassword");
        
        return passwordResetService.findByToken(tokenStr)
                .filter(token -> !passwordResetService.isExpired(token))
                .map(token -> {
                    User user = userRepository.findById(token.getUserId()).orElseThrow();
                    user.setPasswordHash(encoder.encode(newPassword));
                    userRepository.save(user);
                    passwordResetService.deleteToken(token);
                    return ResponseEntity.ok(new MessageResponse("Password successfully reset"));
                })
                .orElse(ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired password reset token")));
    }
}
