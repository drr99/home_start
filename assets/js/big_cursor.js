document.addEventListener("DOMContentLoaded", () => {
  const bbCursor = document.querySelector(".bb-cursor");
  const bbCursorText = document.querySelector(".bb-cursor-text");
  const hoverItems = document.querySelectorAll(".hover-frame");

  if (!bbCursor || !bbCursorText) return;

  hoverItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      bbCursor.classList.add("hovering");
      bbCursorText.textContent = item.dataset.text;
    });

    item.addEventListener("mouseleave", () => {
      bbCursor.classList.remove("hovering");
      bbCursorText.textContent = "";
    });
  });
});
