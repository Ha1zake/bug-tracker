document.addEventListener('DOMContentLoaded', async () => {
  const projectId = getQueryParam('id');
  const ctx = await initAppShell({ activeProjectId: projectId });
  if (!ctx) return;

  const errorBox = document.getElementById('page-error');
  const errorText = document.getElementById('page-error-text');
  const projectView = document.getElementById('project-view');

  if (!projectId) {
    errorText.textContent = 'Не указан идентификатор проекта.';
    errorBox.hidden = false;
    return;
  }

  try {
    const project = await apiRequest(`/api/projects/${encodeURIComponent(projectId)}`);
    const roleLabel = formatRole(project.role);

    document.title = `${project.name} — Баг-трекер`;
    document.getElementById('breadcrumb-name').textContent = project.name;
    document.getElementById('project-name').textContent = project.name;
    document.getElementById('project-role').textContent = roleLabel;
    document.getElementById('project-role-box').textContent = roleLabel;
    document.getElementById('project-id').textContent = project.id;
    document.getElementById('project-description').textContent =
      project.description || 'Описание проекта не указано.';

    if (project.role === 'MANAGER') {
      document.getElementById('edit-project-link').href =
        `project-edit.html?id=${encodeURIComponent(project.id)}`;
      document.getElementById('delete-project-link').href =
        `project-delete.html?id=${encodeURIComponent(project.id)}`;
      document.getElementById('manager-edit-actions').hidden = false;
      document.getElementById('manager-danger-zone').hidden = false;
    }

    projectView.hidden = false;
  } catch (err) {
    if (err.status === 401) {
      window.location.replace('login.html');
      return;
    }
    errorText.textContent =
      err.status === 404
        ? 'Проект не найден или у вас нет к нему доступа.'
        : err.detail;
    errorBox.hidden = false;
  }
});
