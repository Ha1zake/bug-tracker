document.addEventListener('DOMContentLoaded', async () => {
  const projectId = getQueryParam('id');
  const ctx = await initAppShell({ activeProjectId: projectId });
  if (!ctx) return;

  const pageError = document.getElementById('page-error');
  const pageErrorText = document.getElementById('page-error-text');
  const editView = document.getElementById('edit-view');

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
    pageErrorText.textContent = 'Редактировать проект может только руководитель.';
    pageError.hidden = false;
    return;
  }

  const breadcrumbLink = document.getElementById('breadcrumb-project-link');
  breadcrumbLink.href = projectUrl;
  breadcrumbLink.textContent = project.name;
  document.getElementById('project-subtitle').textContent =
    `${project.name} · Сведения о проекте`;
  document.getElementById('cancel-link').href = projectUrl;

  const nameInput = document.getElementById('name');
  const descInput = document.getElementById('description');
  const nameError = document.getElementById('error-name');
  const descError = document.getElementById('error-description');
  const formErrorAlert = document.getElementById('form-error-alert');
  const formErrorText = document.getElementById('form-error-text');
  const submitBtn = document.getElementById('submit-btn');

  nameInput.value = project.name;
  descInput.value = project.description || '';
  editView.hidden = false;

  document.getElementById('edit-project-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    formErrorAlert.hidden = true;
    nameInput.classList.remove('is-invalid');
    descInput.classList.remove('is-invalid');
    nameError.textContent = '';
    descError.textContent = '';

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
      nameInput.classList.add('is-invalid');
      nameError.textContent = 'Обязательное поле';
      formErrorText.textContent = 'Название проекта не может быть пустым.';
      formErrorAlert.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';

    try {
      await apiRequest(`/api/projects/${encodeURIComponent(projectId)}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          description: description || null,
        }),
      });
      window.location.replace(projectUrl);
    } catch (err) {
      if (err.status === 401) {
        window.location.replace('login.html');
        return;
      }
      formErrorText.textContent =
        err.status === 403
          ? 'Недостаточно прав для редактирования проекта.'
          : err.detail;
      formErrorAlert.hidden = false;

      if (err.errors?.name) {
        nameInput.classList.add('is-invalid');
        nameError.textContent = err.errors.name;
      }
      if (err.errors?.description) {
        descInput.classList.add('is-invalid');
        descError.textContent = err.errors.description;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Сохранить изменения';
    }
  });
});
