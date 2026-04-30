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
   게시글 ID 가져오기
========================= */
function getPostId() {
  const posting = document.querySelector(".posting");

  if (posting && posting.dataset.postId) {
    return posting.dataset.postId;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("post") || "post1";
}

/* =========================
   기본 변수
========================= */
const store = getStore();
const postId = getPostId();

ensurePost(store, postId);

const postLikeEl = document.querySelector(".posting .like_count");
const postCommentEl = document.querySelector(".posting .comment_count");

/* =========================
   게시글 본문 숫자 반영
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
   하단 인기게시글 숫자 반영
========================= */
function updateBottomPopularCounts() {
  const cards = document.querySelectorAll(".pop_posting .commu_contents");

  cards.forEach((card) => {
    const id = card.dataset.postId;
    if (!id) return;

    ensurePost(store, id);

    const likeEl = card.querySelector(".like_count");
    const commentEl = card.querySelector(".comment_count");

    if (likeEl) {
      likeEl.textContent = formatCount(store[id].like);
    }

    if (commentEl) {
      commentEl.textContent = formatCount(store[id].comment);
    }
  });
}

/* =========================
   좋아요 기능
   클릭 +1 / 더블클릭 -1
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
   댓글 개수 자동 카운트
========================= */
function updateCommentCountFromHTML() {
  const commentCount = document.querySelectorAll(".comment_box").length;
  const replyCount = document.querySelectorAll(".reply_box").length;
  const total = commentCount + replyCount;

  const commentTitle = document.querySelector(".comment_title span");

  if (commentTitle) {
    commentTitle.textContent = total;
  }

  store[postId].comment = total;

  updatePostCounts();
  updateBottomPopularCounts();
  saveStore(store);
}

/* =========================
   메뉴 클릭 시 목록 이동
========================= */
function bindMenuLinks() {
  const menuLinks = document.querySelectorAll(".commu_menu_l a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const filter = this.dataset.filter || "all";

      location.href = filter === "all" ? "community.html" : `community.html?cat=${filter}`;
    });
  });
}

/* =========================
   게시글 카테고리 클릭 시 목록 이동
========================= */
function bindPostCategory() {
  const postCategory = document.querySelector(".posting .post_category");

  if (!postCategory) return;

  postCategory.addEventListener("click", function (e) {
    e.preventDefault();

    const url = this.getAttribute("href");
    location.href = url;
  });
}

/* =========================
   하단 인기게시글 썸네일 생성
========================= */
function createBottomPopularThumbs() {
  const cards = document.querySelectorAll(".pop_posting .commu_contents");

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
}

/* =========================
   글쓰기 버튼 푸터 위로 고정
========================= */
function bindWriteButtonPosition() {
  const writeBtn = document.querySelector(".commu_menu_r");
  const footer = document.querySelector("#footer");

  if (!writeBtn || !footer) return;

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
   실행
========================= */
updateCommentCountFromHTML();
updatePostCounts();
updateBottomPopularCounts();
bindPostLikeEvent();
bindMenuLinks();
bindPostCategory();
createBottomPopularThumbs();
bindWriteButtonPosition();
saveStore(store);
