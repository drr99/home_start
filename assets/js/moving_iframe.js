const scrollContent = document.querySelector(".iframe_scroll_content");
const scrollIcon = document.querySelector(".custom_scroll_icon");
const scrollTrack = document.querySelector(".custom_scroll_track");

function updateScrollIcon() {
  if (!scrollContent || !scrollIcon || !scrollTrack) return;

  const scrollTop = scrollContent.scrollTop;
  const maxScroll = scrollContent.scrollHeight - scrollContent.clientHeight;
  const scrollPercent = maxScroll > 0 ? scrollTop / maxScroll : 0;

  const trackHeight = scrollTrack.offsetHeight;
  const iconHeight = scrollIcon.offsetHeight;
  const moveRange = trackHeight - iconHeight;
  const iconTop = scrollPercent * moveRange;

  scrollIcon.style.top = iconTop + "px";
}

scrollContent.addEventListener("scroll", updateScrollIcon);
window.addEventListener("load", updateScrollIcon);
window.addEventListener("resize", updateScrollIcon);

function updateScrollIcon() {
  if (!scrollContent || !scrollIcon || !scrollTrack) return;

  const scrollTop = scrollContent.scrollTop;
  const maxScroll = scrollContent.scrollHeight - scrollContent.clientHeight;
  const scrollPercent = maxScroll > 0 ? scrollTop / maxScroll : 0;

  const trackHeight = scrollTrack.offsetHeight;
  const iconHeight = scrollIcon.offsetHeight;
  const moveRange = trackHeight - iconHeight;
  const iconTop = scrollPercent * moveRange;

  scrollIcon.style.top = iconTop + "px";
}

scrollContent.addEventListener("scroll", updateScrollIcon);
window.addEventListener("load", updateScrollIcon);
window.addEventListener("resize", updateScrollIcon);

const topBtn = document.querySelector(".top");
const scrollBox = document.querySelector(".iframe_scroll_content");

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
