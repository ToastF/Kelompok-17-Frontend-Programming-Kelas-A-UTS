// collection semua makanan favorit
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ambil id (makanan) dari URL (?id=mie aceh)
const params = new URLSearchParams(window.location.search);
const id = params.get("id"); // biarkan string, jangan parseInt

// ambil data makanan dari JSON
// TODO: database makanan.json
fetch("makanan.json")
  .then(res => res.json())
  .then(data => {
    const cuisine = data.find(c => c.id === id);
    if (!cuisine) {
      document.getElementById("cuisine-detail").innerHTML = "<p>505 Not found</p>";
      return;
    }

    document.getElementById("cuisine-detail").innerHTML = `
      <div class="cuisine-detail" style="background-image: url('${cuisine.BG}')">
        <div class="overlay">
          <h1>${cuisine.nama}</h1>
          <img src="${cuisine.gambar}" alt="${cuisine.nama}" class="detail-photo">
          <p>${cuisine.sejarah}</p>
          <button id="fav-btn" class="favorite ${favorites.includes(cuisine.id) ? "active" : ""}">
            ${favorites.includes(cuisine.id) ? "★" : "☆"}
          </button>
        </div>
      </div>
    `;

    // add eventlistener pada tombol favorit
    document.getElementById("fav-btn").addEventListener("click", () => {
      toggleFavorite(cuisine.id);
    });
  });

// mengubah state favorit dari makanan yang dituju
function toggleFavorite(id) {
  const btn = document.getElementById("fav-btn");
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    btn.innerHTML = "☆";
    btn.classList.remove("active");
  } else {
    favorites.push(id);
    btn.innerHTML = "★";
    btn.classList.add("active");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
