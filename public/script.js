document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchBar = document.getElementById('search-bar');
  let allTalks = [];

  // Fetch talk data from the API
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      allTalks = data;
      renderSchedule(allTalks);
    });

  // Search functionality
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = allTalks.filter(talk => 
      talk.categories.some(category => category.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  // Render the schedule
  function renderSchedule(talks) {
    scheduleContainer.innerHTML = '';
    let talkIndex = 0;
    let currentTime = new Date('2025-10-27T10:00:00');

    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const addItem = (startTime, endTime, content) => {
        const item = document.createElement('div');
        item.classList.add('schedule-item');
        item.innerHTML = `
            <div class="time-slot">${formatTime(startTime)} - ${formatTime(endTime)}</div>
            <div class="talk-details">${content}</div>
        `;
        scheduleContainer.appendChild(item);
    };

    const addBreak = (startTime, duration) => {
        const endTime = new Date(startTime.getTime() + duration * 60000);
        const breakElement = document.createElement('div');
        breakElement.classList.add('break');
        breakElement.innerHTML = `${formatTime(startTime)} - ${formatTime(endTime)}: Break`;
        scheduleContainer.appendChild(breakElement);
        return endTime;
    };

    // Talk 1
    if (talks.includes(allTalks[0])) {
        const endTime = new Date(currentTime.getTime() + allTalks[0].duration * 60000);
        addItem(currentTime, endTime, createTalkHtml(allTalks[0]));
        currentTime = endTime;
    }
    
    // Break 1
    currentTime = addBreak(currentTime, 10);

    // Talk 2
    if (talks.includes(allTalks[1])) {
        const endTime = new Date(currentTime.getTime() + allTalks[1].duration * 60000);
        addItem(currentTime, endTime, createTalkHtml(allTalks[1]));
        currentTime = endTime;
    }

    // Break 2
    currentTime = addBreak(currentTime, 10);

    // Talk 3
    if (talks.includes(allTalks[2])) {
        const endTime = new Date(currentTime.getTime() + allTalks[2].duration * 60000);
        addItem(currentTime, endTime, createTalkHtml(allTalks[2]));
        currentTime = endTime;
    }

    // Lunch Break
    const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
    const lunchElement = document.createElement('div');
    lunchElement.classList.add('break');
    lunchElement.innerHTML = `${formatTime(currentTime)} - ${formatTime(lunchEndTime)}: Lunch Break`;
    scheduleContainer.appendChild(lunchElement);
    currentTime = lunchEndTime;

    // Talk 4
    if (talks.includes(allTalks[3])) {
        const endTime = new Date(currentTime.getTime() + allTalks[3].duration * 60000);
        addItem(currentTime, endTime, createTalkHtml(allTalks[3]));
        currentTime = endTime;
    }

    // Break 3
    currentTime = addBreak(currentTime, 10);

    // Talk 5
    if (talks.includes(allTalks[4])) {
        const endTime = new Date(currentTime.getTime() + allTalks[4].duration * 60000);
        addItem(currentTime, endTime, createTalkHtml(allTalks[4]));
        currentTime = endTime;
    }

    // Break 4
    currentTime = addBreak(currentTime, 10);

    // Talk 6
    if (talks.includes(allTalks[5])) {
        const endTime = new Date(currentTime.getTime() + allTalks[5].duration * 60000);
        addItem(currentTime, endTime, createTalkHtml(allTalks[5]));
        currentTime = endTime;
    }
  }

  function createTalkHtml(talk) {
    return `
      <div class="talk-title">${talk.title}</div>
      <div class="speakers">By: ${talk.speakers.join(', ')}</div>
      <div class="description">${talk.description}</div>
      <div class="categories">
        ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
      </div>
    `;
  }
});
