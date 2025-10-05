// ======== Настройки ==========
const books = [
  { name: "Мат", file: "matthew.json" },
  { name: "Мар", file: "mark.json" },
  { name: "Лук", file: "luke.json" },
  { name: "Ин", file: "john.json" },
  { name: "Деян", file: "acts.json" },
  { name: "Рим", file: "romans.json" },
  { name: "1Кор", file: "1corinthians.json" },
  { name: "2Кор", file: "2corinthians.json" },
  { name: "Гал", file: "galatians.json" },
  { name: "Еф", file: "ephesians.json" },
  { name: "Флп", file: "philippians.json" },
  { name: "Кол", file: "colossians.json" },
  { name: "1Фес", file: "1thessalonians.json" },
  { name: "2Фес", file: "2thessalonians.json" },
  { name: "1Тим", file: "1timothy.json" },
  { name: "2Тим", file: "2timothy.json" },
  { name: "Тит", file: "titus.json" },
  { name: "Флм", file: "philemon.json" },
  { name: "Евр", file: "hebrews.json" },
  { name: "Иак", file: "james.json" },
  { name: "1Пет", file: "1peter.json" },
  { name: "2Пет", file: "2peter.json" },
  { name: "1Ин", file: "1john.json" },
  { name: "2Ин", file: "2john.json" },
  { name: "3Ин", file: "3john.json" },
  { name: "Иуд", file: "jude.json" },
  { name: "Откр", file: "revelation.json" }
];

// ======== Элементы ==========
const toggleBooksBtn = document.getElementById("toggleBooksBtn");
const toggleChaptersBtn = document.getElementById("toggleChaptersBtn");
const booksSection = document.getElementById("booksSection");
const chaptersWrapper = document.getElementById("chaptersWrapper");
const chaptersGrid = document.getElementById("chaptersGrid");
const bookGrid = document.getElementById("bookGrid");
const currentBook = document.getElementById("currentBook");
const currentChapterLabel = document.getElementById("currentChapterLabel");
const content = document.getElementById("content");

let currentData = null;
let selectedBook = null;

// ======== Функции ==========
function createBookTiles() {
  books.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.className = "book-tile";
    btn.textContent = b.name;
    btn.onclick = () => loadBook(b, btn);
    bookGrid.appendChild(btn);
  });
}

// Открыть/закрыть список книг
toggleBooksBtn.onclick = () => {
  booksSection.classList.toggle("hidden");
  toggleBooksBtn.textContent = booksSection.classList.contains("hidden")
    ? "Выбрать книгу"
    : "Скрыть книги";
};

// Открыть/закрыть список глав
toggleChaptersBtn.onclick = () => {
  chaptersGrid.classList.toggle("hidden");
  toggleChaptersBtn.textContent = chaptersGrid.classList.contains("hidden")
    ? "Выбрать главу"
    : "Скрыть главы";
};

async function loadBook(book, tile) {
  // Выделение активной книги
  document.querySelectorAll(".book-tile").forEach(b => b.classList.remove("active"));
  tile.classList.add("active");
  selectedBook = book;
  currentBook.textContent = book.name;
  currentChapterLabel.textContent = "Глава —";
  content.innerHTML = "<p>Загрузка...</p>";

  // Загрузка JSON
  try {
    const res = await fetch(book.file);
    if (!res.ok) throw new Error("Не найден файл " + book.file);
    currentData = await res.json();
    renderChapters(currentData.chapters);
    chaptersWrapper.classList.remove("hidden");
  } catch (e) {
    content.innerHTML = `<p style="color:red">${e.message}</p>`;
  }
}

function renderChapters(chapters) {
  chaptersGrid.innerHTML = "";
  chapters.forEach(ch => {
    const c = document.createElement("button");
    c.className = "chapter-tile";
    c.textContent = ch.number;
    c.onclick = () => showChapter(ch.number, c);
    chaptersGrid.appendChild(c);
  });
}

function showChapter(num, tile) {
  document.querySelectorAll(".chapter-tile").forEach(c => c.classList.remove("active"));
  tile.classList.add("active");
  const ch = currentData.chapters.find(c => c.number == num);
  if (!ch) return;
  currentChapterLabel.textContent = "Глава " + ch.number;
  content.innerHTML = `
    <h2 class="chapter-title">${selectedBook.name} — Глава ${ch.number}</h2>
    ${ch.verses.map(v => `<p class="verse"><sup class="verse-num">${v.num}</sup>${v.text}</p>`).join("")}
  `;
  content.scrollIntoView({ behavior: "smooth" });
}

// ======== Инициализация ==========
createBookTiles();
