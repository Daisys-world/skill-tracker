let skills = JSON.parse(localStorage.getItem('skills')) || [];
let globalChart = null;

function saveSkills() {
  localStorage.setItem('skills', JSON.stringify(skills));
}

function renderSkills() {
  const container = document.getElementById('skills-container');
  container.innerHTML = '';
  updateGlobalStats();

  skills.forEach((skill, index) => {
    const div = document.createElement('div');
    div.className = 'skill';

    const title = document.createElement('h2');
    title.textContent = skill.name;
    div.appendChild(title);

    const progress = document.createElement('div');
    progress.className = 'progress';

    const fill = document.createElement('div');
    fill.className = 'progress-fill';

    const total = skill.resources.length || 1;
    const completed = skill.resources.filter(r => r.done).length;
    fill.style.width = `${(completed / total) * 100}%`;

    progress.appendChild(fill);
    div.appendChild(progress);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove Skill';
    removeBtn.className = 'remove';
    removeBtn.onclick = () => {
      skills.splice(index, 1);
      saveSkills();
      renderSkills();
    };
    div.appendChild(removeBtn);

    skill.resources.forEach((res, resIndex) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'resource';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = res.done;
      checkbox.onchange = () => {
        res.done = checkbox.checked;
        saveSkills();
        renderSkills();
      };
      wrapper.appendChild(checkbox);

      const label = document.createElement('span');

      if (res.link) {
        label.innerHTML = `${res.title} – <a href="${res.link}" target="_blank" rel="noopener noreferrer">${res.link}</a>`;
      } else {
        label.textContent = `${res.title}`;
      }

      wrapper.appendChild(label);
      div.appendChild(wrapper);
    });

    const addResBtn = document.createElement('button');
    addResBtn.textContent = 'Add Resource';
    addResBtn.className = 'add-resource';
    addResBtn.onclick = () => {
      const title = prompt('Resource Title:');
      const link = prompt('Link (optional):');
      if (title) {
        skill.resources.push({ title, link, done: false });
        saveSkills();
        renderSkills();
      }
    };
    div.appendChild(addResBtn);

    container.appendChild(div);
  });
}

function addSkill() {
  const name = document.getElementById('new-skill-name').value.trim();
  if (name) {
    skills.push({ name, resources: [] });
    saveSkills();
    renderSkills();
    document.getElementById('new-skill-name').value = '';
  }
}
function updateGlobalStats() {
  const total = skills.reduce((sum, skill) => sum + skill.resources.length, 0);
  const completed = skills.reduce(
    (sum, skill) => sum + skill.resources.filter(r => r.done).length,
    0
  );

  const remaining = total - completed;

  const ctx = document.getElementById('globalChart').getContext('2d');

  if (globalChart) {
    globalChart.destroy(); 
  }

  globalChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [completed, remaining],
        backgroundColor: ['#58d68d', '#2e86c1'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  });
}

renderSkills();
