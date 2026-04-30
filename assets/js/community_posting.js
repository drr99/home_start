const STORAGE_KEY = "community_posts_v1";

/* =========================
   로컬스토리지
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
    post5: 0,
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
   게시글 ID
========================= */
function getPostId() {
  const posting = document.querySelector(".posting");

  if (posting && posting.dataset.postId) {
    return posting.dataset.postId;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("post") || "post1";
}

const store = getStore();
const postId = getPostId();

ensurePost(store, postId);

const postLikeEl = document.querySelector(".posting .like_count");
const postCommentEl = document.querySelector(".posting .comment_count");

/* =========================
   본문 숫자
========================= */
function updatePostCounts() {
  if (postLikeEl) {
    postLikeEl.textContent = formatCount(store[postId].like);
  }

  if (postCommentEl) {
    postCommentEl.textContent = formatCount(store[postId].comment);
  }
}

/* =========================
   하단 인기글 숫자
========================= */
function updateBottomPopularCounts() {
  document.querySelectorAll(".pop_posting .commu_contents").forEach((card) => {
    const id = card.dataset.postId;
    if (!id) return;

    ensurePost(store, id);

    const likeEl = card.querySelector(".like_count");
    const commentEl = card.querySelector(".comment_count");

    if (likeEl) likeEl.textContent = formatCount(store[id].like);
    if (commentEl) commentEl.textContent = formatCount(store[id].comment);
  });
}

/* =========================
   좋아요
========================= */
function bindPostLikeEvent() {
  if (!postLikeEl) return;

  let clickTimer = null;

  postLikeEl.addEventListener("click", () => {
    if (clickTimer) return;

    clickTimer = setTimeout(() => {
      store[postId].like += 1;
      updatePostCounts();
      updateBottomPopularCounts();
      saveStore(store);
      clickTimer = null;
    }, 200);
  });

  postLikeEl.addEventListener("dblclick", () => {
    clearTimeout(clickTimer);
    clickTimer = null;

    if (store[postId].like > 0) {
      store[postId].like -= 1;
    }

    updatePostCounts();
    updateBottomPopularCounts();
    saveStore(store);
  });
}

/* =========================
   댓글 카운트
========================= */
function updateCommentCountFromHTML() {
  const total = document.querySelectorAll(".comment_box").length + document.querySelectorAll(".reply_box").length;

  const commentTitle = document.querySelector(".comment_title span");

  if (commentTitle) commentTitle.textContent = total;

  store[postId].comment = total;

  updatePostCounts();
  updateBottomPopularCounts();
  saveStore(store);
}

/* =========================
  레이아웃 깨짐 해결
========================= */
function fixPopularLayout() {
  document.querySelectorAll(".pop_posting .commu_contents").forEach((card) => {
    if (!card.querySelector(".commu_text")) {
      const wrap = document.createElement("div");
      wrap.className = "commu_text";

      const items = card.querySelectorAll(".post_category, .box_title, .box_desc, .box_icon");

      items.forEach((el) => wrap.appendChild(el));

      card.prepend(wrap);
    }
  });
}

/* =========================
   썸네일
========================= */
function createThumbs() {
  document.querySelectorAll(".pop_posting .commu_contents").forEach((card) => {
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
}

/* =========================
   실행
========================= */
updateCommentCountFromHTML();
updatePostCounts();
updateBottomPopularCounts();
bindPostLikeEvent();

fixPopularLayout();
createThumbs();

saveStore(store);

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
