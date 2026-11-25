document.addEventListener('DOMContentLoaded', async () => {
  const ctx = await initAppShell();
  if (!ctx) return;

  const { user, projects } = ctx;

  document.getElementById('greeting-title').textContent =
    `Здравствуйте, ${user.displayName}`;
  document.getElementById('projects-count').textContent = String(projects.length);

  const emptyEl = document.getElementById('projects-empty');
  const gridEl = document.getElementById('projects-grid');

  if (projects.length === 0) {
    emptyEl.hidden = false;
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const body = document.createElement('div');

    const top = document.createElement('div');
    top.className = 'project-card-top';

    const title = document.createElement('h3');
    title.className = 'project-card-title';
    title.textContent = project.name;

    const badge = document.createElement('span');
    badge.className = 'role-badge';
    badge.textContent = formatRole(project.role);

    top.append(title, badge);
    body.appendChild(top);

    const desc = document.createElement('p');
    desc.className = 'project-card-desc';
    desc.textContent = project.description || 'Описание не указано';
    body.appendChild(desc);

    const footer = document.createElement('div');
    footer.className = 'project-card-footer';

    const openLink = document.createElement('a');
    openLink.className = 'text-link';
    openLink.href = `project.html?id=${encodeURIComponent(project.id)}`;
    openLink.textContent = 'Открыть проект →';

    footer.appendChild(openLink);
    card.append(body, footer);
    gridEl.appendChild(card);
  });
});
