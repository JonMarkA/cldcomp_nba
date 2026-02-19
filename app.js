let allTeams = [];
let currentFilter = 'all';

fetch('predictions.json')
  .then(res => res.json())
  .then(data => {
    allTeams = data.teams;
    renderTable(allTeams);
    document.getElementById('last-updated').textContent = 'Last updated: ' + data.last_updated;
  })
  .catch(err => {
    document.getElementById('table-body').innerHTML =
      '<tr><td colspan="7" style="text-align:center;color:#c8102e;padding:30px;">Failed to load predictions.</td></tr>';
    console.error(err);
  });

function filterTeams(conf) {
  currentFilter = conf;

  // Update tab styles
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');

  const filtered = conf === 'all' ? allTeams : allTeams.filter(t => t.conference === conf);
  renderTable(filtered);
}

function renderTable(teams) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  // Sort by probability descending
  const sorted = [...teams].sort((a, b) => b.playoff_probability - a.playoff_probability);

  // Figure out playoff cutoffs per conference
  const eastTeams = allTeams.filter(t => t.conference === 'East')
    .sort((a, b) => b.playoff_probability - a.playoff_probability)
    .slice(0, 8).map(t => t.name);
  const westTeams = allTeams.filter(t => t.conference === 'West')
    .sort((a, b) => b.playoff_probability - a.playoff_probability)
    .slice(0, 8).map(t => t.name);
  const playoffTeams = new Set([...eastTeams, ...westTeams]);

  sorted.forEach((team, index) => {
    const prob = Math.round(team.playoff_probability * 100);
    const inPlayoffs = playoffTeams.has(team.name);
    const winPct = team.win_pct.toFixed(3);

    const tr = document.createElement('tr');
    tr.className = inPlayoffs ? 'playoff-row' : 'bubble-row';

    tr.innerHTML = `
      <td class="rank-cell">${index + 1}</td>
      <td class="team-name">${team.name}</td>
      <td><span class="conf-badge ${team.conference === 'East' ? 'conf-east' : 'conf-west'}">${team.conference}</span></td>
      <td class="record-cell">${team.wins}–${team.losses}</td>
      <td class="winpct-cell">${winPct}</td>
      <td>
        <div class="prob-bar-wrapper">
          <div class="prob-bar-bg">
            <div class="prob-bar-fill" style="width: ${prob}%"></div>
          </div>
          <span class="prob-text">${prob}%</span>
        </div>
      </td>
      <td>
        <span class="status-badge ${inPlayoffs ? 'status-in' : 'status-out'}">
          ${inPlayoffs ? '✅ Playoff Bound' : '❌ On the Bubble'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
