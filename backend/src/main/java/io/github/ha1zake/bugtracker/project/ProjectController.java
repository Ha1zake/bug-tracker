package io.github.ha1zake.bugtracker.project;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(Principal principal,@Valid @RequestBody CreateProjectRequest request) {
        return projectService.create(principal.getName(), request);
    }
}
