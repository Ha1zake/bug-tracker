document.addEventListener('DOMContentLoaded', async () => {
  const ctx = await initAppShell();
  if (!ctx) return;

  const form = document.getElementById('create-project-form');
  const submitBtn = document.getElementById('submit-btn');
  const errorAlert = document.getElementById('form-error-alert');
  const errorAlertText = document.getElementById('form-error-text');

  const nameInput = document.getElementById('name');
  const descInput = document.getElementById('description');
  const nameError = document.getElementById('error-name');
  const descError = document.getElementById('error-description');

  function clearErrors() {
    errorAlert.hidden = true;
    errorAlertText.textContent = '';
    nameInput.classList.remove('is-invalid');
    descInput.classList.remove('is-invalid');
    nameError.textContent = '';
    descError.textContent = '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
      nameInput.classList.add('is-invalid');
      nameError.textContent = 'Обязательное поле';
      errorAlertText.textContent = 'Укажите название проекта.';
      errorAlert.hidden = false;
      return;
    }

    if (name.length > 120) {
      nameInput.classList.add('is-invalid');
      nameError.textContent = 'Максимум 120 символов';
      errorAlertText.textContent = 'Название проекта слишком длинное.';
      errorAlert.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Создание...';

    try {
      const created = await apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description: description || null,
        }),
      });
      window.location.replace(`project.html?id=${encodeURIComponent(created.id)}`);
    } catch (err) {
      if (err.status === 401) {
        window.location.replace('login.html');
        return;
      }
      errorAlertText.textContent = err.detail;
      errorAlert.hidden = false;

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
      submitBtn.textContent = 'Создать проект';
    }
  });
});
