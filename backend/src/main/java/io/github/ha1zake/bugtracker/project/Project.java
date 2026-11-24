package io.github.ha1zake.bugtracker.project;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, length = 120)
    private String name;
    private String description;
    protected  Project() {
    }
    public Project(String name, String description) {
        this.name = name;
        this.description = description;
    }
    public UUID getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getDescription() {
        return description;
    }
    public void updateDetails(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
