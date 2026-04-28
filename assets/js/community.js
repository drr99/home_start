const STORAGE_KEY = "community_posts_v1";

/* =====================================================
   1. 로컬스토리지
===================================================== */
function getStore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function ensurePost(store, postId) {
  const defaultLikes = {
    post1: 132,
    post2: 88,
    post3: 201,
    post4: 57,
  };

  if (!store[postId]) {
    store[postId] = {
      like: defaultLikes[postId] || 0,
      comment: 0,
      comments: [],
    };
  } else {
    if (typeof store[postId].like !== "number") {
      store[postId].like = defaultLikes[postId] || 0;
    }

    if (typeof store[postId].comment !== "number") {
      store[postId].comment = 0;
    }

    if (!Array.isArray(store[postId].comments)) {
      store[postId].comments = [];
    }
  }
}

function formatCount(num) {
  return num >= 100 ? "100+" : num;
}

/* =====================================================
   2. 기본 요소
===================================================== */
const store = getStore();
const menuLinks = document.querySelectorAll(".commu_menu_l a");
const cards = document.querySelectorAll(".commu_contents");
const allCards = document.querySelectorAll(".commu_box_main .commu_contents");

/* =====================================================
   3. 목록 좋아요 / 댓글 숫자 반영
===================================================== */
cards.forEach((card, index) => {
  let postId = card.dataset.postId;

  if (!postId) {
    postId = `post${index + 1}`;
    card.dataset.postId = postId;
  }

  ensurePost(store, postId);

  const likeEl = card.querySelector(".like_count");
  const commentEl = card.querySelector(".comment_count");

  if (likeEl) likeEl.textContent = formatCount(store[postId].like || 0);
  if (commentEl)
    commentEl.textContent = formatCount(store[postId].comment || 0);
});

saveStore(store);

/* =====================================================
   4. URL에서 카테고리 가져오기
===================================================== */
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "all";
}

/* =====================================================
   5. 게시글 필터링
===================================================== */
function filterPosts(category) {
  allCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    card.style.display =
      category === "all" || cardCategory === category ? "" : "none";
  });
}

/* =====================================================
   6. 메뉴 active 처리
===================================================== */
function setActiveMenu(category) {
  menuLinks.forEach((link) => {
    const filter = link.dataset.filter || "all";
    link.classList.toggle("active", filter === category);
  });
}

/* =====================================================
   7. 목록 위치로 스크롤 이동
===================================================== */
function moveToList(behavior = "auto") {
  const mainBox = document.querySelector(".commu_box_main");

  if (mainBox) {
    mainBox.scrollIntoView({
      behavior,
      block: "start",
    });
  }
}

/* =====================================================
   8. 메뉴 클릭 이벤트
===================================================== */
menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const filter = this.dataset.filter || "all";
    const url =
      filter === "all" ? "community.html" : `community.html?cat=${filter}`;

    history.pushState(null, "", url);

    filterPosts(filter);
    setActiveMenu(filter);

    // 전체게시글은 가만히, 나머지 카테고리만 이동
    if (filter !== "all") {
      moveToList("smooth");
    }
  });
});

/* =====================================================
   9. 뒤로가기 / 앞으로가기 대응
===================================================== */
window.addEventListener("popstate", () => {
  const category = getCategoryFromUrl();

  filterPosts(category);
  setActiveMenu(category);

  if (category !== "all") {
    moveToList("auto");
  }
});

/* =====================================================
   10. 삭제된 게시물 팝업
===================================================== */
const popup = document.getElementById("deletedPopup");
const popupClose = document.querySelector(".popup_close");

function openPopup() {
  if (popup) popup.classList.add("show");
}

function closePopup() {
  if (popup) popup.classList.remove("show");
}

if (popupClose) {
  popupClose.addEventListener("click", closePopup);
}

cards.forEach((card) => {
  card.addEventListener("click", function (e) {
    if (card.dataset.deleted === "true") {
      e.preventDefault();
      openPopup();
    }
  });
});

if (popup) {
  popup.addEventListener("click", function (e) {
    if (e.target === popup) closePopup();
  });
}

/* =====================================================
   11. 썸네일 생성
===================================================== */
cards.forEach((card) => {
  const img = card.dataset.img;
  if (!img) return;

  let thumb = card.querySelector(".thumb");

  if (!thumb) {
    thumb = document.createElement("div");
    thumb.className = "thumb";
    card.appendChild(thumb);
  }

  thumb.style.backgroundImage = `url(${img})`;
});
+-0;

/* =====================================================
   12. 최초 진입 시 실행
===================================================== */
const currentCategory = getCategoryFromUrl();

filterPosts(currentCategory);
setActiveMenu(currentCategory);

// 게시글에서 카테고리 타고 들어온 경우만 목록으로 이동
window.addEventListener("load", () => {
  if (currentCategory !== "all") {
    moveToList("auto");
  }
});

const writeBtn = document.querySelector(".commu_menu_r");
const footer = document.querySelector("#footer");

window.addEventListener("scroll", () => {
  const footerTop = footer.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  // 푸터가 화면에 올라오기 시작하면
  if (footerTop < windowHeight) {
    const overlap = windowHeight - footerTop;

    // 버튼을 위로 밀어줌
    writeBtn.style.bottom = 30 + overlap + "px";
  } else {
    // 기본 위치
    writeBtn.style.bottom = "30px";
  }
});
