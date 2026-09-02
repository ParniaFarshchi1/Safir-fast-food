document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  });
});

const loginModal = document.getElementById("loginModal");
const adminPanelBtn = document.getElementById("adminPanelBtn");
const loginForm = document.getElementById("loginForm");

// نمایش پاپ‌آپ لاگین
function openLoginModal() {
  loginModal.style.display = "block";
}

// بستن پاپ‌آپ لاگین
function closeLoginModal() {
  loginModal.style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("hint").textContent = "";
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === "admin" && p === "1234") {
    window.location.href = "dashboard.html";
  } else {
    let hint = (document.getElementById("hint").textContent =
      "wrong password or username please try again");
  }
});

adminPanelBtn.addEventListener("click", openLoginModal);
