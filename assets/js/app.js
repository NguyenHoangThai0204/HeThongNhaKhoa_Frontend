const sitemapDefault = "Trang chủ";
let sitemap = sitemapDefault;

function loadComponent(selector, file, callback) {
  fetch(file)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
      if (callback) callback(); // Gọi callback nếu có
    })
    .catch((error) => console.error("Lỗi load component:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#modal-container", "components/modal-datlich.html");
  loadComponent("#form-datlich", "components/modal-datlich.html");

  loadComponent("#header", "components/header.html", () => {
    const menulink = document.querySelectorAll("a[data-page]");
    menulink.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        const pagePath = `pages/${page}.html`;

        if (page === "home") {
          sitemap = sitemapDefault;
          loadComponent("#main", pagePath, initManualSlider);
          loadComponent("#camnghi", "components/item-column.html", renderCamnghi);
          loadComponent("#camnhan", "components/item-camnhankhachhang.html", renderCamnhan);
        } else if (page === "lien-he") {
          sitemap = sitemapDefault + " / " + "Liên hệ";
          loadComponent("#main", pagePath);
        } else if (page === "tin-tuc") {
          sitemap = sitemapDefault + " / " + "Tin tức";
          loadComponent("#main", pagePath, () => {
            //  Sau khi gioi-thieu.html được tải xong mới chèn form
            loadComponent(
              "#sidebar-placeholder",
              "components/dangkyform.html"
            );
          });
        } else if (page === "gioi-thieu") {
          sitemap = sitemapDefault + " / " + "Giới thiệu";
          loadComponent("#main", pagePath, () => {
            //  Sau khi gioi-thieu.html được tải xong mới chèn form
            loadComponent(
              "#sidebar-placeholder",
              "components/dangkyform.html"
            );
          });
        } else if (page === "dich-vu") {
          sitemap = sitemapDefault + " / " + "Dịch vụ";
          loadComponent("#main", pagePath, () => {
            //  Sau khi dich vu.html được tải xong mới chèn form
            loadComponent(
              "#sidebar-placeholder",
              "components/dangkyform.html"
            );
          });
        }
      })
    );
    attachModalEvents();
  });

  loadComponent("#footer", "components/footer.html");

  const homePath = "pages/home.html";
  sitemap = sitemapDefault;
  loadComponent("#main", homePath, initManualSlider);
  loadComponent("#camnghi", "components/item-column.html", renderCamnghi);
  loadComponent("#camnhan", "components/item-camnhankhachhang.html", renderCamnhan);

  
});

/* ==================================================     slide chuyển động 
======================================================= ========================== */
function initManualSlider() {
  const slides = document.querySelector(".slides");
  const images = document.querySelectorAll(".slides img");
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");
  const dotsContainer = document.querySelector(".slider-dots");
  let index = 0;

  // Tạo dots dựa trên số lượng ảnh
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      updateSlide();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".slider-dots .dot");

  const updateSlide = () => {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
  };

  rightBtn.addEventListener("click", () => {
    index = (index + 1) % images.length;
    updateSlide();
  });

  leftBtn.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    updateSlide();
  });

  // Kéo bằng chuột
  let startX = 0;
  let isDown = false;

  slides.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
  });

  slides.addEventListener("mouseup", (e) => {
    if (!isDown) return;
    let delta = e.pageX - startX;
    if (delta < -50) {
      rightBtn.click();
    } else if (delta > 50) {
      leftBtn.click();
    }
    isDown = false;
  });

  slides.addEventListener("mouseleave", () => (isDown = false));
}
// xuất ẩn modal đặt lịch hẹn
function attachModalEvents() {
  const modal = document.getElementById("modal-datlich");
  const openModal = document.getElementById("open-modal");
  const closeModal = document.getElementById("close-modal");

  if (!modal || !openModal || !closeModal) {
    console.error("Một trong các phần tử modal không tồn tại.");
    return;
  }

  openModal.onclick = () => {
    modal.style.display = "block";
  };

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Nội dung cảm nhận của khách hàng
const camnhanData = [
  {
    text: "Tôi rất hài lòng với dịch vụ tại Nha Khoa Việt Pháp.",
    img: "/assets/image/home-cn1.jpg",
    alt: "KH Nhi Thục",
  },
  {
    text: "Đội ngũ bác sĩ rất chuyên nghiệp và tận tâm.",
    img: "/assets/image/home-cn2.jpg",
    alt: "KH Minh Hằng",
  },
  {
    text: "Không gian phòng khám hiện đại, sạch sẽ.",
    img: "/assets/image/home-cn3.jpg",
    alt: "KH Tuấn Anh",
  },
  {
    text: "Lần đầu đi khám răng mà không thấy sợ 😄",
    img: "/assets/image/home-cn4.jpg",
    alt: "KH Ngọc Hà",
  },
];

function renderCamnhan() {
  const container = document.getElementById("camnhan-list");
  if (!container) return;
  container.innerHTML = camnhanData
    .map(
      (item) => `
    <div class="item-camnhan" style=" width:23%; display:block;">
        <span style="margin: 15px 0;">${item.text}</span>
        <img src="${item.img}" alt="${item.alt}">
    </div>
  `
    )
    .join("");
}
// Nội dung cảm nghĩ của khách hàng
const camnghiData = [
  {
    text: "Tôi rất hài lòng với dịch vụ tại Nha Khoa Việt Pháp.",
    img: "/assets/image/home-cn1.jpg",
    alt: "KH Nhi Thục",
  },
  {
    text: "Đội ngũ bác sĩ rất chuyên nghiệp và tận tâm.",
    img: "/assets/image/home-cn2.jpg",
    alt: "KH Minh Hằng",
  },
  {
    text: "Không gian phòng khám hiện đại, sạch sẽ.",
    img: "/assets/image/home-cn3.jpg",
    alt: "KH Tuấn Anh",
  },
  {
    text: "Lần đầu đi khám răng mà không thấy sợ 😄",
    img: "/assets/image/home-cn4.jpg",
    alt: "KH Ngọc Hà",
  },
];

function renderCamnghi() {
  const container = document.getElementById("itemcamnghi-list");
  if (!container) return;
  container.innerHTML = camnghiData
    .map(
      (item) => `
    <div class="item-camnghi" style="border: 1px solid #ccc; width:100%; display:flex; align-items:center; margin:6px; padding:7px;">
        <img src="${item.img}" style="width:80px; height:80px;" alt="${item.alt}">
        <span style="width:70%;padding:10px; color:white;">${item.text}</span>
    </div>
  `
    )
    .join("");
}