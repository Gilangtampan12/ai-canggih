const aiSelector = document.getElementById('aiSelector');
const chat = document.getElementById('chat');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

let aiData = {};
let currentAI = null;

async function loadAIs() {
  const res = await fetch('ai.json');
  aiData = await res.json();
  
  aiSelector.innerHTML = '';
  Object.keys(aiData).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    aiSelector.appendChild(opt);
  });
  
  currentAI = aiData[aiSelector.value];
}

aiSelector.addEventListener('change', () => {
  currentAI = aiData[aiSelector.value];
  chat.innerHTML = '';
  saveMemory(); 
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (!msg) return;
  
  addMessage('🧑 Kamu', msg);
  userInput.value = '';
  
  setTimeout(() => {
    const response = generateResponse(msg);
    addMessage(`🤖 ${aiSelector.value}`, response);
    saveMemory();
  }, 500);
});

function addMessage(sender, text) {
  const div = document.createElement('div');
  div.className = "relative bg-gray-600 p-2 rounded";

  const codeRegex = /```(.*?)\n([\s\S]*?)```/g;
  let content = text.replace(codeRegex, (match, lang, code) => {
    const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const codeId = `code-${Math.random().toString(36).substring(2, 10)}`;
    return `
      <div class="relative my-2">
        <button onclick="copyCode('${codeId}')" class="absolute right-2 top-2 text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded">Salin</button>
        <pre class="bg-black text-green-400 p-3 mt-6 rounded text-sm overflow-x-auto">
<code id="${codeId}" class="language-${lang}">${escaped}</code></pre>
      </div>`;
  });

  div.innerHTML = `<strong>${sender}:</strong><br>${content}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function generateResponse(input) {
  const prompt = currentAI.prompt || '';
  const tone = currentAI.tone || '';
  const style = currentAI.style || '';
  const knowledge = currentAI.knowledge || '';

  const fullPrompt = `${prompt}\nGaya: ${style}, Nada: ${tone}, Keahlian: ${knowledge}\nUser: ${input}\nAI:`;

  let reply = simulateAI(fullPrompt, input);
  
  const memory = loadMemory();
  memory.push({ from: 'user', message: input });
  memory.push({ from: 'ai', message: reply });
  return reply;
}

function loadMemory() {
  const mem = localStorage.getItem(`mem_${aiSelector.value}`);
  return mem ? JSON.parse(mem) : [];
}

function saveMemory() {
  const messages = Array.from(chat.children).map(div => div.textContent);
  localStorage.setItem(`mem_${aiSelector.value}`, JSON.stringify(messages));
}

loadAIs();
function copyCode(id) {
  const codeEl = document.getElementById(id);
  if (!codeEl) return;
  
  const text = codeEl.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Kode berhasil disalin!");
  }).catch(err => {
    alert("Gagal menyalin.");
    console.error(err);
  });
}
function simulateAI(prompt, input) {
  const lower = input.toLowerCase().trim();

  if (lower.includes("form login")) {
    return "Berikut contoh form login dengan Tailwind CSS:\n```html\n<form class='space-y-4'>\n  <input type='text' placeholder='Username' class='border p-2 rounded w-full'>\n  <input type='password' placeholder='Password' class='border p-2 rounded w-full'>\n  <button class='bg-blue-600 text-white px-4 py-2 rounded'>Login</button>\n</form>\n```";
  } else if (lower.includes("navbar")) {
    return "Berikut navbar responsif dengan Tailwind:\n```html\n<nav class='bg-gray-800 text-white p-4'>\n  <ul class='flex gap-4'>\n    <li><a href='#'>Home</a></li>\n    <li><a href='#'>About</a></li>\n  </ul>\n</nav>\n```";
  } else if (lower.includes("halo dunia") || lower.includes("hello world")) {
    return "Berikut contoh HTML dasar:\n```html\n<!DOCTYPE html>\n<html>\n<head><title>Halo Dunia</title></head>\n<body>\n  <h1>Halo Dunia!</h1>\n</body>\n</html>\n```";
  } else if (lower.includes("portofolio")) {
    return `Berikut contoh web portofolio pribadi:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Portofolio Yudha</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white font-sans">
  <div class="p-8 text-center">
    <img src="https://via.placeholder.com/150" class="mx-auto rounded-full mb-4">
    <h1 class="text-3xl font-bold">Yudha Tampan</h1>
    <p class="text-gray-300">Web Developer | UI Designer</p>
    <div class="mt-4">
      <a href="mailto:yudha@email.com" class="underline text-blue-400">Hubungi saya</a>
    </div>
  </div>
</body>
</html>
\`\`\``;
  } if (lower.includes("toko online") || lower.includes("store")) {
  return `Berikut contoh web toko online sederhana dengan JavaScript:\n\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Toko Yudha</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-gray-800">

  <!-- Header -->
  <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">🛍️ Toko Yudha</h1>
    <div class="relative">
      <span class="bg-red-500 text-white rounded-full text-xs px-2 py-0.5 absolute -top-2 -right-2" id="cartCount">0</span>
      <svg class="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M3 3h2l.4 2M7 13h14l-1.5 6H6L4 6H2"></path>
      </svg>
    </div>
  </div>

  <!-- Produk -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
    <div class="border p-4 rounded bg-white shadow">
      <img src="https://via.placeholder.com/150" class="mx-auto mb-2">
      <h2 class="font-bold text-lg">Produk A</h2>
      <p class="mb-2">Rp 50.000</p>
      <button onclick="tambahKeranjang()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Beli</button>
    </div>
    <div class="border p-4 rounded bg-white shadow">
      <img src="https://via.placeholder.com/150" class="mx-auto mb-2">
      <h2 class="font-bold text-lg">Produk B</h2>
      <p class="mb-2">Rp 75.000</p>
      <button onclick="tambahKeranjang()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Beli</button>
    </div>
    <div class="border p-4 rounded bg-white shadow">
      <img src="https://via.placeholder.com/150" class="mx-auto mb-2">
      <h2 class="font-bold text-lg">Produk C</h2>
      <p class="mb-2">Rp 100.000</p>
      <button onclick="tambahKeranjang()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Beli</button>
    </div>
  </div>

  <!-- Script -->
  <script>
    let count = 0;
    function tambahKeranjang() {
      count++;
      document.getElementById('cartCount').innerText = count;
    }
  </script>

</body>
</html>
\`\`\``;
} else if (lower.includes("website nonton anime")) {
  return `Berikut contoh web nonton anime dengan fitur pencarian, tampilan responsif, dan dark mode:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Nonton Anime</title>
  <script defer src="anime.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-3xl font-bold mb-4 text-center">🎬 Daftar Anime</h1>

  <!-- Input Pencarian -->
<input type="text" id="searchInput" placeholder="Cari anime..." class="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700">

<!-- Filter Genre -->
<select id="genreFilter" class="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700">
  <option value="">Semua Genre</option>
  <option value="Action">Action</option>
  <option value="Fantasy">Fantasy</option>
  <option value="Drama">Drama</option>
</select>

<!-- Sorting -->
<select id="sortSelect" class="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700">
  <option value="">Urutkan</option>
  <option value="az">A-Z</option>
  <option value="za">Z-A</option>
</select>

<!-- Total Hasil -->
<p id="totalResult" class="text-sm text-gray-400 mb-4"></p>
<!-- Modal Video -->
<div id="modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center hidden z-50">
  <div class="bg-gray-900 p-4 rounded-lg w-full max-w-2xl relative">
    <button id="closeModal" class="absolute top-2 right-2 text-white text-xl">✖</button>
    <h2 id="modalTitle" class="text-xl font-bold mb-2"></h2>
    <p id="modalDesc" class="text-gray-300 mb-2"></p>
    <iframe id="modalVideo" class="w-full aspect-video rounded mb-4" allowfullscreen></iframe>

    <!-- Komentar -->
    <h3 class="font-semibold mb-2">Komentar:</h3>
    <div id="commentList" class="space-y-2 mb-2 max-h-40 overflow-y-auto"></div>
    <textarea id="commentInput" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2" placeholder="Tulis komentarmu..."></textarea>
    <button id="sendComment" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Kirim</button>
  </div>
</div>

  <div id="animeList" class="grid md:grid-cols-2 gap-6"></div>
</body>
</html>
\`\`\`\n\n\`\`\`js (anime.js)
const animeData = [
  {
    title: "Naruto Shippuden Episode 1",
    description: "Naruto kembali ke desa setelah 2 tahun latihan.",
    video: "https://www.youtube.com/embed/JVgFAm7KXek",
    genre: "Action",
    cover: "https://i.ytimg.com/vi/JVgFAm7KXek/hqdefault.jpg"
  },
  {
    title: "Demon Slayer Episode 1",
    description: "Tanjiro menemukan keluarganya dibantai oleh iblis.",
    video: "https://www.youtube.com/embed/VQGCKyvzIM4",
    genre: "Fantasy",
    cover: "https://i.ytimg.com/vi/VQGCKyvzIM4/hqdefault.jpg"
  },
  {
    title: "Attack on Titan Episode 1",
    description: "Dinding Maria dihancurkan oleh Titan Kolosal.",
    video: "https://www.youtube.com/embed/MGRm4IzK1SQ",
    genre: "Drama",
    cover: "https://i.ytimg.com/vi/MGRm4IzK1SQ/hqdefault.jpg"
  }
];

const container = document.getElementById("animeList");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const sortSelect = document.getElementById("sortSelect");
const totalResult = document.getElementById("totalResult");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function renderAnime(data) {
  container.innerHTML = "";
  totalResult.textContent = \`Menampilkan \${data.length} anime\`;
  
  data.forEach(anime => {
    const card = document.createElement("div");
    card.className = "bg-gray-800 p-4 rounded shadow hover:shadow-lg transition";

    const isFavorited = favorites.includes(anime.title);

    card.innerHTML = \`
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-1">\${anime.title}</h2>
        <button class="favorite-btn text-yellow-400">\${isFavorited ? "★" : "☆"}</button>
      </div>
      <p class="text-gray-300 mb-1">Genre: <span class="italic">\${anime.genre}</span></p>
      <p class="text-gray-300 mb-2">\${anime.description}</p>
      <iframe src="\${anime.video}" class="w-full aspect-video rounded" allowfullscreen></iframe>
    \`;
    
    const favBtn = card.querySelector(".favorite-btn");
    favBtn.addEventListener("click", () => toggleFavorite(anime.title));

    container.appendChild(card);
  });
}

function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(t => t !== title);
  } else {
    favorites.push(title);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilters();
}

function applyFilters() {
  let keyword = searchInput.value.toLowerCase();
  let genre = genreFilter.value;
  let sort = sortSelect.value;

  let filtered = animeData.filter(anime =>
    anime.title.toLowerCase().includes(keyword) &&
    (genre === "" || anime.genre === genre)
  );

  if (sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "za") filtered.sort((a, b) => b.title.localeCompare(a.title));

  renderAnime(filtered);
}

searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

applyFilters();
// MODAL VIDEO + KOMENTAR
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalVideo = document.getElementById("modalVideo");
const closeModal = document.getElementById("closeModal");
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const sendComment = document.getElementById("sendComment");

let currentAnimeTitle = "";

function showModal(anime) {
  modal.classList.remove("hidden");
  modalTitle.textContent = anime.title;
  modalDesc.textContent = anime.description;
  modalVideo.src = anime.video;
  currentAnimeTitle = anime.title;
  loadComments(anime.title);
}

function hideModal() {
  modal.classList.add("hidden");
  modalVideo.src = "";
  commentInput.value = "";
}

closeModal.addEventListener("click", hideModal);

function renderAnime(data) {
  container.innerHTML = "";
  totalResult.textContent = \`Menampilkan \${data.length} anime\`;

  data.forEach(anime => {
    const card = document.createElement("div");
    card.className = "bg-gray-800 p-2 rounded shadow hover:shadow-lg transition cursor-pointer";
    card.innerHTML = \`
      <img src="\${anime.cover}" class="rounded w-full mb-2" />
      <h2 class="text-lg font-semibold">\${anime.title}</h2>
      <p class="text-gray-400 text-sm mb-1">Genre: \${anime.genre}</p>
      <p class="text-gray-300 text-sm">\${anime.description}</p>
    \`;
    card.addEventListener("click", () => showModal(anime));
    container.appendChild(card);
  });
}

// Komentar
function loadComments(title) {
  const comments = JSON.parse(localStorage.getItem("comments_" + title)) || [];
  commentList.innerHTML = "";
  comments.forEach(c => {
    const p = document.createElement("p");
    p.className = "bg-gray-700 p-2 rounded text-sm";
    p.textContent = c;
    commentList.appendChild(p);
  });
}

sendComment.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (text === "") return;
  const key = "comments_" + currentAnimeTitle;
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  comments.push(text);
  localStorage.setItem(key, JSON.stringify(comments));
  loadComments(currentAnimeTitle);
  commentInput.value = "";
});

  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) {
    document.body.classList.add("bg-black", "text-white");
  } else {
    document.body.classList.add("bg-white", "text-black");
  }
\`\`\``;
} else if (lower.includes("game") || lower.includes("mini game") || lower.includes("tebak angka")) {
  return `Berikut contoh web mini game "Tebak Angka" menggunakan HTML, Tailwind CSS, dan JavaScript:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Mini Game - Tebak Angka</title>
  <script defer src="game.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white flex items-center justify-center min-h-screen">
  <div class="bg-gray-800 p-8 rounded shadow-md w-full max-w-md text-center">
    <h1 class="text-2xl font-bold mb-4">🎯 Tebak Angka 1-10</h1>
    <input type="number" id="guess" placeholder="Masukkan angka..." class="w-full p-2 rounded bg-gray-700 mb-4">
    <button onclick="checkGuess()" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold w-full">Tebak!</button>
    <p id="message" class="mt-4 text-lg font-medium"></p>
  </div>
</body>
</html>
\`\`\`\n\n\`\`\`js (game.js)
const secret = Math.floor(Math.random() * 10) + 1;

function checkGuess() {
  const input = document.getElementById("guess").value;
  const message = document.getElementById("message");

  if (!input) {
    message.textContent = "Masukkan angka dulu!";
    return;
  }

  const guess = parseInt(input);
  if (guess === secret) {
    message.textContent = "🎉 Benar! Kamu hebat!";
  } else if (guess > secret) {
    message.textContent = "Terlalu tinggi!";
  } else {
    message.textContent = "Terlalu rendah!";
  }
}
\`\`\``;
} else if (lower.includes("mini game") || lower.includes("game sederhana") || lower.includes("tangkap koin")) {
  return `Berikut contoh web mini game "Tangkap Koin" menggunakan HTML, Tailwind CSS, dan JavaScript:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Game Tangkap Koin</title>
  <script defer src="game.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-4">
  <h1 class="text-3xl font-bold mb-4">🪙 Tangkap Koin!</h1>
  <p class="mb-2">Klik koin secepat mungkin sebelum menghilang!</p>
  <p class="mb-4">Skor: <span id="score" class="font-bold">0</span></p>
  <div id="gameArea" class="relative w-full max-w-md h-96 bg-gray-800 rounded shadow overflow-hidden"></div>
</body>
</html>
\`\`\`\n\n\`\`\`js (game.js)
const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
let score = 0;

function spawnCoin() {
  const coin = document.createElement("div");
  coin.className = "absolute w-10 h-10 bg-yellow-400 rounded-full cursor-pointer shadow-lg animate-ping";
  
  // Posisi acak
  const x = Math.random() * (gameArea.clientWidth - 40);
  const y = Math.random() * (gameArea.clientHeight - 40);
  coin.style.left = \`\${x}px\`;
  coin.style.top = \`\${y}px\`;

  // Event klik
  coin.onclick = () => {
    score++;
    scoreEl.textContent = score;
    coin.remove();
  };

  gameArea.appendChild(coin);

  // Hilang otomatis setelah 1.5 detik
  setTimeout(() => {
    if (gameArea.contains(coin)) coin.remove();
  }, 1500);
}

// Spawn coin tiap 1.2 detik
setInterval(spawnCoin, 1200);
\`\`\``;
} else if (lower.includes("game shooter") || lower.includes("zombie") || lower.includes("tembak") || lower.includes("mini game")) {
  return `Berikut contoh web mini game "Zombie Shooter" menggunakan Tailwind CSS dan JavaScript:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Zombie Shooter</title>
  <script defer src="game.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    .entity { position: absolute; }
    .zombie { background-color: green; border-radius: 50%; width: 40px; height: 40px; }
    .bullet { background-color: yellow; width: 10px; height: 10px; border-radius: 50%; }
    .player { background-color: red; width: 40px; height: 40px; border-radius: 8px; bottom: 10px; }
  </style>
</head>
<body class="bg-black text-white flex flex-col items-center justify-center min-h-screen">
  <h1 class="text-2xl mb-2">🧟 Zombie Shooter</h1>
  <p>Skor: <span id="score">0</span></p>
  <div id="game" class="relative w-[400px] h-[600px] bg-gray-800 overflow-hidden rounded mt-4"></div>
</body>
</html>
\`\`\`\n\n\`\`\`js (game.js)
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
let score = 0;

// Buat player
const player = document.createElement("div");
player.className = "entity player";
player.style.left = "180px";
player.style.position = "absolute";
game.appendChild(player);

// Tembak
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") shoot();
});

function shoot() {
  const bullet = document.createElement("div");
  bullet.className = "entity bullet";
  const playerX = player.offsetLeft + 15;
  bullet.style.left = playerX + "px";
  bullet.style.bottom = "50px";
  game.appendChild(bullet);

  const interval = setInterval(() => {
    const bottom = parseInt(bullet.style.bottom);
    if (bottom > 600) {
      bullet.remove();
      clearInterval(interval);
    } else {
      bullet.style.bottom = bottom + 10 + "px";

      document.querySelectorAll(".zombie").forEach(zombie => {
        if (isColliding(bullet, zombie)) {
          zombie.remove();
          bullet.remove();
          score++;
          scoreEl.textContent = score;
          clearInterval(interval);
        }
      });
    }
  }, 30);
}

// Zombie spawn
setInterval(() => {
  const zombie = document.createElement("div");
  zombie.className = "entity zombie";
  zombie.style.left = Math.floor(Math.random() * 360) + "px";
  zombie.style.top = "0px";
  game.appendChild(zombie);

  const interval = setInterval(() => {
    const top = parseInt(zombie.style.top);
    if (top > 560) {
      alert("Game Over! Skor kamu: " + score);
      window.location.reload();
      clearInterval(interval);
    } else {
      zombie.style.top = top + 5 + "px";
    }
  }, 100);
}, 1000);

function isColliding(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return !(
    ar.top > br.bottom ||
    ar.bottom < br.top ||
    ar.left > br.right ||
    ar.right < br.left
  );
}
\`\`\``;
} else if (lower.includes("memory game") || lower.includes("game kartu") || lower.includes("cocok kartu")) {
  return `Berikut game memory card cocokkan kartu:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Memory Card Game</title>
  <script defer src="game.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    .card {
      @apply w-20 h-20 bg-blue-600 text-white text-2xl font-bold flex items-center justify-center rounded cursor-pointer;
      perspective: 1000px;
    }
    .card.flipped {
      background-color: white;
      color: black;
    }
  </style>
</head>
<body class="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-4">
  <h1 class="text-2xl mb-4 font-bold">🧠 Memory Card Game</h1>
  <p>Skor: <span id="score">0</span> | Percobaan: <span id="tries">0</span></p>
  <div id="game" class="grid grid-cols-4 gap-4 mt-6"></div>
</body>
</html>
\`\`\`\n\n\`\`\`js (game.js)
const cards = ["🍎","🍌","🍇","🍉","🍓","🍍","🍒","🥝"];
let deck = [...cards, ...cards].sort(() => 0.5 - Math.random());
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const triesEl = document.getElementById("tries");

let firstCard = null;
let secondCard = null;
let score = 0;
let tries = 0;

deck.forEach((emoji, index) => {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.emoji = emoji;
  card.dataset.index = index;
  card.textContent = "❓";
  card.onclick = () => flipCard(card);
  game.appendChild(card);
});

function flipCard(card) {
  if (card.classList.contains("flipped") || secondCard) return;
  
  card.textContent = card.dataset.emoji;
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    tries++;
    triesEl.textContent = tries;

    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      score++;
      scoreEl.textContent = score;
      resetCards();
    } else {
      setTimeout(() => {
        firstCard.textContent = "❓";
        firstCard.classList.remove("flipped");
        secondCard.textContent = "❓";
        secondCard.classList.remove("flipped");
        resetCards();
      }, 800);
    }
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
}
\`\`\``;
} else if (lower.includes("catch game") || lower.includes("tangkap objek") || lower.includes("game jatuh")) {
  return `Berikut game tangkap objek jatuh:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Catch the Falling Object</title>
  <style>
    * { box-sizing: border-box; }
    body { background: #111; margin: 0; overflow: hidden; }
    #game {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(to bottom, #222, #000);
    }
    #player {
      position: absolute;
      bottom: 10px;
      left: 50%;
      width: 60px;
      height: 60px;
      background: #38bdf8;
      border-radius: 8px;
      transform: translateX(-50%);
    }
    .object {
      position: absolute;
      top: 0;
      font-size: 30px;
      animation: fall linear;
    }
    @keyframes fall {
      0% { top: -40px; }
      100% { top: 100vh; }
    }
    #scoreDisplay {
      position: absolute;
      top: 10px;
      left: 10px;
      color: white;
      font-size: 20px;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <div id="game">
    <div id="scoreDisplay">Score: 0</div>
    <div id="player"></div>
  </div>
  <script>
    const game = document.getElementById("game");
    const player = document.getElementById("player");
    const scoreDisplay = document.getElementById("scoreDisplay");
    let score = 0;
    let playerX = window.innerWidth / 2 - 30;

    function spawnObject() {
      const obj = document.createElement("div");
      obj.classList.add("object");
      obj.innerText = "💎";
      obj.style.left = Math.random() * (window.innerWidth - 30) + "px";
      obj.style.animationDuration = (2 + Math.random() * 2) + "s";
      game.appendChild(obj);

      const fallInterval = setInterval(() => {
        const objY = obj.getBoundingClientRect().top;
        const objX = obj.getBoundingClientRect().left;
        const playerBox = player.getBoundingClientRect();

        if (objY > window.innerHeight) {
          obj.remove();
          clearInterval(fallInterval);
        } else if (
          objY + 30 >= playerBox.top &&
          objX >= playerBox.left &&
          objX <= playerBox.right
        ) {
          score++;
          scoreDisplay.innerText = "Score: " + score;
          obj.remove();
          clearInterval(fallInterval);
        }
      }, 50);
    }

    setInterval(spawnObject, 1000);

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        playerX -= 40;
      } else if (e.key === "ArrowRight") {
        playerX += 40;
      }
      playerX = Math.max(0, Math.min(playerX, window.innerWidth - 60));
      player.style.left = playerX + "px";
    });
  </script>
</body>
</html>
\`\`\``;
} else if (lower.includes("web ai") || lower.includes("website ai")) {
  return `Berikut contoh web chat AI sederhana versi lebih bagus:\n\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Chat AI Sederhana</title>
  <script>
    const responses = {
      "hai": ["Halo!", "Hai juga!", "Halo, ada yang bisa saya bantu?"],
      "apa kabar": ["Saya baik, kamu?", "Baik! Semoga kamu juga ya!"],
      "siapa kamu": ["Saya AI sederhana buatan kamu!", "Aku asisten virtual kamu 😄"],
      "terima kasih": ["Sama-sama!", "Kapan aja, dengan senang hati!"]
    };

    function getResponse(msg) {
      const key = msg.toLowerCase();
      return responses[key]?.[Math.floor(Math.random() * responses[key].length)] || "Maaf, aku belum ngerti itu 😅";
    }

    function sendMessage() {
      const input = document.getElementById("userInput");
      const chatBox = document.getElementById("chatBox");
      const userMsg = input.value.trim();
      if (!userMsg) return;

      const userBubble = document.createElement("div");
      userBubble.className = "flex justify-end mb-2 animate-fade-in";
      userBubble.innerHTML = \`
        <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-xs shadow-md">
          \${userMsg}
        </div>\`;
      chatBox.appendChild(userBubble);

      const aiReply = getResponse(userMsg);
      const aiBubble = document.createElement("div");
      aiBubble.className = "flex justify-start mb-2 animate-fade-in";
      aiBubble.innerHTML = \`
        <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-xs shadow">
          \${aiReply}
        </div>\`;
      chatBox.appendChild(aiBubble);

      input.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .animate-fade-in {
      animation: fadeIn 0.4s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center">
  <div class="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden bg-white">
    <div class="bg-blue-600 text-white text-center py-4 font-bold text-lg">Chat AI Sederhana</div>
    <div id="chatBox" class="p-4 h-[400px] overflow-y-auto space-y-2 bg-gray-50"></div>
    <div class="flex border-t border-gray-300">
      <input id="userInput" type="text" class="flex-grow p-3 outline-none" placeholder="Tulis pesan...">
      <button onclick="sendMessage()" class="bg-blue-600 text-white px-6 hover:bg-blue-700 transition">Kirim</button>
    </div>
  </div>
</body>
</html>
\`\`\``;
}
 if (currentAI.prompt) {
    return currentAI.default || "Saya siap bantu! Coba ketik sesuatu.";
  }
  
  if (currentAI.responses) {
  const cleaned = lower.replace(/[!?.,;:]/g, ''); // hapus tanda baca
  const words = cleaned.split(/\s+/);
  
  for (const key in currentAI.responses) {
    const isSingleWord = key.trim().split(/\s+/).length === 1;
    
    if (
      (isSingleWord && words.includes(key.toLowerCase())) ||
      (!isSingleWord && cleaned.includes(key.toLowerCase()))
    ) {
      const list = currentAI.responses[key];
      return list[Math.floor(Math.random() * list.length)];
    }
  }
  
  return "Hmm... aku belum ngerti, coba kata lain ya! 😊";
}

