fetch('predictions.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('predictions-container');
    container.innerHTML = '';

    // Split into conferences
    const east = data.teams.filter(t => t.conference === 'East');
    const west = data.teams.filter(t => t.conference === 'West');

    function renderConference(teams, confName) {
      const section = document.createElement('div');
      section.className = 'conference-section';
      section.innerHTML = `<h2 class="conf-title">${confName}ern Conference</h2>`;

      const grid = document.createElement('div');
      grid.className = 'cards-grid';

      teams.forEach((team, index) => {
        const prob = Math.round(team.playoff_probability * 100);
        const inPlayoffs = index < 8; // top 8 per conference
        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
          <div class="team-rank">#${index + 1}</div>
          <h3>${team.name}</h3>
          <div class="record">${team.wins}W – ${team.losses}L</div>
          <div class="probability">${prob}%</div>
          <div class="prob-label">Playoff Probability</div>
          <span class="badge ${inPlayoffs ? 'likely' : 'unlikely'}">
            ${inPlayoffs ? '✅ Playoff Bound' : '❌ On the Bubble'}
          </span>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    }

    renderConference(east, 'East');
    renderConference(west, 'West');

    document.getElementById('last-updated').textContent = 'Last updated: ' + data.last_updated;
  })
  .catch(err => {
    document.getElementById('predictions-container').innerHTML =
      '<p style="color:red;">Failed to load predictions. Make sure predictions.json is uploaded.</p>';
    console.error(err);
  });