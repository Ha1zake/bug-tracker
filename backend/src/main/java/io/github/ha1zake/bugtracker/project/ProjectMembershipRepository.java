package io.github.ha1zake.bugtracker.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, ProjectMembershipId> {
}
