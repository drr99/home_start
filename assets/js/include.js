fetch("/common/header.html")
  .then((res) => res.text())
  .then((data) => {
    const header = document.getElementById("header");

    if (header) {
      header.style.visibility = "hidden";
      header.innerHTML = data;

      if (typeof initHeader === "function") {
        initHeader();
      }

      header.style.visibility = "visible";
    }
  });

fetch("/common/footer.html")
  .then((res) => res.text())
  .then((data) => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.innerHTML = data;
    }
  });
// 헤더 푸터 고정 가져오기

function initHeader() {
  const headerInner = document.querySelector(".header_inner");
  const menuBtn = document.querySelector(".menu_icon");
  const sideMenu = document.querySelector(".side_menu");
  const closeBtn = document.querySelector(".side_menu_close");

  let lastScroll = 0;

  if (headerInner && !headerInner.dataset.scrollBound) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= 0) {
        headerInner.classList.remove("hide");
        lastScroll = 0;
        return;
      }

      if (currentScroll > lastScroll) {
        headerInner.classList.add("hide");
      } else {
        headerInner.classList.remove("hide");
      }

      lastScroll = currentScroll;
    });

    headerInner.dataset.scrollBound = "true";
  }

  if (menuBtn && sideMenu && !menuBtn.dataset.menuBound) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu.classList.add("active");
    });

    document.addEventListener("click", (e) => {
      if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.classList.remove("active");
      }
    });

    menuBtn.dataset.menuBound = "true";
  }

  if (closeBtn && sideMenu && !closeBtn.dataset.closeBound) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu.classList.remove("active");
    });

    closeBtn.dataset.closeBound = "true";
  }
}
// 헤더 모션 넣기

document.addEventListener("DOMContentLoaded", () => {
  let bbCursor = document.querySelector(".bb-cursor");

  if (!bbCursor) {
    bbCursor = document.createElement("div");
    bbCursor.className = "bb-cursor";

    const bbCursorText = document.createElement("span");
    bbCursorText.className = "bb-cursor-text";

    bbCursor.appendChild(bbCursorText);
    document.body.appendChild(bbCursor);
  }

  window.addEventListener("mousemove", (e) => {
    bbCursor.style.left = e.clientX + "px";
    bbCursor.style.top = e.clientY + "px";
    bbCursor.classList.add("show");
  });

  document.addEventListener("mouseleave", () => {
    bbCursor.classList.remove("show");
  });

  document.addEventListener("mouseenter", () => {
    bbCursor.classList.add("show");
  });

  const hoverTargets = document.querySelectorAll(
    'a, button, [role="button"], input[type="button"], input[type="submit"], .hover-frame',
  );

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      bbCursor.classList.add("is-hover");
    });

    target.addEventListener("mouseleave", () => {
      bbCursor.classList.remove("is-hover");
    });

    target.addEventListener("mousedown", () => {
      bbCursor.classList.add("is-down");
    });

    target.addEventListener("mouseup", () => {
      bbCursor.classList.remove("is-down");
    });
  });
});
// 커서 공통 생성 + 이동
