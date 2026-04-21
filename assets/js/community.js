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
  if (!store[postId]) {
    store[postId] = {
      like: 0,
      comment: 0,
      comments: [],
    };
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
   - postId 없으면 자동 생성
   - 좋아요 / 댓글 수 출력
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
  if (popup) {
    popup.classList.add("show");
  }
}

function closePopup() {
  if (popup) {
    popup.classList.remove("show");
  }
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
   메뉴 active 처리
========================= */
const menuLinks = document.querySelectorAll(".commu_menu_l a");

menuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    menuLinks.forEach((el) => el.classList.remove("active"));
    this.classList.add("active");
  });
});
