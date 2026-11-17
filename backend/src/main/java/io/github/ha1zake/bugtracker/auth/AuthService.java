package io.github.ha1zake.bugtracker.auth;

import io.github.ha1zake.bugtracker.auth.dto.RegisterRequest;
import io.github.ha1zake.bugtracker.auth.dto.RegisterResponse;
import io.github.ha1zake.bugtracker.user.User;
import io.github.ha1zake.bugtracker.user.UserRepository;
import org.hibernate.exception.ConstraintViolationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException();
        }
        String passwordHash = passwordEncoder.encode(request.password());
        User user = new User(
                request.displayName(),
                request.email(),
                passwordHash
        );
        try {
            userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            Throwable cause = exception;
            while (cause != null) {
                if (cause instanceof ConstraintViolationException violation
                        && "uq_users_email".equals(violation.getConstraintName())) {
                    throw new EmailAlreadyRegisteredException();
                }
                cause = cause.getCause();
            }
            throw exception;
        }
        return new RegisterResponse(
                user.getId(),
                user.getDisplayName(),
                user.getEmail()
        );
    }
}