return "AI belum dikonfigurasi dengan benar.";
}
const civillixQuotes = [
  "Katanya negara demokrasi, tapi kritik sedikit langsung dibungkam.",
  "Rakyat disuruh hemat, tapi pejabat belanja anggaran kayak diskon akhir tahun.",
  "Kita disuruh sabar, tapi mereka terus nyuruh sambil naik mobil dinas baru.",
  "Pendidikan gratis, tapi kalau mau lulus harus bayar 'biaya tambahan misterius'.",
  "Kesehatan dijanjikan merata, tapi rumah sakit penuh dan obat kosong.",
  "Kalau elite salah: oknum. Kalau rakyat salah: kriminal.",
  "BUMN rugi? Gak masalah. Yang penting rapat dan studi banding tetap jalan.",
  "Kalau protes disebut makar, kalau diam dianggap setuju.",
  "Proyek pembangunan besar, tapi rakyat kecil tetap harus jalan kaki ke puskesmas.",
  "Negara ini cinta rakyat... asal rakyatnya gak banyak nanya."
];

function tampilkanOpiniCivillix() {
  const chatBox = document.getElementById("chat");
  const quote = civillixQuotes[Math.floor(Math.random() * civillixQuotes.length)];
  
  const message = document.createElement("div");
  message.className = "bg-gray-700 text-white p-3 rounded-xl max-w-[80%] self-start shadow";
  message.innerHTML = `<strong>Civillix:</strong> ${quote}`;
  
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Aktifkan auto-opini tiap 10 detik saat Civillix aktif
setInterval(() => {
  const selectedAI = document.getElementById("aiSelector")?.value;
  if (selectedAI === "civillix") {
    tampilkanOpiniCivillix();
  }
}, 60000);
