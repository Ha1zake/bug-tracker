const ROLE_LABELS = {
  MANAGER: 'Руководитель',
  DEVELOPER: 'Разработчик',
  TESTER: 'Тестировщик',
  UNASSIGNED: 'Участник',
};

function formatRole(role) {
  return ROLE_LABELS[role] || role;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function initAppShell({ activeProjectId = null } = {}) {
  let user;
  try {
    user = await apiRequest('/api/auth/me');
  } catch (err) {
    if (err.status === 401) {
      window.location.replace('login.html');
      return null;
    }
    throw err;
  }

  const userNameEl = document.getElementById('current-user-name');
  if (userNameEl) {
    userNameEl.textContent = user.displayName;
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      try {
        await apiRequest('/api/auth/logout', { method: 'POST' });
      } finally {
        window.location.replace('login.html');
      }
    });
  }

  let projects = [];
  try {
    projects = await apiRequest('/api/projects');
  } catch (err) {
    if (err.status === 401) {
      window.location.replace('login.html');
      return null;
    }
  }

  const sidebarList = document.getElementById('sidebar-projects');
  if (sidebarList) {
    sidebarList.innerHTML = '';

    if (projects.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'sidebar-empty';
      empty.textContent = 'Нет проектов';
      sidebarList.appendChild(empty);
    } else {
      projects.forEach((project) => {
        const link = document.createElement('a');
        link.href = `project.html?id=${encodeURIComponent(project.id)}`;
        link.className = 'sidebar-link';
        if (activeProjectId && project.id === activeProjectId) {
          link.classList.add('is-active');
        }
        link.textContent = project.name;
        sidebarList.appendChild(link);
      });
    }
  }

  return { user, projects };
}
