document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById('year');
  const modifiedElement = document.getElementById('lastModified');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (modifiedElement) {
    const lastMod = new Date(document.lastModified);
    modifiedElement.textContent = lastMod.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
});
