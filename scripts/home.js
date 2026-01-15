// scripts/course.js
const courses = [
  { code:'WDD231', title:'Frontend Dev I', credits:3, type:'wdd', completed:false },
  { code:'WDD130', title:'Web Fundamentals', credits:2, type:'wdd', completed:true},
  { code:'WDD131', title:'Dynamic Web Fundamentals', credits:2, type:'wdd', completed:true },
  { code:'CSE110', title:'Intro to Programming', credits:2, type:'cse', completed:true },
  { code:'CSE111', title:'Programming with Functions', credits:2, type:'cse', completed:true },
  { code:'CSE210', title:'Programming with Classes', credits:2, type:'cse', completed:false},
  // ...add full certificate list and update completed:true as appropriate
];

const container = document.getElementById('courses');
const totalEl = document.getElementById('creditTotal');

function render(list) {
  container.innerHTML = '';
  list.forEach(c => {
    const card = document.createElement('article');
    card.className = `card ${c.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <h3>${c.code} • ${c.title}</h3>
      <p><strong>Credits:</strong> ${c.credits}</p>
      <p><strong>Type:</strong> ${c.type.toUpperCase()}</p>
      <p><strong>Status:</strong> ${c.completed ? 'Completed' : 'In progress'}</p>`;
    container.appendChild(card);
  });
  const total = list.reduce((sum, c) => sum + c.credits, 0);
  totalEl.textContent = total;
}

function filter(type) {
  if (type === 'wdd') return courses.filter(c => c.type === 'wdd');
  if (type === 'cse') return courses.filter(c => c.type === 'cse');
  return courses;
}

// initial render
render(courses);

// filter buttons
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => render(filter(btn.dataset.filter)));
});
