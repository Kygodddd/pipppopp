// Elemen penting
const image = document.getElementById("image");
const highScoreDisplay = document.getElementById("high-score");
const clickCountDisplay = document.getElementById("click-count");
const coinCountDisplay = document.getElementById("coin-count");
const gachaBtn = document.getElementById("gacha-btn");
const gachaResult = document.createElement("div");
const gachaWinSound = new Audio("./sound/win-gacha.mp3");
gachaResult.id = "gacha-result";
image.insertAdjacentElement("afterend", gachaResult);

// Suara default
const openMouthSound = new Audio("./sound/buka.mp3");
const closeMouthSound = new Audio("./sound/tutup.mp3");

// Suara per karakter
const characterSounds = {
  anjing: new Audio(
    "./sound/alpha-minecraft-hit-take-damage-sound-effect_LK9gRQHB.mp3"
  ),
  hamster: new Audio("./sound/bubble-pop-sound-effect-free_IANynS0Y.mp3"),
  kucing: new Audio("./sound/button-click-sound-effect_8zAxyKgU.mp3"),
  lebah: new Audio("./sound/kururin-notification_22s4jjuM.mp3"),
  marmut: new Audio(
    "./sound/roblox-death-sound-oof-sound-effect-hd-homemadesoundeffects_U5YKOutg.mp3"
  ),
  pucing: new Audio("./sound/taco-bell-bong-sound-effect_q1IWE3Hk.mp3"),
  rucing: new Audio("./sound/vine-boom-sound-effect_DNSoAR0I.mp3"),
  tucing: new Audio("./sound/yoshi-sound-ba-dum-mlem_n7nTRxGI.mp3"),
  urang: new Audio("./sound/button-click-sound-effect_8zAxyKgU.mp3"),
};

// Variabel utama
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let selectedCharacter = localStorage.getItem("selectedCharacter") || "kucing";
let unlockedCharacters = JSON.parse(
  localStorage.getItem("unlockedCharacters")
) || ["kucing"];

// Update UI awal
highScoreDisplay.textContent = highScore;
coinCountDisplay.textContent = coins;

function getImagePath(state) {
  return `./image/${selectedCharacter}_${state}.png`;
}

function updateCharacterImage(state) {
  image.src = getImagePath(state);
}

function openMouth() {
  updateCharacterImage("buka");

  // Mainkan suara karakter jika ada
  if (characterSounds[selectedCharacter]) {
    characterSounds[selectedCharacter].currentTime = 0;
    characterSounds[selectedCharacter].play();
  } else {
    openMouthSound.currentTime = 0;
    openMouthSound.play();
  }
}

function closeMouth() {
  updateCharacterImage("tutup");
  closeMouthSound.currentTime = 0;
  closeMouthSound.play();
}

function updateScore() {
  score++;
  clickCountDisplay.textContent = score;

  if (score % 10 === 0) {
    coins++;
    localStorage.setItem("coins", coins);
    coinCountDisplay.textContent = coins;
  }

  clickCountDisplay.classList.add("shake");
  setTimeout(() => clickCountDisplay.classList.remove("shake"), 400);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

image.addEventListener("mousedown", () => {
  openMouth();
  updateScore();
});
image.addEventListener("mouseup", () => closeMouth());
image.addEventListener("touchstart", (e) => {
  e.preventDefault();
  openMouth();
  updateScore();
});
image.addEventListener("touchend", (e) => {
  e.preventDefault();
  closeMouth();
});

// Ganti karakter saat "Equip" diklik
function updateCharacterButtons() {
  document.querySelectorAll(".character").forEach((el) => {
    const img = el.querySelector("img");
    const name = img.src.split("/").pop().split("_")[0];
    const button = el.querySelector("button");

    if (unlockedCharacters.includes(name)) {
      button.disabled = false;
      el.classList.remove("locked");
      img.style.filter = "none";
      button.textContent = "Equip";
    } else {
      button.disabled = true;
      el.classList.add("locked");
      img.style.filter = "grayscale(100%) brightness(0.5)";
      button.textContent = "Terkunci";
    }
  });
}
updateCharacterButtons();

// Equip karakter
document.querySelectorAll(".character button").forEach((button) => {
  button.addEventListener("click", () => {
    const karakterImg = button.parentElement.querySelector("img");
    const karakterNama = karakterImg.src.split("/").pop().split("_")[0];

    if (!unlockedCharacters.includes(karakterNama)) return;

    selectedCharacter = karakterNama;
    localStorage.setItem("selectedCharacter", selectedCharacter);
    updateCharacterImage("tutup");
  });
});

// Semua karakter
const allCharacters = [
  "anjing",
  "hamster",
  "kucing",
  "lebah",
  "marmut",
  "pucing",
  "rucing",
  "tucing",
  "urang",
];

// Gacha
gachaBtn.addEventListener("click", () => {
  if (coins < 10) {
    alert("Koin tidak cukup untuk gacha!");
    return;
  }

  coins -= 10;
  localStorage.setItem("coins", coins);
  coinCountDisplay.textContent = coins;

  const randomIndex = Math.floor(Math.random() * allCharacters.length);
  const newChar = allCharacters[randomIndex];
  const newImg = `./image/${newChar}_tutup.png`;

  if (!unlockedCharacters.includes(newChar)) {
    unlockedCharacters.push(newChar);
    localStorage.setItem(
      "unlockedCharacters",
      JSON.stringify(unlockedCharacters)
    );
    updateCharacterButtons();
  }

  // 🔊 Mainkan suara gacha berhasil
  gachaWinSound.currentTime = 0;
  gachaWinSound.play();

  // 🎉 Tampilkan SweetAlert
  Swal.fire({
    title: "Kamu mendapatkan karakter baru!",
    text: newChar.charAt(0).toUpperCase() + newChar.slice(1),
    imageUrl: newImg,
    imageWidth: 100,
    imageHeight: 100,
    confirmButtonText: "OK",
  });
});

// Toggle karakter list
const toggleButton = document.getElementById("toggleButton");
const characterList = document.getElementById("characterList");
toggleButton.addEventListener("click", () => {
  const isHidden =
    characterList.style.display === "none" ||
    characterList.style.display === "";
  characterList.style.display = isHidden ? "grid" : "none";
  toggleButton.textContent = isHidden
    ? "Sembunyikan Karakter"
    : "Tampilkan Karakter";
});

// Saat load halaman
window.addEventListener("load", () => {
  coins = parseInt(localStorage.getItem("coins")) || 0;
  coinCountDisplay.textContent = coins;
  updateCharacterImage("tutup");
  updateCharacterButtons();
});
