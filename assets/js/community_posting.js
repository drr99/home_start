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

/* =====================================================
   2. 게시글 ID 가져오기
===================================================== */
function getPostId() {
  const posting = document.querySelector(".posting");

  if (posting && posting.dataset.postId) {
    return posting.dataset.postId;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("post") || "post1";
}

/* =====================================================
   3. 기본 세팅
===================================================== */
const postId = getPostId();
const store = getStore();

ensurePost(store, postId);

const postLikeEl = document.querySelector(".posting .like_count");
const postCommentEl = document.querySelector(".posting .comment_count");

/* =====================================================
   4. 좋아요 / 댓글 숫자 화면 반영
===================================================== */
function updatePostCounts() {
  if (postLikeEl) {
    postLikeEl.textContent = formatCount(store[postId].like);
  }

  if (postCommentEl) {
    postCommentEl.textContent = formatCount(store[postId].comment);
  }
}

/* =====================================================
   5. 좋아요 기능
   - 클릭: +1
   - 더블클릭: -1
===================================================== */
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

/* =====================================================
   6. 댓글 개수 자동 카운트
===================================================== */
function updateCommentCountFromHTML() {
  const commentCount = document.querySelectorAll(".comment_box").length;
  const replyCount = document.querySelectorAll(".reply_box").length;
  const total = commentCount + replyCount;

  const commentTitle = document.querySelector(".comment_title span");

  if (commentTitle) commentTitle.textContent = total;

  store[postId].comment = total;
  saveStore(store);

  updatePostCounts();
}

/* =====================================================
   7. 메뉴 클릭 시 목록페이지 카테고리 이동
===================================================== */
const menuLinks = document.querySelectorAll(".commu_menu_l a");

menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const filter = this.dataset.filter || "all";

    location.href = filter === "all" ? "community.html" : `community.html?cat=${filter}`;
  });
});

/* =====================================================
   8. 게시글 카테고리 클릭 시 목록 이동
===================================================== */
const postCategory = document.querySelector(".post_category");

if (postCategory) {
  postCategory.addEventListener("click", function (e) {
    e.preventDefault();

    const url = this.getAttribute("href");

    location.href = url;
  });
}

/* =====================================================
   9. 인기게시글 썸네일 생성
===================================================== */
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

/* =====================================================
   10. 실행
===================================================== */
updateCommentCountFromHTML();
updatePostCounts();
bindPostLikeEvent();
saveStore(store);

/* =====================================================
   9. 인기게시글 썸네일 생성 + 텍스트 자동 묶기
===================================================== */
document.querySelectorAll(".pop_posting .commu_contents").forEach((card) => {
  const img = card.dataset.img;

  if (!card.querySelector(".commu_text")) {
    const textWrap = document.createElement("div");
    textWrap.className = "commu_text";

    const textItems = card.querySelectorAll(".box_title, .box_desc, .box_icon");

    textItems.forEach((item) => {
      textWrap.appendChild(item);
    });

    card.prepend(textWrap);
  }

  if (!img) return;

  let thumb = card.querySelector(".thumb");

  if (!thumb) {
    thumb = document.createElement("div");
    thumb.className = "thumb";
    card.appendChild(thumb);
  }

  thumb.style.backgroundImage = `url(${img})`;
});

// 글쓰기버튼 푸터위로
const writeBtn = document.querySelector(".commu_menu_r");
const footer = document.querySelector("#footer");

window.addEventListener("scroll", () => {
  const footerTop = footer.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  // 푸터가 화면에 올라오기 시작하면
  if (footerTop < windowHeight) {
    const overlap = windowHeight - footerTop;

    // 버튼을 위로 밀어줌
    writeBtn.style.bottom = 20 + overlap + "px";
  } else {
    // 기본 위치
    writeBtn.style.bottom = "20px";
  }
});
