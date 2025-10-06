const booksBtn = document.getElementById("booksBtn");
const chaptersBtn = document.getElementById("chaptersBtn");
const booksContainer = document.getElementById("booksContainer");
const chaptersContainer = document.getElementById("chaptersContainer");
const textContainer = document.getElementById("textContainer");

const prevChapter = document.getElementById("prevChapter");
const nextChapter = document.getElementById("nextChapter");

const books = [
  { name: "Матфея", file: "data/matthew.json" },
  { name: "Марка", file: "data/mark.json" },
  { name: "Луки", file: "data/luke.json" },
  { name: "Иоанна", file: "data/john.json" }
];

let selectedBook = null;
let bookData = null;
let currentChapter = 1;

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
      showChapter(parseInt(num));
      chaptersContainer.classList.add("hidden");
    });
    chaptersContainer.appendChild(div);
  });
}

function showChapter(chapterNum) {
  if (!bookData) return;
  currentChapter = chapterNum;
  const verses = bookData[chapterNum];
  let html = `<h2>${selectedBook?.name || "Иоанна"}, ${chapterNum}</h2>`;
  verses.forEach(v => {
    html += `<p><strong>${v.num}</strong> ${v.text}</p>`;
  });
  textContainer.innerHTML = html;

  localStorage.setItem(
    "lastReading",
    JSON.stringify({
      file: selectedBook?.file || "data/john.json",
      name: selectedBook?.name || "Иоанна",
      chapter: chapterNum
    })
  );
}

// Листание глав
prevChapter.addEventListener("click", () => changeChapter(-1));
nextChapter.addEventListener("click", () => changeChapter(1));

async function changeChapter(dir) {
  if (!selectedBook || !bookData) return;

  // Получаем все главы текущей книги
  let chapters = Object.keys(bookData).map(n => parseInt(n)).sort((a,b)=>a-b);
  let idx = chapters.indexOf(currentChapter);
  idx += dir;

  let bookIndex = books.findIndex(b => b.file === selectedBook.file);

  // Переключение между книгами
  if (idx < 0) {
    bookIndex = (bookIndex - 1 + books.length) % books.length;
    await selectBook(books[bookIndex], false);
    chapters = Object.keys(bookData).map(n=>parseInt(n)).sort((a,b)=>a-b);
    showChapter(chapters[chapters.length-1]);
  } else if (idx >= chapters.length) {
    bookIndex = (bookIndex + 1) % books.length;
    await selectBook(books[bookIndex], false);
    chapters = Object.keys(bookData).map(n=>parseInt(n)).sort((a,b)=>a-b);
    showChapter(chapters[0]);
  } else {
    showChapter(chapters[idx]);
  }
}

function toggle(el) {
  el.classList.toggle("hidden");
}
