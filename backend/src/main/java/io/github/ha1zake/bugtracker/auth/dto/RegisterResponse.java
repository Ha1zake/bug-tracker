package io.github.ha1zake.bugtracker.auth.dto;

import java.util.UUID;

public record RegisterResponse(
        UUID id,
        String displayName,
        String email
) {
}
