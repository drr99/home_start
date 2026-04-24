// =========================
// 1) 추천템 슬라이더
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

// 2) 공통 요소
// =========================
const categoryLinks = document.querySelectorAll(".shop_box_title a");
const topBtn = document.querySelector(".top");

// =========================
// 6) 탑버튼
// =========================
if (topBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

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
    if (!section.el) return;

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
