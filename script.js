const booksBtn = document.getElementById("booksBtn");
const chaptersBtn = document.getElementById("chaptersBtn");
const booksContainer = document.getElementById("booksContainer");
const chaptersContainer = document.getElementById("chaptersContainer");
const textContainer = document.getElementById("textContainer");

const prevChapterBtn = document.getElementById("prevChapter");
const nextChapterBtn = document.getElementById("nextChapter");

const books = [
  { name: "Матфея", file: "data/matthew.json" },
  { name: "Марка", file: "data/mark.json" },
  { name: "Луки", file: "data/luke.json" },
  { name: "Иоанна", file: "data/john.json" }
];

let selectedBook = null;
let bookData = null;

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
    generateChapters();
  } catch {
    textContainer.textContent = "Ошибка загрузки книги.";
  }
}

function generateChapters() {
  chaptersContainer.innerHTML = "";
  const chapterNumbers = Object.keys(bookData);
  chapterNumbers.forEach(num => {
    const div = document.createElement("div");
    div.textContent = num;
    div.addEventListener("click", () => {
      showChapter(num);
      chaptersContainer.classList.add("hidden");
    });
    chaptersContainer.appendChild(div);
  });
}

function showChapter(chapterNum) {
  if (!bookData) return;
  const verses = bookData[chapterNum];
  let html = `<h2>${selectedBook?.name || "Иоанна"}, глава ${chapterNum}</h2>`;
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

prevChapterBtn.addEventListener("click", () => changeChapter(-1));
nextChapterBtn.addEventListener("click", () => changeChapter(1));

function changeChapter(direction) {
  if (!selectedBook || !bookData) return;
  const chapters = Object.keys(bookData).map(n => parseInt(n)).sort((a,b)=>a-b);
  let currentChapter = parseInt(JSON.parse(localStorage.getItem("lastReading"))?.chapter || 1);
  let bookIndex = books.indexOf(selectedBook);

  let chapterIndex = chapters.indexOf(currentChapter) + direction;

  if (chapterIndex < 0) {
    bookIndex = (bookIndex - 1 + books.length) % books.length;
    selectedBook = books[bookIndex];
    loadBook(selectedBook).then(() => {
      const newChapters = Object.keys(bookData).map(n=>parseInt(n)).sort((a,b)=>a-b);
      showChapter(newChapters[newChapters.length-1]);
    });
  } else if (chapterIndex >= chapters.length) {
    bookIndex = (bookIndex + 1) % books.length;
    selectedBook = books[bookIndex];
    loadBook(selectedBook).then(() => {
      const newChapters = Object.keys(bookData).map(n=>parseInt(n)).sort((a,b)=>a-b);
      showChapter(newChapters[0]);
    });
  } else {
    showChapter(chapters[chapterIndex]);
  }
}

function toggle(el) {
  el.classList.toggle("hidden");
}
