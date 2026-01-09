// scripts/navigation.js
const menuBtn = document.getElementById('menu');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('closed') === false;
  menuBtn.setAttribute('aria-expanded', String(open));
});
