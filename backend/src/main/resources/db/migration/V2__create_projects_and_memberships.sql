CREATE TABLE projects (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT
);

CREATE TABLE project_memberships (
    project_id UUID NOT NULL REFERENCES projects(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) NOT NULL
                                 CHECK (role in ('MANAGER', 'DEVELOPER', 'TESTER', 'UNASSIGNED')),
    PRIMARY KEY (project_id, user_id)
);