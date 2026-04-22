window.addEventListener("DOMContentLoaded", () => {
  const topBtn = document.querySelector(".top");
  const scrollBox = document.querySelector(".iframe_scroll_content");

  console.log("topBtn:", topBtn);
  console.log("scrollBox:", scrollBox);

  if (topBtn && scrollBox) {
    scrollBox.addEventListener("scroll", () => {
      if (scrollBox.scrollTop > 350) {
        topBtn.classList.add("show");
      } else {
        topBtn.classList.remove("show");
      }
    });

    topBtn.addEventListener("click", () => {
      scrollBox.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
