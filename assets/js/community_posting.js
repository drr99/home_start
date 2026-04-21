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
  if (!store[postId]) {
    const defaultLikes = {
      post1: 132,
      post2: 88,
      post3: 201,
      post4: 57,
    };

    store[postId] = {
      like: defaultLikes[postId] || 0,
    };
  }
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("post") || "post1";
}

function formatCount(num) {
  return num >= 100 ? "100+" : num;
}

/* =========================
   좋아요 기능
========================= */
const postId = getPostId();
const store = getStore();
ensurePost(store, postId);

const postLikeEl = document.querySelector(".posting .like_count");

function updatePostCounts() {
  if (postLikeEl) {
    postLikeEl.textContent = formatCount(store[postId].like);
  }
}

function bindPostLikeEvent() {
  if (!postLikeEl) return;

  let clickTimer = null;

  postLikeEl.addEventListener("click", () => {
    if (clickTimer) return;

    clickTimer = setTimeout(() => {
      store[postId].like += 1;
      updatePostCounts();
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
    saveStore(store);
  });
}

updatePostCounts();
bindPostLikeEvent();
saveStore(store);

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

/* =========================
   HTML 댓글 자동 카운트
========================= */

function updateCommentCountFromHTML() {
  const commentCount = document.querySelectorAll(".comment_box").length;
  const replyCount = document.querySelectorAll(".reply_box").length;

  const total = commentCount + replyCount;

  const commentTitle = document.querySelector(".comment_title span");
  const postComment = document.querySelector(".posting .comment_count");

  if (commentTitle) commentTitle.textContent = total;
  if (postComment) postComment.textContent = total;
}

/* 실행 */
updateCommentCountFromHTML();
