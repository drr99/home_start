const STORAGE_KEY = "community_posts_v1";

/* =========================
   1. 로컬스토리지
========================= */
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
  }

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

function formatCount(num) {
  return num >= 100 ? "100+" : num;
}

/* =========================
   2. 기본 요소
========================= */
const store = getStore();
const menuLinks = document.querySelectorAll(".commu_menu_l a");
const cards = document.querySelectorAll(".commu_contents");
const allCards = document.querySelectorAll(".commu_box_main .commu_contents");

/* =========================
   3. 목록 좋아요 / 댓글 반영
========================= */
cards.forEach((card, index) => {
  let postId = card.dataset.postId;

  if (!postId) {
    postId = `post${index + 1}`;
    card.dataset.postId = postId;
  }

  ensurePost(store, postId);

  const likeEl = card.querySelector(".like_count");
  const commentEl = card.querySelector(".comment_count");

  if (likeEl) likeEl.textContent = formatCount(store[postId].like);
  if (commentEl) commentEl.textContent = formatCount(store[postId].comment);
});

saveStore(store);

/* =========================
   4. URL 카테고리
========================= */
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "all";
}

/* =========================
   5. 게시글 필터
========================= */
function filterPosts(category) {
  allCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    card.style.display = category === "all" || cardCategory === category ? "" : "none";
  });
}

/* =========================
   6. 메뉴 active
========================= */
function setActiveMenu(category) {
  menuLinks.forEach((link) => {
    const filter = link.dataset.filter || "all";
    link.classList.toggle("active", filter === category);
  });
}

/* =========================
   7. 스크롤 이동
========================= */
function moveToList(behavior = "auto") {
  const mainBox = document.querySelector(".commu_box_main");

  if (mainBox) {
    mainBox.scrollIntoView({
      behavior,
      block: "start",
    });
  }
}

/* =========================
   8. 메뉴 클릭
========================= */
menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const filter = this.dataset.filter || "all";
    const url = filter === "all" ? "community.html" : `community.html?cat=${filter}`;

    history.pushState(null, "", url);

    filterPosts(filter);
    setActiveMenu(filter);

    if (filter !== "all") {
      moveToList("smooth");
    }
  });
});

/* =========================
   9. 뒤로가기 대응
========================= */
window.addEventListener("popstate", () => {
  const category = getCategoryFromUrl();

  filterPosts(category);
  setActiveMenu(category);

  if (category !== "all") {
    moveToList("auto");
  }
});

/* =========================
   10. 삭제된 게시물 팝업
========================= */
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

/* =========================
   11. 썸네일 생성
========================= */
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

/* =========================
   12. 초기 실행
========================= */
const currentCategory = getCategoryFromUrl();

filterPosts(currentCategory);
setActiveMenu(currentCategory);

window.addEventListener("load", () => {
  if (currentCategory !== "all") {
    moveToList("auto");
  }
});

/* =========================
   13. 글쓰기 버튼 (푸터 충돌 방지)
========================= */
const writeBtn = document.querySelector(".commu_menu_r");
const footer = document.querySelector("#footer");

if (writeBtn && footer) {
  window.addEventListener("scroll", () => {
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      const overlap = windowHeight - footerTop;
      writeBtn.style.bottom = 20 + overlap + "px";
    } else {
      writeBtn.style.bottom = "20px";
    }
  });
}

/* =========================
   전체 게시글 좋아요/댓글 보정
========================= */
const DEFAULT_COUNTS = {
  post1: { like: 132, comment: 4 },
  post2: { like: 88, comment: 2 },
  post3: { like: 201, comment: 0 },
  post4: { like: 57, comment: 4 },
  post5: { like: 0, comment: 0 },
};

Object.keys(DEFAULT_COUNTS).forEach((id) => {
  if (!store[id]) {
    store[id] = {
      like: DEFAULT_COUNTS[id].like,
      comment: DEFAULT_COUNTS[id].comment,
      comments: [],
    };
  }

  if (typeof store[id].like !== "number") {
    store[id].like = DEFAULT_COUNTS[id].like;
  }

  if (typeof store[id].comment !== "number") {
    store[id].comment = DEFAULT_COUNTS[id].comment;
  }

  if (!Array.isArray(store[id].comments)) {
    store[id].comments = [];
  }

  /* 기존에 0으로 잘못 저장된 값 복구 */
  if (store[id].like === 0 && DEFAULT_COUNTS[id].like > 0) {
    store[id].like = DEFAULT_COUNTS[id].like;
  }

  if (store[id].comment === 0 && DEFAULT_COUNTS[id].comment > 0) {
    store[id].comment = DEFAULT_COUNTS[id].comment;
  }

  /* post4가 예전에 100+로 저장된 경우만 복구 */
  if (id === "post4" && store[id].like >= 100) {
    store[id].like = 57;
  }
});

/* 화면에 다시 반영 */
document.querySelectorAll(".commu_contents").forEach((card) => {
  const id = card.dataset.postId;
  if (!id || !store[id]) return;

  const likeEl = card.querySelector(".like_count");
  const commentEl = card.querySelector(".comment_count");

  if (likeEl) likeEl.textContent = formatCount(store[id].like);
  if (commentEl) commentEl.textContent = formatCount(store[id].comment);
});

if (postLikeEl && store[postId]) {
  postLikeEl.textContent = formatCount(store[postId].like);
}

if (postCommentEl && store[postId]) {
  postCommentEl.textContent = formatCount(store[postId].comment);
}

saveStore(store);
