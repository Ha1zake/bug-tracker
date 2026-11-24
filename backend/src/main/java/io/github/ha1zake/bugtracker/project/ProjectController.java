package io.github.ha1zake.bugtracker.project;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

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
    @GetMapping
    public List<ProjectResponse> listMine(Principal principal) {
        return projectService.listMine(principal.getName());
    }
    @GetMapping("/{projectId}")
    public ProjectResponse get( @PathVariable("projectId") UUID projectId, Principal principal) {
        return projectService.get(projectId, principal.getName());
    }
    @PutMapping("/{projectId}")
    public ProjectResponse update(@PathVariable("projectId") UUID projectId, @Valid @RequestBody UpdateProjectRequest request, Principal principal) {
        return projectService.update(projectId, principal.getName(), request);
    }
    @DeleteMapping("/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("projectId") UUID projectId, Principal principal) {
        projectService.delete(projectId, principal.getName());
    }
}
