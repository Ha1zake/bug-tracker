async function getCsrfToken() {
  let response;
  try {
    response = await fetch('/api/auth/csrf', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    });
  } catch (networkError) {
    throw {
      status: 0,
      detail: 'Нет соединения с сервером.',
      errors: {},
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      detail: 'Не удалось получить CSRF-токен.',
      errors: {},
    };
  }

  return response.json();
}

async function parseErrorResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (
    contentType.includes('application/json') ||
    contentType.includes('application/problem+json')
  ) {
    data = await response.json();
  }

  return {
    status: response.status,
    detail: data?.detail || `Ошибка сервера (HTTP ${response.status})`,
    errors: data?.errors || {},
  };
}

async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = await getCsrfToken();
    headers[csrf.headerName] = csrf.token;
  }

  let response;
  try {
    response = await fetch(path, {
      ...options,
      method,
      headers,
      credentials: 'same-origin',
    });
  } catch (networkError) {
    throw {
      status: 0,
      detail: 'Нет соединения с сервером.',
      errors: {},
    };
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

async function apiFormPost(path, fields) {
  const csrf = await getCsrfToken();
  const body = new URLSearchParams(fields);

  let response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        [csrf.headerName]: csrf.token,
      },
      body: body.toString(),
      credentials: 'same-origin',
    });
  } catch (networkError) {
    throw {
      status: 0,
      detail: 'Нет соединения с сервером.',
      errors: {},
    };
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return null;
}
