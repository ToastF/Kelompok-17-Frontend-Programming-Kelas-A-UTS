document.addEventListener("DOMContentLoaded", () => {
  let cuisines = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let currentView = "home";
  let selectedProvince = "";

  const resultsDiv = document.getElementById("results");
  const searchInput = document.getElementById("search");
  const provinceSearchInput = document.getElementById("province-search");
  const provinceList = document.getElementById("province-list");
  const navHome = document.getElementById("nav-home");
  const navFavs = document.getElementById("nav-favorites");
  const navAbout = document.getElementById("nav-about");

  fetch("makanan.json")
    .then(res => res.json())
    .then(data => {
      cuisines = data;
      renderResults(cuisines);
    });

  function renderResults(list) {
    resultsDiv.innerHTML = "";
    list.forEach(c => {
      const card = document.createElement("div");
      card.className = "card";

      card.addEventListener("click", e => {
        if (e.target.classList.contains("favorite")) return;
        window.location.href = `detail.html?id=${c.id}`;
      });

      card.innerHTML = `
        <button class="favorite ${favorites.includes(c.id) ? "active" : ""}" data-id="${c.id}">★</button>
        <img src="${c.gambar}" class="thumb" alt="${c.nama}">
        <h3>${c.nama}</h3>
        <p>${c.sejarah.substring(0,80)}...</p>
      `;

      resultsDiv.appendChild(card);
    });

    bindFavoriteButtons();
  }

  function bindFavoriteButtons() {
    document.querySelectorAll(".favorite").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        if (favorites.includes(id)) {
          favorites = favorites.filter(f => f!==id);
          btn.classList.remove("active");
        } else {
          favorites.push(id);
          btn.classList.add("active");
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));

        if (currentView==="favorites") {
          renderResults(cuisines.filter(c=>favorites.includes(c.id)));
        }
      });
    });
  }

  function filterCuisines() {
    const q = searchInput.value.toLowerCase();
    const filtered = cuisines.filter(c =>
      (c.nama.toLowerCase().includes(q)) &&
      (!selectedProvince || c.provinsi.toLowerCase() === selectedProvince.toLowerCase().trim())
    );
    renderResults(filtered);
  }

  // Search input
  searchInput.addEventListener("input", filterCuisines);

  // Provinsi typeahead
  function getProvinces() {
    return [...new Set(cuisines.map(c=>c.provinsi))].sort();
  }
  function renderProvinceDropdown(provinces) {
    provinceList.innerHTML = "";
    provinces.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      li.addEventListener("click", ()=>{
        selectedProvince = p;
        provinceSearchInput.value = p;
        provinceList.innerHTML = "";
        filterCuisines();
      });
      provinceList.appendChild(li);
    });
  }
  provinceSearchInput.addEventListener("input", ()=>{
    const q = provinceSearchInput.value.toLowerCase();
    const filtered = getProvinces().filter(p=>p.toLowerCase().includes(q));
    renderProvinceDropdown(filtered);
    if (!q) selectedProvince = "";
    filterCuisines();
  });
  provinceSearchInput.addEventListener("blur", ()=>{
    setTimeout(()=>{provinceList.innerHTML="";},200);
  });

  // Navbar
  function setActive(link) {
    document.querySelectorAll(".navbar a").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
  }
  navHome.addEventListener("click", e=>{e.preventDefault(); currentView="home"; setActive(navHome); searchInput.style.display="inline-block"; provinceSearchInput.style.display="inline-block"; renderResults(cuisines);});
  navFavs.addEventListener("click", e=>{e.preventDefault(); currentView="favorites"; setActive(navFavs); searchInput.style.display="none"; provinceSearchInput.style.display="none"; renderResults(cuisines.filter(c=>favorites.includes(c.id)));});
  navAbout.addEventListener("click", e=>{e.preventDefault(); currentView="about"; setActive(navAbout); searchInput.style.display="none"; provinceSearchInput.style.display="none"; resultsDiv.innerHTML=`<div style="text-align:center;padding:20px;"><h2>Tentang kami</h2><p>Website ini memamerkan berbagai makanan tradisional dari Indonesia beserta sejarah mereka.</p><p>Indonesia memiliki banyak keunikan dan makanan indonesia adalah salah satu nya, dengan ini kami harap bahwa pengguna dapat melihat betapa banyaknya keberagaman Indonesia</p></div>`;});
});

// Fungsi untuk membuat intro screen
const introScreen = document.getElementById("intro-screen");
function showIntro() {
  introScreen.style.display = "flex";
  setTimeout(() => {
    introScreen.style.opacity = "1"; 
    document.querySelector("nav").style.display = "none";
    document.querySelector("main").style.display = "none";
    document.querySelector("footer").style.display = "none";
  }, 50);
}

function hideIntro() {
  introScreen.style.opacity = "0";
  setTimeout(() => {
    introScreen.style.display = "none";
    document.querySelector("nav").style.display = "flex";
    document.querySelector("main").style.display = "block";
    document.querySelector("footer").style.display = "block";
  }, 800);
}

// default tampilin intro
showIntro();

// tombol pada keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    hideIntro();
  } else if (e.key === "ArrowLeft") {
    showIntro();
  }
});
