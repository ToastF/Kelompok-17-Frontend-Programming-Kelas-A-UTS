// Script untuk menunjukkan navbar di banyak halaman

// menunjukkan navbar setelah suatu batas tertentu
document.addEventListener("DOMContentLoaded", () => {
  // hanya bekerja jika terdapat navbar di halaman
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const landing = document.getElementById("landing-page");

  // selain landing page, selalu muncul
  if (!landing) {
    navbar.classList.add("visible");
    navbar.style.position = "fixed";
    return;
  }

  // untuk landing page, muncul setelah poin tertentu
  window.addEventListener("scroll", () => {
    const landingBottom = landing.offsetTop + landing.offsetHeight;

    if (window.scrollY > landingBottom - 50) {
      navbar.classList.add("visible");
    } else {
      navbar.classList.remove("visible");
    }
  });
});
