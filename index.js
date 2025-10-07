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
  const modal = document.getElementById("crud-modal");

  // =================================  Hero  ================================= //

  // Logika untuk Hero Slideshow
  const heroSection = document.getElementById('hero');
  const heroContent = document.querySelector('#hero .hero-content');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let featuredFoods = [];
  let currentFeaturedIndex = 0;
  let heroInterval;

  // Ubah isi hero
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
  
  // Ubah makanan dengan makanan berikutnya pada hero
  function showNextFood() {
    currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredFoods.length;
    updateHeroSection();
  }

  // Ubah makanan dengan makanan sebelumnya pada hero
  function showPrevFood() {
    currentFeaturedIndex = (currentFeaturedIndex - 1 + featuredFoods.length) % featuredFoods.length;
    updateHeroSection();
  }

  // Tombol next hero
  nextBtn.addEventListener('click', () => {
    showNextFood();
    resetHeroInterval();
  });

  // Tombol prev hero
  prevBtn.addEventListener('click', () => {
    showPrevFood();
    resetHeroInterval();
  });

  // Inisialisasi Hero, mengambil dari JSON terlebih dahulu dan memilih makanan yang akan ditunjukkan
  // Mengambil data makanan dari file JSON
  fetch("makanan.json")
    .then(res => res.json())
    .then(data => {
      if (!localStorage.getItem("cuisines")) {
        localStorage.setItem("cuisines", JSON.stringify(data));
      }
      cuisines = JSON.parse(localStorage.getItem("cuisines"));
      loadInitialCuisines();
      renderResults(cuisines);

      const featuredIds = ["rendang", "mie aceh", "bubur pedas", "karedok", "bubur manado"];
      featuredFoods = cuisines.filter(c => featuredIds.includes(c.id));
      
      if (featuredFoods.length > 0) {
        updateHeroSection();
        startHeroInterval();
      }
    });

  // Untuk mengatur kecepatan 1 ke slide lain secara otomatis
  function startHeroInterval() {
    clearInterval(heroInterval); 
    heroInterval = setInterval(() => {
      currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredFoods.length;
      updateHeroSection();
    }, 2000);
  }

  // Untuk reset counter jika user menklik tombol kiri atau kanan
  function resetHeroInterval() {
    clearInterval(heroInterval);
    startHeroInterval();
  }

  // =================================  Results  ================================= //

  function renderResults(list) {
    resultsDiv.classList.add("updating"); // beri fade
    showSkeletons(); // tunjukkan skeleton

    setTimeout(() => {
      resultsDiv.innerHTML = "";

      list.forEach(c => {
          const card = document.createElement("div");
          card.className = "card";

          card.addEventListener("click", e => {
            if (e.target.classList.contains("favorite") || e.target.classList.contains("edit-btn") || e.target.classList.contains("delete-btn") ) return;
            window.location.href = `detail.html?id=${c.id}`;
          });

          card.innerHTML = `
            <button class="favorite ${favorites.includes(c.id) ? "active" : ""}" data-id="${c.id}">★</button>
            <button class="edit-btn" data-id="${c.id}">✎</button>
            <button class="delete-btn" data-id="${c.id}">🗑️</button>
            <img src="${c.gambar}" class="thumb" alt="${c.nama}">
            <div class="card-content">
              <h3>${c.nama}</h3>
              <p class="card-province">${c.provinsi || 'Tidak ada provinsi'}</p> 
            </div>
          `;

          resultsDiv.appendChild(card);
        }
      );

      // Card untuk menunjukkan model
      const addCard = document.createElement("div");
      addCard.className = "card add-card";
      addCard.innerHTML = `
        <div class="add-content">
          <span class="plus-icon">＋</span>
          <p>Tambah Makanan</p>
        </div>
      `;
      resultsDiv.appendChild(addCard);
      addCard.addEventListener("click", () => openDialog(true));

      bindFavoriteButtons();
      bindEditButtons();
      bindDeleteButtons();
      resultsDiv.classList.remove("updating"); 
    }, 500); 
  }

  // untuk menambahkan tombol favorit pada setiap kartu
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

  // untuk menambahkan tombol edit pada setiap kartu
  function bindEditButtons() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cuisines = getCuisines();
        const item = cuisines.find(c => c.id === id);
        if (!item) return;

        // Prefill modal fields
        document.getElementById("modal-title").textContent = "Edit Makanan";
        document.getElementById("food-name").value = item.nama;
        document.getElementById("food-desc").value = item.deskripsi;
        document.getElementById("food-province").value = item.provinsi;
        document.getElementById("food-history").value = item.sejarah;

        // store current edit ID
        modal.dataset.editingId = id;

        openDialog();
      });
    });
  }

  // untuk menambahkan tombol hapus pada setiap kartu
  function bindDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation(); 
        const id = btn.dataset.id;

        const confirmDelete = confirm("Yakin ingin menghapus makanan ini?");
        if (!confirmDelete) return;

        deleteCuisine(id);
        renderResults(getCuisines());
      });
    });
  }

  // Jika sedang mencari, kita beri skeleton agar terlihat jika sedang terjadi query
  function showSkeletons() {
    resultsDiv.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "card skeleton-card";
      skeleton.innerHTML = `
        <div class="skeleton thumb"></div>
        <div class="card-content">
          <div class="skeleton title"></div>
          <div class="skeleton text"></div>
        </div>
      `;
      resultsDiv.appendChild(skeleton);
    }
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

  // setiap input menfilter makanan
  searchInput.addEventListener("input", filterCuisines);

  // Mengambil semua makanan dengan provinsi
  function getProvinces() {
    // Filter data yang tidak punya provinsi agar tidak muncul di dropdown
  }

  // Render atau tunjukkan dropdown dengan list provinsi pad
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
  
  // Isi dropdown dengan semua provinsi terlebih dahulu
  function populateProvinceDropdown() {
      const allProvinces = getProvinces();
      renderProvinceDropdown(allProvinces);
  }

  // Filter makanan setiap input filter
  provinceSearchInput.addEventListener('input', () => {
    const query = provinceSearchInput.value;
    selectedProvince = query; // Langsung update filter
    
    const filteredProvinces = getProvinces().filter(p => p.toLowerCase().includes(query.toLowerCase()));
    renderProvinceDropdown(filteredProvinces);
    
    filterCuisines(); // Jalankan filter utama
  });

  // Ketika filter diklik, tunjukkan semua provinsi
  provinceSearchInput.addEventListener('focus', populateProvinceDropdown);

  provinceSearchInput.addEventListener("blur", () => {
    setTimeout(() => { provinceList.innerHTML = ""; }, 200);
  });

  // menunjukkan navbar setelah suatu batas tertentu
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    const landing = document.getElementById("landing-page");

    if (!navbar || !landing) return;

    const landingBottom = landing.offsetTop + landing.offsetHeight;

    if (window.scrollY > landingBottom - 50) {
      navbar.classList.add("visible");
    } else {
      navbar.classList.remove("visible");
    }
  });

  // Fungsi untuk menentukan status aktif suatu tab navbar
  function setActive(link) {
    document.querySelectorAll(".navbar a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
  }

  // Tab-tab pada navbar
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



  // LOCAL
  // init
  async function loadInitialCuisines() {
    const stored = localStorage.getItem('cuisines');
    if (stored) {
      cuisines = JSON.parse(stored);
    } else {
      const response = await fetch('data/makanan.json');
      cuisines = await response.json();
      localStorage.setItem('cuisines', JSON.stringify(cuisines));
    }

    // Jika terjadi error saat fetch image, reload
    cuisines.forEach(c => {
      const img = new Image();
      img.onerror = () => {
        console.warn(`Image failed for ${c.nama}, reloading data...`);
        localStorage.removeItem('cuisines');
        location.reload();
      };
      img.src = c.gambar;
    });
  }
  

  function getCuisines() {
    return JSON.parse(localStorage.getItem('cuisines')) || [];
  }

  function saveCuisines(cuisines) {
    localStorage.setItem('cuisines', JSON.stringify(cuisines));
  }

  function addCuisine(newCuisine) {
    const cuisines = getCuisines();
    cuisines.push(newCuisine);
    saveCuisines(cuisines);
  }

  function deleteCuisine(id) {
    let cuisines = getCuisines();
    cuisines = cuisines.filter(c => c.id !== id);
    saveCuisines(cuisines);
  }

  function updateCuisine(id, updatedFields) {
    let cuisines = getCuisines();
    cuisines = cuisines.map(c => 
      c.id === id ? { ...c, ...updatedFields } : c
    );
    saveCuisines(cuisines);
  }

  // Untuk menutup modal
  document.getElementById("cancel-modal").addEventListener("click", closeModal);
  
  // Untuk dropdown add/edit modal
  const provinces = [
      "Nanggroe Aceh Darussalam", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", 
      "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", 
      "Kepulauan Bangka Belitung", "DKI Jakarta", "Jawa Barat", "Banten", 
      "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", 
      "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", 
      "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", 
      "Kalimantan Timur", "Kalimantan Utara", 
      "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", 
      "Sulawesi Selatan", "Sulawesi Tenggara", 
      "Maluku", "Maluku Utara", 
      "Papua", "Papua Tengah", "Papua Pegunungan", 
      "Papua Selatan", "Papua Barat", "Papua Barat Daya"
    ];

    const provinceSelect = document.getElementById("food-province");
    provinces.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      provinceSelect.appendChild(opt);
    });

  // untuk membuka modal
  function openDialog(isAdd = false) {
    const title = document.getElementById("modal-title");

    if (isAdd) {
      document.getElementById("food-name").value = "";
      document.getElementById("food-desc").value = "";
      document.getElementById("food-province").value = "";
      document.getElementById("food-history").value = "";
      document.getElementById("food-image").value = "";
      document.getElementById("food-background").value = "";

      delete modal.dataset.editingId;

      title.textContent = "Tambah Makanan";
    }

    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  document.getElementById("save-food").addEventListener("click", async () => {
    const name = document.getElementById("food-name").value.trim();
    const desc = document.getElementById("food-desc").value.trim();
    const province = document.getElementById("food-province").value.trim();
    const history = document.getElementById("food-history").value.trim();   
    const imgFile = document.getElementById("food-image").files[0];
    const bgFile = document.getElementById("food-background").files[0];
    const editingId = modal.dataset.editingId; 
    const cuisines = getCuisines();


    if (!name || !desc || !province || !history || (!editingId && (!imgFile || !bgFile))) {
      alert("Semua informasi harus terisi!");
      return;
    }

    // untuk save image
    const toBase64 = file => new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = err => rej(err);
      reader.readAsDataURL(file);
    });

    const imageBase64 = imgFile ? await toBase64(imgFile) : "";
    const bgBase64 = bgFile ? await toBase64(bgFile) : "";

    if (editingId) {
      // if edit
      const oldCuisine = cuisines.find(c => c.id === editingId);
      
      updateCuisine(editingId, {
        nama: name,
        deskripsi: desc,
        provinsi: province,
        gambar: imgFile ? imageBase64 : oldCuisine.gambar,    
        background: bgFile ? bgBase64 : oldCuisine.background,
        sejarah: history
      });
    } else {
      // if add
      // cek jika pernah dimasukkan
      const nameExists = cuisines.some(
        c => c.nama.toLowerCase() === name.toLowerCase()
      );

      if (nameExists) {
        alert("Nama makanan sudah ada! Gunakan nama lain.");
        return;
      }

      const newItem = {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        nama: name,
        deskripsi: desc,
        provinsi: province,
        gambar: imageBase64,
        background: bgBase64,
        sejarah: history
      };
      addCuisine(newItem);
    }

    const updated = getCuisines();
    delete modal.dataset.editingId;
    closeModal();
    renderResults(updated);
  });
  
});