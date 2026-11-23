package io.github.ha1zake.bugtracker.project;

import io.github.ha1zake.bugtracker.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
}
