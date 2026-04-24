const STORAGE_KEY = "community_posts_v1";

/* =========================
   로컬스토리지 관련 함수
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
    post2: 108,
    post3: 100,
    post4: 57,
  };

  const defaultComments = {
    post1: 12,
    post2: 8,
    post3: 5,
    post4: 0,
  };

  if (!store[postId]) {
    store[postId] = {
      like: defaultLikes[postId] || 0,
      comment: defaultComments[postId] || 0,
      comments: [],
    };
  } else {
    // 예전 데이터 보정
    if (typeof store[postId].like !== "number") {
      store[postId].like = defaultLikes[postId] || 0;
    }

    if (typeof store[postId].comment !== "number") {
      store[postId].comment = defaultComments[postId] || 0;
    }

    if (!Array.isArray(store[postId].comments)) {
      store[postId].comments = [];
    }
  }
}

function formatCount(num) {
  return num >= 100 ? "100+" : num;
}

/* =========================
   기본 데이터 세팅
========================= */
const store = getStore();
const cards = document.querySelectorAll(".commu_contents");

/* =========================
   게시글 목록 초기화
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

  if (likeEl) {
    likeEl.textContent = formatCount(store[postId].like || 0);
  }

  if (commentEl) {
    commentEl.textContent = formatCount(store[postId].comment || 0);
  }
});

saveStore(store);

/* =========================
   삭제된 게시물 팝업
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
    if (e.target === popup) {
      closePopup();
    }
  });
}

/* =========================
   메뉴 active + 카테고리 필터
========================= */
const menuLinks = document.querySelectorAll(".commu_menu_l a");
const allCards = document.querySelectorAll(".commu_box_main .commu_contents");

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "all";
}

function filterPosts(category) {
  allCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    card.style.display = category === "all" || cardCategory === category ? "" : "none";
  });
}

function setActiveMenu(category) {
  menuLinks.forEach((link) => {
    const filter = link.dataset.filter || "all";
    link.classList.toggle("active", filter === category);
  });
}

menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const filter = this.dataset.filter || "all";

    const url = filter === "all" ? "community.html" : `community.html?cat=${filter}`;
    history.pushState(null, "", url);

    filterPosts(filter);
    setActiveMenu(filter);
  });
});

window.addEventListener("popstate", () => {
  const category = getCategoryFromUrl();
  filterPosts(category);
  setActiveMenu(category);
});

const currentCategory = getCategoryFromUrl();
filterPosts(currentCategory);
setActiveMenu(currentCategory);
