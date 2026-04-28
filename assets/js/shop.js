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
      slidesPerView: 3.5,
      spaceBetween: 8,
    },
    780: {
      slidesPerView: 4.5,
      spaceBetween: 8,
    },
    1024: {
      slidesPerView: 5.2,
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
function changeFloatingBtnImages() {
  const isTablet = window.innerWidth <= 1024;

  const heartImg = document.querySelector(".heart img");
  const basketImg = document.querySelector(".basket img");
  const topImg = document.querySelector(".top img");

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
