/* =====================================================
   1. 기본 요소
===================================================== */
const menuLinks = document.querySelectorAll(".commu_menu_l a");
const allCards = document.querySelectorAll(".commu_box_main .commu_contents");

/* =====================================================
   2. URL에서 카테고리 가져오기
   ex) community.html?cat=interior
===================================================== */
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "all";
}

/* =====================================================
   3. 게시글 필터링
===================================================== */
function filterPosts(category) {
  allCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    if (category === "all" || cardCategory === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

/* =====================================================
   4. 메뉴 active 처리
===================================================== */
function setActiveMenu(category) {
  menuLinks.forEach((link) => {
    const filter = link.dataset.filter || "all";
    link.classList.toggle("active", filter === category);
  });
}

/* =====================================================
   5. 목록 위치로 스크롤 이동
===================================================== */
function moveToList(behavior = "auto") {
  const mainBox = document.querySelector(".commu_box_main");

  if (mainBox) {
    mainBox.scrollIntoView({
      behavior: behavior,
      block: "start",
    });
  }
}

/* =====================================================
   6. 메뉴 클릭 이벤트
   - URL 변경
   - 필터 적용
   - active 적용
===================================================== */
menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const filter = this.dataset.filter || "all";
    const url = filter === "all" ? "community.html" : `community.html?cat=${filter}`;

    // URL만 변경 (새로고침 없음)
    history.pushState(null, "", url);

    filterPosts(filter);
    setActiveMenu(filter);
    moveToList("smooth");
  });
});

/* =====================================================
   7. 뒤로가기 / 앞으로가기 대응
===================================================== */
window.addEventListener("popstate", () => {
  const category = getCategoryFromUrl();

  filterPosts(category);
  setActiveMenu(category);
  moveToList("auto");
});

/* =====================================================
   8. 최초 진입 시 실행
===================================================== */
const currentCategory = getCategoryFromUrl();

filterPosts(currentCategory);
setActiveMenu(currentCategory);

window.addEventListener("load", () => {
  moveToList("auto");
});
