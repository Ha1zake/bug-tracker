package io.github.ha1zake.bugtracker.project;

import io.github.ha1zake.bugtracker.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMembershipRepository projectMembershipRepository;
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMembershipRepository projectMembershipRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMembershipRepository = projectMembershipRepository;
    }
    @Transactional
    public ProjectResponse create(String creatorEmail, CreateProjectRequest request) {
        var creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        var project = projectRepository.save(
                new Project(request.name().strip(), request.description())
        );
        projectMembershipRepository.save(
                new ProjectMembership(project, creator, ProjectRole.MANAGER)
        );
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                ProjectRole.MANAGER
        );
    }
    @Transactional(readOnly = true)
    public List<ProjectResponse> listMine(String email) {
        return projectMembershipRepository.findAllForUser(email).stream()
                .map(this::toResponse)
                .toList();
    }
    @Transactional(readOnly = true)
    public ProjectResponse get(UUID projectId, String email) {
        return toResponse(requireMembership(projectId, email));
    }
    @Transactional
    public ProjectResponse update(UUID projectId, String email, UpdateProjectRequest request) {
        ProjectMembership membership = requireManager(projectId, email);
        membership.getProject().updateDetails(
                request.name().strip(),
                request.description()
        );
        return toResponse(membership);
    }
    @Transactional
    public void delete(UUID projectId, String email) {
        requireManager(projectId, email);
        projectMembershipRepository.deleteAllForProject(projectId);
        projectRepository.deleteById(projectId);
    }
    private ProjectResponse toResponse(ProjectMembership membership) {
        Project project = membership.getProject();
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                membership.getRole()
        );
    }
    private ProjectMembership requireMembership(UUID projectId, String email) {
        return projectMembershipRepository.findForUser(projectId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    private ProjectMembership requireManager(UUID projectId, String email) {
        ProjectMembership membership = requireMembership(projectId, email);
        if(membership.getRole() != ProjectRole.MANAGER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return membership;
    }
}
