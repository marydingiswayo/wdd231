// Load members from JSON
async function loadMembers(view = "grid") {
  const response = await fetch("data/members.json");
  const members = await response.json();
  displayMembers(members, view);
}

function displayMembers(members, view) {
  const container = document.getElementById("members");
  container.innerHTML = "";
  container.className = view;

  members.forEach(member => {
    if (view === "grid") {
      const card = document.createElement("div");
      card.classList.add("member-card");
      card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank">Visit Website</a>
        <p>Membership: ${member.membership}</p>
      `;
      container.appendChild(card);
    } else {
      const item = document.createElement("div");
      item.classList.add("member-list");
      item.innerHTML = `
        <strong>${member.name}</strong> | ${member.address} | ${member.phone} | 
        <a href="${member.website}" target="_blank">Website</a> | Level: ${member.membership}
      `;
      container.appendChild(item);
    }
  });
}

// Toggle buttons
document.getElementById("gridBtn").addEventListener("click", () => loadMembers("grid"));
document.getElementById("listBtn").addEventListener("click", () => loadMembers("list"));

// Footer info
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Init
loadMembers();
function renderGrid(members) {
  membersEl.className = "grid";
  membersEl.innerHTML = "";
  members.forEach(m => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>🏢 ${m.name}</h3>
      <img src="images/${m.image}" alt="${m.name} logo" loading="lazy"
           onerror="this.src='images/placeholder.svg'; this.alt='Placeholder image';">
      <p>📍 ${m.address}</p>
      <p>📞 ${m.phone}</p>
      <p>🌐 <a href="${m.website}" target="_blank" rel="noopener">Visit website</a></p>
      <p>💎 Membership: ${m.membership}</p>
    `;
    membersEl.appendChild(card);
  });
}

function renderList(members) {
  membersEl.className = "list";
  membersEl.innerHTML = "";
  members.forEach(m => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      🏢 <strong>${m.name}</strong> —
      📍 ${m.address} —
      📞 ${m.phone} —
      🌐 <a href="${m.website}" target="_blank" rel="noopener">Website</a> —
      💎 Level: ${m.membership}
    `;
    membersEl.appendChild(item);
  });
}

