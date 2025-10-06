const booksBtn = document.getElementById("booksBtn");
const chaptersBtn = document.getElementById("chaptersBtn");
const booksContainer = document.getElementById("booksContainer");
const chaptersContainer = document.getElementById("chaptersContainer");
const textContainer = document.getElementById("textContainer");

const books = [
  { name: "От Матфея", file: "data/matthew.json" },
  { name: "От Марка", file: "data/mark.json" },
  { name: "От Луки", file: "data/luke.json" },
  { name: "От Иоанна", file: "data/john.json" }
];

let selectedBook = null;
let bookData = null;

// Загружаем последнюю книгу и главу
window.addEventListener("DOMContentLoaded", async () => {
  const last = JSON.parse(localStorage.getItem("lastReading"));
  if (last) {
    const book = books.find(b => b.file === last.file) || books[3];
    await selectBook(book, false);
    showChapter(last.chapter);
  } else {
    await selectBook(books[3], false);
    showChapter(1);
  }
});

booksBtn.addEventListener("click", () => {
  toggle(booksContainer);
  chaptersContainer.classList.add("hidden");
});

chaptersBtn.addEventListener("click", () => {
  if (selectedBook) toggle(chaptersContainer);
  booksContainer.classList.add("hidden");
});

// Показ книг
books.forEach(b => {
  const div = document.createElement("div");
  div.textContent = b.name;
  div.addEventListener("click", () => selectBook(b));
  booksContainer.appendChild(div);
});

async function selectBook(book, userClick = true) {
  selectedBook = book;
  chaptersContainer.innerHTML = "";
  await loadBook(book);
  chaptersBtn.disabled = false;

  if (userClick) {
    booksContainer.classList.add("hidden");
    chaptersContainer.classList.remove("hidden");
  }
}

async function loadBook(book) {
  try {
    const res = await fetch(book.file);
    bookData = await res.json();
    generateChapters(book);
  } catch {
    textContainer.textContent = "Ошибка загрузки книги.";
  }
}

function generateChapters(book) {
  chaptersContainer.innerHTML = "";
  const chapterNumbers = Object.keys(bookData);
  chapterNumbers.forEach(num => {
    const div = document.createElement("div");
    div.textContent = num;
    div.addEventListener("click", () => {
      showChapter(num);
      chaptersContainer.classList.add("hidden"); // скрываем главы после выбора
    });
    chaptersContainer.appendChild(div);
  });
}

function showChapter(chapterNum) {
  if (!bookData) return;
  const verses = bookData[chapterNum];
  let html = `<h2>${selectedBook?.name || "От Иоанна"}, глава ${chapterNum}</h2>`;
  verses.forEach(v => {
    html += `<p><strong>${v.num}</strong> ${v.text}</p>`;
  });
  textContainer.innerHTML = html;

  // Сохраняем последнюю книгу и главу
  localStorage.setItem(
    "lastReading",
    JSON.stringify({
      file: selectedBook?.file || "data/john.json",
      name: selectedBook?.name || "От Иоанна",
      chapter: chapterNum
    })
  );
}

function toggle(el) {
  el.classList.toggle("hidden");
}
