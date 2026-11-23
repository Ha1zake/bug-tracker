package io.github.ha1zake.bugtracker.project;

import jakarta.persistence.*;
import io.github.ha1zake.bugtracker.user.User;

@Entity
@Table(name = "project_membership")
@IdClass(ProjectMembershipId.class)
public class ProjectMembership {
    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectRole role;
    protected ProjectMembership() {
    }
    public ProjectMembership(Project project, User user, ProjectRole role) {
        this.project = project;
        this.user = user;
        this.role = role;
    }
}
