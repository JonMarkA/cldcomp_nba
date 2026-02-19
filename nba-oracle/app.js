fetch('predictions.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('predictions-container');
    container.innerHTML = '';

    data.teams.forEach(team => {
      const prob = Math.round(team.playoff_probability * 100);
      const isLikely = prob >= 50;

      const card = document.createElement('div');
      card.className = 'team-card';
      card.innerHTML = `
        <h3>${team.name}</h3>
        <div class="probability">${prob}%</div>
        <div class="prob-label">Playoff Probability</div>
        <span class="badge ${isLikely ? 'likely' : 'unlikely'}">
          ${isLikely ? '✅ Likely In' : '❌ On the Bubble'}
        </span>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    document.getElementById('predictions-container').innerHTML =
      '<p style="color:red;">Failed to load predictions.</p>';
    console.error(err);
  });