let skills = JSON.parse(localStorage.getItem('skills')) || [];

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
    title.textContent = skill.name + ` (${skill.level}/${skill.goal})`;
    div.appendChild(title);

    const progress = document.createElement('div');
    progress.className = 'progress';

    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = `${(skill.level / skill.goal) * 100}%`;
    progress.appendChild(fill);
    div.appendChild(progress);

    const updateLevels = document.createElement('div');
    updateLevels.innerHTML = `
      <label>Level: 
        <input type="number" min="1" max="10" value="${skill.level}" onchange="updateSkillLevel(${index}, this.value)">
      </label>
      <label>Goal: 
        <input type="number" min="1" max="10" value="${skill.goal}" onchange="updateSkillGoal(${index}, this.value)">
      </label>
    `;
    div.appendChild(updateLevels);

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
      const p = document.createElement('p');
      p.className = 'resource' + (res.done ? ' done' : '');
      p.textContent = res.title + ' – ' + res.link;
      p.onclick = () => {
        res.done = !res.done;
        saveSkills();
        renderSkills();
      };
      div.appendChild(p);
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
  const level = parseInt(document.getElementById('new-skill-level').value);
  const goal = parseInt(document.getElementById('new-skill-goal').value);

  if (name && level && goal) {
    skills.push({ name, level, goal, resources: [] });
    saveSkills();
    renderSkills();
    document.getElementById('new-skill-name').value = '';
  }
}

function updateSkillLevel(index, val) {
  skills[index].level = parseInt(val);
  saveSkills();
  renderSkills();
}
function updateSkillGoal(index, val) {
  skills[index].goal = parseInt(val);
  saveSkills();
  renderSkills();
}

renderSkills();