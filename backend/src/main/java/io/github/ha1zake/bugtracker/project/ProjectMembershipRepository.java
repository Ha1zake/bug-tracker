package io.github.ha1zake.bugtracker.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, ProjectMembershipId> {
    @Query("""
select ms from ProjectMembership ms
join fetch ms.project p
where ms.user.email = :email
order by p.name, p.id
""")
    List<ProjectMembership> findAllForUser(@Param("email") String email);
    @Query("""
select ms from ProjectMembership ms
join fetch ms.project p
where p.id = :projectId and ms.user.email = :email
""")
    Optional<ProjectMembership> findForUser(@Param("projectId") UUID projectId, @Param("email") String email);
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from ProjectMembership ms where ms.project.id = :projectId")
    void deleteAllForProject(@Param("projectId") UUID projectId);
}
