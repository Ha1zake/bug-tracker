document.addEventListener('DOMContentLoaded', async () => {
  const projectId = getQueryParam('id');
  const ctx = await initAppShell({ activeProjectId: projectId });
  if (!ctx) return;

  const pageError = document.getElementById('page-error');
  const pageErrorText = document.getElementById('page-error-text');
  const deleteView = document.getElementById('delete-view');

  if (!projectId) {
    pageErrorText.textContent = 'Не указан идентификатор проекта.';
    pageError.hidden = false;
    return;
  }

  const projectUrl = `project.html?id=${encodeURIComponent(projectId)}`;

  let project;
  try {
    project = await apiRequest(`/api/projects/${encodeURIComponent(projectId)}`);
  } catch (err) {
    if (err.status === 401) {
      window.location.replace('login.html');
      return;
    }
    pageErrorText.textContent =
      err.status === 404 ? 'Проект не найден.' : err.detail;
    pageError.hidden = false;
    return;
  }

  if (project.role !== 'MANAGER') {
    pageErrorText.textContent = 'Удалить проект может только руководитель.';
    pageError.hidden = false;
    return;
  }

  const breadcrumbLink = document.getElementById('breadcrumb-project-link');
  breadcrumbLink.href = projectUrl;
  breadcrumbLink.textContent = project.name;
  document.getElementById('project-subtitle').textContent =
    `${project.name} · Управление проектом`;
  document.getElementById('confirm-title').textContent =
    `Удалить проект «${project.name}»?`;
  document.getElementById('cancel-link').href = projectUrl;

  deleteView.hidden = false;

  const deleteBtn = document.getElementById('confirm-delete-btn');
  deleteBtn.addEventListener('click', async () => {
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Удаление...';

    try {
      await apiRequest(`/api/projects/${encodeURIComponent(projectId)}`, {
        method: 'DELETE',
      });
      window.location.replace('home.html');
    } catch (err) {
      if (err.status === 401) {
        window.location.replace('login.html');
        return;
      }
      pageErrorText.textContent =
        err.status === 403
          ? 'Недостаточно прав для удаления проекта.'
          : err.detail;
      pageError.hidden = false;
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Удалить проект';
    }
  });
});
