package com.Mayank.TaskManager.service;

import com.Mayank.TaskManager.model.PasswordResetToken;
import com.Mayank.TaskManager.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetToken createToken(String userId) {
        PasswordResetToken token = new PasswordResetToken();
        token.setUserId(userId);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(Instant.now().plusSeconds(15 * 60)); // 15 mins
        return passwordResetTokenRepository.save(token);
    }

    public Optional<PasswordResetToken> findByToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    public boolean isExpired(PasswordResetToken token) {
        return token.getExpiresAt().isBefore(Instant.now());
    }

    public void deleteToken(PasswordResetToken token) {
        passwordResetTokenRepository.delete(token);
    }
}
