const booksBtn = document.getElementById("booksBtn");
const chaptersBtn = document.getElementById("chaptersBtn");
const booksContainer = document.getElementById("booksContainer");
const chaptersContainer = document.getElementById("chaptersContainer");
const textContainer = document.getElementById("textContainer");

// Новый Завет
const books = [
  { name: "От Матфея", file: "data/matthew.json", chapters: 28 },
  { name: "От Марка", file: "data/mark.json", chapters: 16 },
  { name: "От Луки", file: "data/luke.json", chapters: 24 },
  { name: "От Иоанна", file: "data/john.json", chapters: 21 },
  { name: "Деяния Апостолов", file: "data/acts.json", chapters: 28 }
];

let selectedBook = null;
let bookData = null;

// События кнопок
booksBtn.addEventListener("click", () => {
  toggleVisibility(booksContainer);
  chaptersContainer.classList.add("hidden");
  textContainer.textContent = "";
});

chaptersBtn.addEventListener("click", () => {
  if (selectedBook) toggleVisibility(chaptersContainer);
  booksContainer.classList.add("hidden");
});

// Показ книг
books.forEach(b => {
  const div = document.createElement("div");
  div.textContent = b.name;
  div.addEventListener("click", () => selectBook(b));
  booksContainer.appendChild(div);
});

function selectBook(book) {
  selectedBook = book;
  chaptersContainer.innerHTML = "";
  booksContainer.classList.add("hidden");
  chaptersBtn.disabled = false;
  loadBook(book);
}

async function loadBook(book) {
  try {
    const res = await fetch(book.file);
    bookData = await res.json();
    generateChapters(book);
  } catch {
    textContainer.textContent = "Ошибка загрузки текста.";
  }
}

function generateChapters(book) {
  for (let i = 1; i <= book.chapters; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    div.addEventListener("click", () => selectChapter(i));
    chaptersContainer.appendChild(div);
  }
  chaptersContainer.classList.remove("hidden");
}

function selectChapter(chapter) {
  const text = bookData?.[chapter] || "Глава в процессе добавления.";
  chaptersContainer.classList.add("hidden");
  textContainer.innerHTML = `<h2>${selectedBook.name}, глава ${chapter}</h2><p>${text}</p>`;
}

function toggleVisibility(el) {
  el.classList.toggle("hidden");
}
