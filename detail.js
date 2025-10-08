document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const detailContainer = document.getElementById("cuisine-detail");
  const cuisines = JSON.parse(localStorage.getItem("cuisines")) || [];

  // Cari data berdasarkan ID
  const cuisine = cuisines.find(c => c.id === id);

  if (!cuisine) {
    detailContainer.innerHTML = "<p>Makanan tidak ditemukan.</p>";
    return;
  }

  // Hapus konten lama biar tidak tumpang tindih
  detailContainer.innerHTML = '';

  // Latar belakang utama
  const detailView = document.createElement('div');
  detailView.className = 'cuisine-detail';
  const bgUrl = cuisine.background || cuisine.BG || "images/default-bg.jpg";
  detailView.style.backgroundImage = `url('${bgUrl}')`; 

  // Modal box
  const modal = document.createElement('div');
  modal.className = 'detail-modal';

  // Tombol X (balik ke halaman utama)
  const backButton = document.createElement('a');
  backButton.href = 'index.html#hero';
  backButton.className = 'back-button';
  backButton.innerHTML = '×';
  modal.appendChild(backButton);

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'detail-content-wrapper';

  // Gambar makanan
  const imageContainer = document.createElement('div');
  imageContainer.className = 'detail-image-container';
  const image = document.createElement('img');
  image.src = cuisine.gambar;
  image.alt = cuisine.nama;
  image.className = 'detail-photo';
  imageContainer.appendChild(image);
  wrapper.appendChild(imageContainer);

  // Kolom teks
  const textContainer = document.createElement('div');
  textContainer.className = 'detail-text-container';

  const title = document.createElement('h1');
  title.textContent = cuisine.nama;
  textContainer.appendChild(title);

  const statGrid = document.createElement('div');
  statGrid.className = 'stat-grid';

  // Lokasi
  const lokasiItem = document.createElement('div');
  lokasiItem.className = 'stat-item';
  lokasiItem.innerHTML = `<span>Lokasi</span><strong>${cuisine.provinsi}</strong>`;
  statGrid.appendChild(lokasiItem);

  // Ciri khas (ambil kalimat pertama dari deskripsi)
  const ciriKhas = cuisine.deskripsi.split('.')[0];
  const ciriKhasItem = document.createElement('div');
  ciriKhasItem.className = 'stat-item';
  ciriKhasItem.innerHTML = `<span>Ciri Khas</span><strong>${ciriKhas}</strong>`;
  statGrid.appendChild(ciriKhasItem);

  // Asal usul (ambil kalimat pertama dari sejarah)
  const faktaMenarik = cuisine.sejarah.split('.')[0] + '.';
  const asalUsulItem = document.createElement('div');
  asalUsulItem.className = 'stat-item';
  asalUsulItem.innerHTML = `<span>Asal Usul</span><strong>${faktaMenarik}</strong>`;
  statGrid.appendChild(asalUsulItem);

  textContainer.appendChild(statGrid);
  wrapper.appendChild(textContainer);

  // Judul sejarah lengkap
  const historyTitle = document.createElement('h3');
  historyTitle.className = 'history-title';
  historyTitle.textContent = 'Asal-usul Lengkap: ';
  wrapper.appendChild(historyTitle);

  // Deskripsi lengkap
  const fullDescription = document.createElement('p');
  fullDescription.className = 'full-description';
  fullDescription.textContent = cuisine.sejarah;
  wrapper.appendChild(fullDescription);

  // Masukkan semuanya
  modal.appendChild(wrapper);
  detailView.appendChild(modal);
  detailContainer.appendChild(detailView);
});
