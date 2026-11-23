package io.github.ha1zake.bugtracker.project;

import java.util.UUID;

public record ProjectMembershipId(
        UUID project,
        UUID user
) {
}
