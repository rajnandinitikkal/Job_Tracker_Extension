function renderDashboard() {
  chrome.storage.local.get({ appliedJobs: [] }, (data) => {
    const listDiv = document.getElementById('list');
    const stats = document.getElementById('stats');
    listDiv.innerHTML = '';
    
    const sortedJobs = data.appliedJobs.sort((a, b) => b.timestamp - a.timestamp);
    stats.innerText = `Total Applications: ${sortedJobs.length}`;

    if (sortedJobs.length === 0) {
      listDiv.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No jobs tracked yet.</p>';
      return;
    }

    sortedJobs.forEach((job) => {
      const item = document.createElement('div');
      item.className = 'job-item';
      
      const dateStr = new Date(job.timestamp).toLocaleDateString();

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <a href="${job.url}" target="_blank" class="title">${job.title}</a>
          <span style="font-size:10px; color:#999;">${dateStr}</span>
        </div>
        <div class="url-text">${job.url}</div>
        <div class="controls">
          <button class="btn copy-btn" title="Copy Link">📋</button>
          <button class="btn delete-btn" title="Remove Link">❌</button>
        </div>
      `;

      item.querySelector('.copy-btn').onclick = () => {
        navigator.clipboard.writeText(job.url);
        const btn = item.querySelector('.copy-btn');
        btn.innerText = '✅';
        setTimeout(() => btn.innerText = '📋', 1000);
      };

      // Inside popup.js delete logic
        item.querySelector('.delete-btn').onclick = () => {
        const newList = data.appliedJobs.filter(j => j.url !== job.url); // Must be exact match
        chrome.storage.local.set({ appliedJobs: newList }, renderDashboard);
        };


      listDiv.appendChild(item);
    });
  });
}

// Handle Global Toggle
document.getElementById('globalToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.local.set({ isEnabled: enabled }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) chrome.tabs.reload(tabs[0].id);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({ isEnabled: true }, (data) => {
    document.getElementById('globalToggle').checked = data.isEnabled;
  });
  renderDashboard();
});