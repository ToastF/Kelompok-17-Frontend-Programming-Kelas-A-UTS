document.addEventListener("DOMContentLoaded", () => {
  const landingPageElement = document.getElementById('landing-page');
  if (landingPageElement) {
    const images = ['images/makanan.jpg', 'images/makanan2.jpg', 'images/makanan3.jpg'];
    let currentImageIndex = 0;
    function changeBackgroundImage() {
      landingPageElement.style.backgroundImage = `url('${images[currentImageIndex]}')`;
      currentImageIndex = (currentImageIndex + 1) % images.length;
    }
    changeBackgroundImage();
    setInterval(changeBackgroundImage, 5000);
  }
  
  // Inisialisasi variabel
  let cuisines = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let currentView = "home";
  let selectedProvince = "";

  // Mengambil elemen-elemen dari DOM
  const resultsDiv = document.getElementById("results");
  const searchInput = document.getElementById("search");
  const provinceSearchInput = document.getElementById("province-search");
  const provinceList = document.getElementById("province-list");
  const navHome = document.getElementById("nav-home");
  const navFavs = document.getElementById("nav-favorites");
  const navAbout = document.getElementById("nav-about");

  // Logika untuk Hero Slideshow
  const heroSection = document.getElementById('hero');
  const heroContent = document.querySelector('#hero .hero-content');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let featuredFoods = [];
  let currentFeaturedIndex = 0;
  let heroInterval;

  function updateHeroSection() {
    if (featuredFoods.length === 0) return;
    const food = featuredFoods[currentFeaturedIndex];
    heroSection.style.backgroundImage = `url('${food.gambar}')`;
    heroContent.innerHTML = `
      <h2>${food.nama}</h2>
      <p>${food.deskripsi}</p>
      <a href="detail.html?id=${food.id}" class="hero-button">Lihat Sejarahnya</a>
    `;
  }
  
  function showNextFood() {
    currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredFoods.length;
    updateHeroSection();
  }

  function showPrevFood() {
    currentFeaturedIndex = (currentFeaturedIndex - 1 + featuredFoods.length) % featuredFoods.length;
    updateHeroSection();
  }

  nextBtn.addEventListener('click', () => {
    showNextFood();
    resetHeroInterval();
  });

  prevBtn.addEventListener('click', () => {
    showPrevFood();
    resetHeroInterval();
  });

  // Mengambil data makanan dari file JSON
  fetch("makanan.json")
    .then(res => res.json())
    .then(data => {
      cuisines = data;
      renderResults(cuisines);

      const featuredIds = ["rendang", "mie aceh", "bubur pedas", "karedok", "bubur manado"];
      featuredFoods = cuisines.filter(c => featuredIds.includes(c.id));
      
      if (featuredFoods.length > 0) {
        updateHeroSection();
        startHeroInterval();
      }
    });

  //untuk mengatur kecepatan 1 ke slide lain
  function startHeroInterval() {
    clearInterval(heroInterval); 
    heroInterval = setInterval(() => {
      currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredFoods.length;
      updateHeroSection();
    }, 2000);
  }

  function resetHeroInterval() {
    clearInterval(heroInterval);
    startHeroInterval();
  }


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
        <div class="card-content">
          <h3>${c.nama}</h3>
          <p class="card-province">${c.provinsi || 'Tidak ada provinsi'}</p> 
        </div>
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
          favorites = favorites.filter(f => f !== id);
          btn.classList.remove("active");
        } else {
          favorites.push(id);
          btn.classList.add("active");
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        if (currentView === "favorites") {
          renderResults(cuisines.filter(c => favorites.includes(c.id)));
        }
      });
    });
  }

  // Fungsi untuk search
  function filterCuisines() {
    const query = searchInput.value.toLowerCase();
    const filtered = cuisines.filter(c => {
      const nameMatch = c.nama.toLowerCase().includes(query);
      const provinceMatch = !selectedProvince || (c.provinsi && c.provinsi.trim().toLowerCase().startsWith(selectedProvince.trim().toLowerCase()));
      
      return nameMatch && provinceMatch;
    });
    renderResults(filtered);
  }

  searchInput.addEventListener("input", filterCuisines);

  function getProvinces() {
    // Filter data yang tidak punya provinsi agar tidak muncul di dropdown
    return [...new Set(cuisines.filter(c => c.provinsi).map(c => c.provinsi))].sort(); 
  }

  function renderProvinceDropdown(provinces) {
    provinceList.innerHTML = "";
    provinces.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      li.addEventListener("click", () => {
        selectedProvince = p;
        provinceSearchInput.value = p;
        provinceList.innerHTML = "";
        filterCuisines();
      });
      provinceList.appendChild(li);
    });
  }
  
  function populateProvinceDropdown() {
      const allProvinces = getProvinces();
      renderProvinceDropdown(allProvinces);
  }

  provinceSearchInput.addEventListener('input', () => {
    const query = provinceSearchInput.value;
    selectedProvince = query; // Langsung update filter
    
    const filteredProvinces = getProvinces().filter(p => p.toLowerCase().includes(query.toLowerCase()));
    renderProvinceDropdown(filteredProvinces);
    
    filterCuisines(); // Jalankan filter utama
  });

  provinceSearchInput.addEventListener('focus', populateProvinceDropdown);

  provinceSearchInput.addEventListener("blur", () => {
    setTimeout(() => { provinceList.innerHTML = ""; }, 200);
  });

  function setActive(link) {
    document.querySelectorAll(".navbar a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
  }

  navHome.addEventListener("click", e => { 
    e.preventDefault(); currentView = "home"; setActive(navHome); 
    document.querySelector('.search-container').style.display = "flex"; 
    renderResults(cuisines); 
  });
  
  navFavs.addEventListener("click", e => { 
    e.preventDefault(); currentView = "favorites"; setActive(navFavs); 
    document.querySelector('.search-container').style.display = "none"; 
    renderResults(cuisines.filter(c => favorites.includes(c.id))); 
  });
});