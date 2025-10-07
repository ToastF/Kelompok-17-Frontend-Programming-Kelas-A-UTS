document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const detailContainer = document.getElementById("cuisine-detail");

  fetch("makanan.json")
    .then(res => res.json())
    .then(data => {
      const cuisine = data.find(c => c.id === id);

      if (!cuisine) {
        detailContainer.innerHTML = "<p>Makanan tidak ditemukan.</p>";
        return;
      }

      // Hapus konten lama untuk mencegah tumpang tindih
      detailContainer.innerHTML = '';

      //Latar Belakang Utama
      const detailView = document.createElement('div');
      detailView.className = 'cuisine-detail';
      detailView.style.backgroundImage = `url('${cuisine.BG}')`;
      // untuk buat kotak model
      const modal = document.createElement('div');
      modal.className = 'detail-modal';

      // tombol x 
      const backButton = document.createElement('a');
      backButton.href = 'index.html#hero';
      backButton.className = 'back-button';
      backButton.innerHTML = '×';
      modal.appendChild(backButton);

      // Buat Wrapper 
      const wrapper = document.createElement('div');
      wrapper.className = 'detail-content-wrapper';

      // Kolom Gambar dan masukkan ke Wrapper
      const imageContainer = document.createElement('div');
      imageContainer.className = 'detail-image-container';
      const image = document.createElement('img');
      image.src = cuisine.gambar;
      image.alt = cuisine.nama;
      image.className = 'detail-photo';
      imageContainer.appendChild(image);
      wrapper.appendChild(imageContainer);

      // untuk poin2
      const textContainer = document.createElement('div');
      textContainer.className = 'detail-text-container';
      
      const title = document.createElement('h1');
      title.textContent = cuisine.nama;
      textContainer.appendChild(title);

      const statGrid = document.createElement('div');
      statGrid.className = 'stat-grid';
      // Poin-poin info dimasukkan ke dalam statGrid
      const lokasiItem = document.createElement('div');
      lokasiItem.className = 'stat-item';
      lokasiItem.innerHTML = `<span>Lokasi</span><strong>${cuisine.provinsi}</strong>`;
      statGrid.appendChild(lokasiItem);
      
      const ciriKhas = cuisine.deskripsi.split('.')[0];
      const ciriKhasItem = document.createElement('div');
      ciriKhasItem.className = 'stat-item';
      ciriKhasItem.innerHTML = `<span>Ciri Khas</span><strong>${ciriKhas}</strong>`;
      statGrid.appendChild(ciriKhasItem);
      
      const faktaMenarik = cuisine.sejarah.split('.')[0] + '.';
      const asalUsulItem = document.createElement('div');
      asalUsulItem.className = 'stat-item';
      asalUsulItem.innerHTML = `<span>Asal Usul</span><strong>${faktaMenarik}</strong>`;
      statGrid.appendChild(asalUsulItem);
      
      textContainer.appendChild(statGrid);
      wrapper.appendChild(textContainer);

      // untuk tite
      const historyTitle = document.createElement('h3');
      historyTitle.className = 'history-title';
      historyTitle.textContent = 'Asal-usul Lengkap: ';
      wrapper.appendChild(historyTitle);
      
      // sejarah lengkap
      const fullDescription = document.createElement('p');
      fullDescription.className = 'full-description';
      fullDescription.textContent = cuisine.sejarah;
      wrapper.appendChild(fullDescription);

     //masukan isi 
      modal.appendChild(wrapper);
      detailView.appendChild(modal);
      detailContainer.appendChild(detailView);
    });
});