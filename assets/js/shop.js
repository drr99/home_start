// =========================
// 추천템 슬라이더
// =========================
const swiper = new Swiper(".shop_slider", {
  slidesPerView: 5,
  spaceBetween: 8,
  loop: true,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    480: {
      slidesPerView: 2.5,
      spaceBetween: 8,
    },
    680: {
      slidesPerView: 3.5,
      spaceBetween: 8,
    },
    780: {
      slidesPerView: 4.5,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 5.5,
      spaceBetween: 8,
    },
  },
});

// 메뉴 이미지 효과
const kit = document.querySelector(".kitchen img");
let kitInterval;

kit.addEventListener("mouseenter", () => {
  let frame = 1;

  clearInterval(kitInterval);
  kitInterval = setInterval(() => {
    kit.src = `../assets/img/shop/shop_ani/kit${frame}.svg`;

    frame++;
    if (frame > 5) {
      clearInterval(kitInterval);
    }
  }, 120);
});

kit.addEventListener("mouseleave", () => {
  clearInterval(kitInterval);
  kit.src = "../assets/img/shop/shop_ani/kit0.svg";
});
// 주방 모션

const bed = document.querySelector(".bedroom img");
let bedInterval;

bed.addEventListener("mouseenter", () => {
  let frame = 1;

  clearInterval(bedInterval);
  bedInterval = setInterval(() => {
    bed.src = `../assets/img/shop/shop_ani/bed${frame}.svg`;

    frame++;
    if (frame > 5) {
      clearInterval(bedInterval);
    }
  }, 120);
});
bed.addEventListener("mouseleave", () => {
  clearInterval(bedInterval);
  bed.src = "../assets/img/shop/shop_ani/bed0.svg";
});
// 침실 모션

const bath = document.querySelector(".bathroom img");
let bathInterval;

bath.addEventListener("mouseenter", () => {
  let frame = 1;

  clearInterval(bathInterval);
  bathInterval = setInterval(() => {
    bath.src = `../assets/img/shop/shop_ani/bath${frame}.svg`;

    frame++;
    if (frame > 5) {
      clearInterval(bathInterval);
    }
  }, 120);
});
bath.addEventListener("mouseleave", () => {
  clearInterval(bathInterval);
  bath.src = "../assets/img/shop/shop_ani/bath0.svg";
});
// 욕실 모션

// 공통 요소
// =========================
const categoryLinks = document.querySelectorAll(".shop_box_title a");
const topBtn = document.querySelector(".top");

// =========================
// 버튼 3개(하트, 장바구니, 탑)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const topBtn = document.querySelector(".top");
  const heartBtn = document.querySelector(".heart");
  const basketBtn = document.querySelector(".basket");

  const fixedBtns = [topBtn, heartBtn, basketBtn];

  function toggleFixedBtns() {
    fixedBtns.forEach((btn) => {
      if (!btn) return;

      if (window.scrollY > 350) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });
  }

  window.addEventListener("scroll", toggleFixedBtns);
  toggleFixedBtns();

  topBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  heartBtn?.addEventListener("click", () => {
    heartBtn.classList.add("clicked");

    setTimeout(() => {
      heartBtn.classList.remove("clicked");
    }, 150);
  });

  basketBtn?.addEventListener("click", () => {
    basketBtn.classList.add("clicked");

    setTimeout(() => {
      basketBtn.classList.remove("clicked");
    }, 150);
  });
});

// 미디어쿼리 하단버튼 색 변경
function changeFloatingBtnImages() {
  const isTablet = window.innerWidth <= 1024 && window.innerWidth > 480;

  const heartImg = document.querySelector(".heart img");
  const basketImg = document.querySelector(".basket img");
  const topImg = document.querySelector(".top img");

  if (!heartImg || !basketImg || !topImg) return;

  if (isTablet) {
    heartImg.src = "../assets/img/shop/green_heart.png";
    basketImg.src = "../assets/img/shop/green_basket.png";
    topImg.src = "../assets/img/shop/green_top_button.png";
  } else {
    heartImg.src = "../assets/img/shop/orange_heart.svg";
    basketImg.src = "../assets/img/shop/orange_basket.svg";
    topImg.src = "../assets/img/shop/top_button.png";
  }
}

