document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchBar = document.getElementById('search-bar');
  const filterContainer = document.querySelector('.filter-container');
  let allTalks = [];
  let currentCategory = 'all';

  // Fetch talk data from the API
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      allTalks = data;
      populateFilterButtons(allTalks);
      renderSchedule(allTalks);
    });

  // Populate filter buttons dynamically
  function populateFilterButtons(talks) {
    const categories = new Set();
    talks.forEach(talk => {
      talk.categories.forEach(cat => categories.add(cat));
    });

    filterContainer.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.classList.add('filter-btn', 'active');
    allBtn.dataset.category = 'all';
    allBtn.textContent = 'All';
    filterContainer.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.classList.add('filter-btn');
      btn.dataset.category = cat;
      btn.textContent = cat;
      filterContainer.appendChild(btn);
    });

    // Re-attach event listeners to new buttons
    attachFilterButtonListeners();
  }

  function attachFilterButtonListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        const searchTerm = searchBar.value.toLowerCase();
        filterAndRender(searchTerm, currentCategory);
      });
    });
  }

  // Search functionality
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterAndRender(searchTerm, currentCategory);
  });

  function filterAndRender(searchTerm, category) {
    let filteredTalks = allTalks;

    if (category !== 'all') {
      filteredTalks = filteredTalks.filter(talk => talk.categories.includes(category));
    }

    if (searchTerm) {
      filteredTalks = filteredTalks.filter(talk => 
        talk.title.toLowerCase().includes(searchTerm) ||
        talk.speakers.some(speaker => speaker.toLowerCase().includes(searchTerm)) ||
        talk.categories.some(cat => cat.toLowerCase().includes(searchTerm))
      );
    }

    renderSchedule(filteredTalks);
  }

  // Render the schedule
  function renderSchedule(talks) {
    scheduleContainer.innerHTML = '';
    if (talks.length === 0) {
      scheduleContainer.innerHTML = '<p>No talks found.</p>';
      return;
    }

    talks.forEach(talk => {
      const item = document.createElement('div');
      item.classList.add('schedule-item');
      item.innerHTML = createTalkHtml(talk);
      scheduleContainer.appendChild(item);
    });
  }

  function createTalkHtml(talk) {
    return `
      <div class="time-slot">${talk.time}</div>
      <div class="talk-title">${talk.title}</div>
      <div class="speakers">By: ${talk.speakers.join(', ')}</div>
      <div class="description">${talk.description}</div>
      <div class="categories">
        ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
      </div>
    `;
  }
});
