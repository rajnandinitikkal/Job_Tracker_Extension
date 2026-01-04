(function() {
  const currentUrl = window.location.href;

  chrome.storage.local.get({ isEnabled: true, appliedJobs: [] }, (data) => {
    if (!data.isEnabled) return;

    const div = document.createElement('div');
    div.id = 'job-tracker-overlay';
    
    // Minimalist & Transparent Styles
    Object.assign(div.style, {
      position: 'fixed', top: '20px', left: '20px', zIndex: '2147483647',
      padding: '8px', borderRadius: '8px', 
      backgroundColor: 'rgba(254, 254, 255, 0.4)', // 40% Opacity
      backdropFilter: 'blur(4px)', // Soft glass effect
      color: 'rgba(255, 255, 255, 0.7)', // Dimmed text
      fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      fontFamily: 'sans-serif', border: '1px solid rgba(255, 255, 255, 0.1)', 
      cursor: 'move',  textAlign: 'center', userSelect: 'none',
      transition: 'background-color 0.3s, color 0.3s'
    });

    // Hover effect to make it visible only when needed
    div.onmouseenter = () => {
      div.style.backgroundColor = 'rgba(26, 26, 27, 0.9)';
      div.style.color = '#fff';
    };
    div.onmouseleave = () => {
      div.style.backgroundColor = 'rgba(254, 254, 255, 0.4)';
      div.style.color = 'rgba(255, 255, 255, 0.7)';
    };

    function updateUI(jobEntry) {
      const isApplied = !!jobEntry;
      const dateString = isApplied ? new Date(jobEntry.timestamp).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
      }) : "";

      div.innerHTML = `
        <div style="margin-bottom:4px; font-size:10px; opacity:0.8;">
          ${isApplied ? '✅' : '🔍'}
        </div>
        ${isApplied ? `<div style="font-size:9px; color:#81c784; margin-bottom:6px;">${dateString}</div>` : ''}
        
        <button id="job-toggle-btn" 
          style="cursor:pointer; width:100%; border:none; padding:4px; border-radius:4px; font-size:14px;
          background:${isApplied ? 'rgba(220, 53, 69, 0.5)' : 'rgba(0, 120, 212, 0.5)'}; color:white;">
          ${isApplied ? '🗑️' : '➕'}
        </button>
      `;

      document.getElementById('job-toggle-btn').onclick = (e) => {
        e.stopPropagation();
        chrome.storage.local.get({ appliedJobs: [] }, (data) => {
          let list = data.appliedJobs;
          if (isApplied) {
            list = list.filter(item => item.url !== currentUrl);
          } else {
            list.push({ url: currentUrl, title: document.title, timestamp: Date.now() });
          }
          chrome.storage.local.set({ appliedJobs: list }, () => {
             const newEntry = list.find(item => item.url === currentUrl);
             updateUI(newEntry);
          });
        });
      };
    }

    // Dragging Logic (Remains same)
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    div.addEventListener('mousedown', (e) => {
      isDragging = true;
      offset = { x: div.offsetLeft - e.clientX, y: div.offsetTop - e.clientY };
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      div.style.left = (e.clientX + offset.x) + 'px';
      div.style.top = (e.clientY + offset.y) + 'px';
      div.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    const existingJob = data.appliedJobs.find(item => item.url === currentUrl);
    document.body.appendChild(div);
    updateUI(existingJob);
  });
})();