changeFloatingBtnImages();
window.addEventListener("resize", changeFloatingBtnImages);

//스크롤이벤트
const sections = [
  {
    el: document.getElementById("shop_kit"),
    title: document.querySelector("#shop_kit .shop_category h2"),
  },
  {
    el: document.getElementById("shop_bed"),
    title: document.querySelector("#shop_bed .shop_category h2"),
  },
  {
    el: document.getElementById("shop_bath"),
    title: document.querySelector("#shop_bath .shop_category h2"),
  },
];

function setActiveCategory() {
  let scrollY = window.scrollY - 100; // 보정값

  sections.forEach((section) => {
    if (!section.el || !section.title) return;

    const top = section.el.offsetTop;
    const bottom = top + section.el.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      section.title.classList.add("active");
    } else {
      section.title.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", setActiveCategory);
window.addEventListener("load", setActiveCategory);

window.addEventListener("load", () => {
  const threeBtn = document.querySelector(".three_btn");
  const footer = document.querySelector("#footer");

  if (!threeBtn || !footer) return;

  function moveBtnsAboveFooter() {
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      const overlap = windowHeight - footerTop;
      threeBtn.style.bottom = 20 + overlap + "px";
    } else {
      threeBtn.style.bottom = "20px";
    }
  }

  window.addEventListener("scroll", moveBtnsAboveFooter);
  moveBtnsAboveFooter();
});

// =========================
// 모바일 상품 카테고리 필터 + MORE
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const filterTabs = document.querySelectorAll("#shop_sub_main .filter_tab");
  const mobileProducts = document.querySelectorAll(
    "#shop_sub_main .product_box",
  );
  const mobileShopBoxes = document.querySelectorAll("#shop_sub_main .shop_box");

  const moreWrap = document.querySelector("#mobile_more_wrap");
  const moreBtn = document.querySelector("#mobile_more_btn");
  const moreText = moreBtn ? moreBtn.querySelector(".more_txt") : null;
  const moreIcon = moreBtn ? moreBtn.querySelector("i") : null;

  let currentFilter = "all";
  let isMoreOpen = false;

  function updateMobileProducts() {
    let visibleCount = 0;

    // 빈 shop_box 여백 방지용 클래스 초기화
    mobileShopBoxes.forEach((box) => {
      box.classList.remove("active_box");
    });

    // 상품 필터링
    mobileProducts.forEach((product) => {
      const category = product.dataset.category;
      const isTarget = currentFilter === category;

      if (!isTarget) {
        product.style.display = "none";
        return;
      }

      visibleCount++;

      // 전체 탭에서는 MORE 누르기 전까지 12개만 보이기
      if (currentFilter === "all" && !isMoreOpen && visibleCount > 12) {
        product.style.display = "none";
        return;
      }

      product.style.display = "block";

      const parentBox = product.closest(".shop_box");
      if (parentBox) {
        parentBox.classList.add("active_box");
      }
    });

    // 모든 MORE 버튼 숨기기
    document.querySelectorAll("#shop_sub_main .more_wrap").forEach((wrap) => {
      wrap.classList.remove("is_show");
      wrap.style.display = "none";
    });

    // 전체 탭에서만 MORE 버튼 보이기
    if (moreWrap && currentFilter === "all") {
      moreWrap.classList.add("is_show");
      moreWrap.style.display = "block";
    }

    // MORE / CLOSE 글자와 아이콘 변경
    if (moreBtn && moreText && moreIcon) {
      if (isMoreOpen) {
        moreText.textContent = "CLOSE";
        moreIcon.classList.remove("fa-caret-down");
        moreIcon.classList.add("fa-caret-up");
        moreBtn.classList.add("open");
      } else {
        moreText.textContent = "MORE";
        moreIcon.classList.remove("fa-caret-up");
        moreIcon.classList.add("fa-caret-down");
        moreBtn.classList.remove("open");
      }
    }
  }

  // 카테고리 탭 클릭
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      currentFilter = tab.dataset.filter;
      isMoreOpen = false;

      filterTabs.forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      updateMobileProducts();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  // MORE 버튼 클릭
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      isMoreOpen = !isMoreOpen;
      updateMobileProducts();
    });
  }

  updateMobileProducts();
});
