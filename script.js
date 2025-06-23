let skills = JSON.parse(localStorage.getItem('skills')) || [];
let globalChart = null;

function saveSkills() {
  localStorage.setItem('skills', JSON.stringify(skills));
}

function renderSkills() {
  const container = document.getElementById('skills-container');
  container.innerHTML = '';

  skills.forEach((skill, index) => {
    const div = document.createElement('div');
    div.className = 'skill';

    const title = document.createElement('h2');
    title.textContent = skill.name;
    title.style.cursor = 'pointer';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'skill-content';
    contentWrapper.style.display = 'block';

    title.onclick = () => {
      const isVisible = contentWrapper.style.display === 'block';
      contentWrapper.style.display = isVisible ? 'none' : 'block';
    };

    // Progress bar 
    const progress = document.createElement('div');
    progress.className = 'progress';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    const total = skill.resources.length || 1;
    const completed = skill.resources.filter(r => r.done).length;
    fill.style.width = `${(completed / total) * 100}%`;
    progress.appendChild(fill);

    if ((completed / total) === 1 && !skill.completedCelebrated) {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
      skill.completedCelebrated = true;
      saveSkills();
    }

    skill.resources.forEach((res, resIndex) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'resource';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = res.done;
      checkbox.onchange = () => {
        const scrollY = window.scrollY;
        res.done = checkbox.checked;
        saveSkills();
        renderSkills();
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      };
      wrapper.appendChild(checkbox);

      const label = document.createElement('span');
      label.innerHTML = `${res.title}` +
        (res.link ? ` – <a href="${res.link}" target="_blank" rel="noopener noreferrer">${res.link}</a>` : '') +
        (res.deadline ? ` <span style="color: #ccc; font-size: 0.9em;">(Due: ${res.deadline})</span>` : '');
      wrapper.appendChild(label);

      contentWrapper.appendChild(wrapper);
    });

    const addResBtn = document.createElement('button');
    addResBtn.textContent = 'Add Resource';
    addResBtn.className = 'add-resource';
    addResBtn.onclick = () => {
      const title = prompt('Resource Title:');
      const link = prompt('Link (optional):');
      const deadline = prompt('Deadline (optional, format: YYYY-MM-DD):');
      if (title) {
        skill.resources.push({ title, link, deadline, done: false });
        saveSkills();
        renderSkills();
      }
    };

    // Remove Skill button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove Skill';
    removeBtn.className = 'remove';
    removeBtn.onclick = () => {
      skills.splice(index, 1);
      saveSkills();
      renderSkills();
    };

    // Append all
    div.appendChild(title);
    div.appendChild(progress);            // ✅ Progress bar just after title
    contentWrapper.appendChild(addResBtn);
    contentWrapper.appendChild(removeBtn);
    div.appendChild(contentWrapper);
    container.appendChild(div);
  });

  updateGlobalStats();
}

function addSkill() {
  const name = document.getElementById('new-skill-name').value.trim();
  if (name) {
    skills.push({ name, resources: [], completedCelebrated: false });
    saveSkills();
    renderSkills();
    document.getElementById('new-skill-name').value = '';
  }
}

function updateGlobalStats() {
  const ctx = document.getElementById('globalChart').getContext('2d');
  if (globalChart) globalChart.destroy();

  const labels = [];
  const data = [];

  skills.forEach(skill => {
    const total = skill.resources.length || 1;
    const completed = skill.resources.filter(r => r.done).length;
    const percent = Math.round((completed / total) * 100);
    labels.push(skill.name);
    data.push(percent);
  });

  globalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Skill Completion (%)',
        data: data,
        backgroundColor: '#58d68d'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#ffffff' }
        },
        x: {
          ticks: { color: '#ffffff' }
        }
      },
      plugins: {
        legend: { labels: { color: '#ffffff' } }
      }
    }
  });
}

renderSkills();
