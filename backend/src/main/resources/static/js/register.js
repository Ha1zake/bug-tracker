document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const submitBtn = document.getElementById('submit-btn');
  const errorAlert = document.getElementById('form-error-alert');
  const errorAlertText = document.getElementById('form-error-text');
  const infoAlert = document.getElementById('form-info-alert');

  const successBlock = document.getElementById('register-success');
  const registerAnotherBtn = document.getElementById('register-another-btn');
  const loginPlaceholderBtn = document.getElementById('login-placeholder-btn');

  const fields = {
    displayName: document.getElementById('displayName'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
  };

  const errorLabels = {
    displayName: document.getElementById('error-displayName'),
    email: document.getElementById('error-email'),
    password: document.getElementById('error-password'),
    confirmPassword: document.getElementById('error-confirmPassword'),
  };

  function clearAlertsAndErrors() {
    errorAlert.hidden = true;
    errorAlertText.textContent = '';
    infoAlert.hidden = true;

    Object.keys(fields).forEach((key) => {
      fields[key].classList.remove('is-invalid');
      errorLabels[key].textContent = '';
    });
  }

  function showFieldError(fieldName, message) {
    if (fields[fieldName] && errorLabels[fieldName]) {
      fields[fieldName].classList.add('is-invalid');
      errorLabels[fieldName].textContent = message;
    }
  }

  function showBannerError(message) {
    errorAlertText.textContent = message;
    errorAlert.hidden = false;
  }

  function validateForm() {
    let isValid = true;

    const displayName = fields.displayName.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;

    if (!displayName) {
      showFieldError('displayName', 'Укажите имя');
      isValid = false;
    } else if (displayName.length > 100) {
      showFieldError('displayName', 'Максимум 100 символов');
      isValid = false;
    }

    if (!email) {
      showFieldError('email', 'Укажите email');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('email', 'Некорректный email');
      isValid = false;
    }

    if (!password) {
      showFieldError('password', 'Укажите пароль');
      isValid = false;
    } else if (password.length < 8) {
      showFieldError('password', 'Минимум 8 символов');
      isValid = false;
    } else if (password.length > 128) {
      showFieldError('password', 'Максимум 128 символов');
      isValid = false;
    }

    if (password !== confirmPassword) {
      showFieldError('confirmPassword', 'Пароли не совпадают');
      isValid = false;
    }

    if (!isValid) {
      showBannerError('Исправьте ошибки в выделенных полях и попробуйте ещё раз.');
    }

    return isValid;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAlertsAndErrors();

    if (!validateForm()) {
      return;
    }

    const payload = {
      displayName: fields.displayName.value.trim(),
      email: fields.email.value.trim(),
      password: fields.password.value,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Создание аккаунта...';

    try {
      const createdUser = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      document.getElementById('res-id').textContent = createdUser.id;
      document.getElementById('res-displayName').textContent = createdUser.displayName;
      document.getElementById('res-email').textContent = createdUser.email;

      form.hidden = true;
      successBlock.hidden = false;
    } catch (err) {
      showBannerError(err.detail);

      if (err.errors) {
        Object.entries(err.errors).forEach(([field, message]) => {
          showFieldError(field, message);
        });
      }

      if (err.status === 409) {
        showFieldError('email', 'Уже зарегистрирован');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Зарегистрироваться';
    }
  });

  registerAnotherBtn.addEventListener('click', () => {
    form.reset();
    clearAlertsAndErrors();
    successBlock.hidden = true;
    form.hidden = false;
  });

  loginPlaceholderBtn.addEventListener('click', () => {
    clearAlertsAndErrors();
    infoAlert.hidden = false;
  });
});
