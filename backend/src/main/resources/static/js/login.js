document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('login-form');
  const submitBtn = document.getElementById('submit-btn');
  const errorAlert = document.getElementById('form-error-alert');
  const errorAlertText = document.getElementById('form-error-text');
  const successAlert = document.getElementById('form-success-alert');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('error-email');
  const passwordError = document.getElementById('error-password');

  try {
    await apiRequest('/api/auth/me');
    window.location.replace('home.html');
    return;
  } catch (e) {
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('registered') === '1') {
    successAlert.hidden = false;
  }

  function clearErrors() {
    errorAlert.hidden = true;
    errorAlertText.textContent = '';
    successAlert.hidden = true;

    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
    emailError.textContent = '';
    passwordError.textContent = '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;

    if (!email) {
      emailInput.classList.add('is-invalid');
      emailError.textContent = 'Укажите email';
      isValid = false;
    }

    if (!password) {
      passwordInput.classList.add('is-invalid');
      passwordError.textContent = 'Укажите пароль';
      isValid = false;
    }

    if (!isValid) {
      errorAlertText.textContent = 'Заполните электронную почту и пароль.';
      errorAlert.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';

    try {
      await apiFormPost('/api/auth/login', { email, password });
      window.location.replace('home.html');
    } catch (err) {
      if (err.status === 401) {
        errorAlertText.textContent =
          'Неверная почта или пароль. Проверьте введённые данные и попробуйте ещё раз.';
      } else {
        errorAlertText.textContent = err.detail;
      }
      errorAlert.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Войти';
    }
  });
});
