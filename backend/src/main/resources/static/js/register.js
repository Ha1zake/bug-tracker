document.addEventListener('DOMContentLoaded', async () => {
  // Если пользователь уже авторизован — сразу перенаправляем на главную
  try {
    await apiRequest('/api/auth/me');
    window.location.replace('home.html');
    return;
  } catch (e) {
    // Не авторизован — показываем форму регистрации
  }

  const form = document.getElementById('register-form');
  const submitBtn = document.getElementById('submit-btn');
  const errorAlert = document.getElementById('form-error-alert');
  const errorAlertText = document.getElementById('form-error-text');

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

  function clearErrors() {
    errorAlert.hidden = true;
    errorAlertText.textContent = '';

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
    clearErrors();

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
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      try {
        await apiFormPost('/api/auth/login', {
          email: payload.email,
          password: payload.password,
        });
        window.location.replace('home.html');
      } catch (loginErr) {
        window.location.replace('login.html?registered=1');
      }
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

      submitBtn.disabled = false;
      submitBtn.textContent = 'Зарегистрироваться';
    }
  });
});
