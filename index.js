document.addEventListener("DOMContentLoaded", () => {
  // collection semua makanan dalam JSON
  let cuisines = [];
  // collection semua makanan favorit
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // mengambil elemen dari index.html
  const resultsDiv = document.getElementById("results");
  const searchInput = document.getElementById("search");
  const navHome = document.getElementById("nav-home");
  const navFavs = document.getElementById("nav-favorites");
  const navAbout = document.getElementById("nav-about");

  // mengambil data dari JSON dan memasukkannya ke dalam koleksi makanan
  // TODO: Database makanan.json
  fetch("makanan.json")
    .then(res => res.json())
    .then(data => {
      cuisines = data;
      // membuat grid dari data
      renderResults(cuisines);
    });

  // ---------- Fungsi ---------- //

  // fungsi untuk membuat card setiap data
  function renderResults(list) {
    resultsDiv.innerHTML = "";
    list.forEach(c => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <button class="favorite ${favorites.includes(c.id) ? "active" : ""}" data-id="${c.id}">★</button>
        <img src="${c.gambar}" class="thumb" alt="${c.nama}">
        <h3>${c.nama}</h3>
        <p>${c.sejarah.substring(0, 80)}...</p>
        <a href="detail.html?id=${c.id}">Read More</a>
      `;
      resultsDiv.appendChild(card);
    });

    bindFavoriteButtons();
  }

  // mengubah setiap class favorit dengan state yang sesuai
  function bindFavoriteButtons() {
    document.querySelectorAll(".favorite").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id"); 
        if (favorites.includes(id)) {
          favorites = favorites.filter(f => f !== id);
          btn.classList.remove("active");
        } else {
          favorites.push(id);
          btn.classList.add("active");
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
      });
    });
  }

  // search bar render item yang diketik saja
  searchInput.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = cuisines.filter(c => c.name.toLowerCase().includes(q));
    renderResults(filtered);
  });

  // untuk memberi efek saat halaman terpilih
  function setActive(link) {
    document.querySelectorAll(".navbar a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
  }

  // ---------- Navbar ---------- //

  // show semua item
  navHome.addEventListener("click", e => {
    e.preventDefault();
    setActive(navHome);
    searchInput.style.display = "inline-block";
    renderResults(cuisines);
  });

  // show item yang terpilih favorit
  navFavs.addEventListener("click", e => {
    e.preventDefault();
    setActive(navFavs);
    searchInput.style.display = "none";
    const favList = cuisines.filter(c => favorites.includes(c.id));
    renderResults(favList);
  });

  // show halaman tentang kita
  navAbout.addEventListener("click", e => {
    e.preventDefault();
    setActive(navAbout);
    searchInput.style.display = "none";
    resultsDiv.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <h2>Tentang kami</h2>
        <p>Website ini memamerkan berbagai makanan tradisional dari Indonesia beserta sejarah mereka.</p>
        <p>Indonesia memiliki banyak keunikan dan makanan indonesia adalah salah satu nya, dengan ini kami harap bahwa pengguna dapat melihat betapa banyaknya keberagaman Indonesia</p>
      </div>
    `;
  });
});
