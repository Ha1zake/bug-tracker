async function apiRequest(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(path, { ...options, headers });
  } catch (networkError) {
    throw {
      status: 0,
      detail: 'Нет соединения с сервером.',
      errors: {},
    };
  }

  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (
    contentType.includes('application/json') ||
    contentType.includes('application/problem+json')
  ) {
    data = await response.json();
  }

  if (!response.ok) {
    throw {
      status: response.status,
      detail: data?.detail || `Ошибка сервера (HTTP ${response.status})`,
      errors: data?.errors || {},
    };
  }

  return data;
}
