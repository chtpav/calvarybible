// получаем кнопки и контейнеры из html
const booksBtn = document.getElementById("booksBtn"); // кнопка книги
const chaptersBtn = document.getElementById("chaptersBtn"); // кнопка главы
const booksContainer = document.getElementById("booksContainer"); // блок с книгами
const chaptersContainer = document.getElementById("chaptersContainer"); // блок с главами
const textContainer = document.getElementById("textContainer"); // блок с текстом
const prevChapter = document.getElementById("prevChapter"); // стрелка назад
const nextChapter = document.getElementById("nextChapter"); // стрелка вперед

// список книг с названием и файлом
const books = [
  { name: "Матфея", file: "data/matthew.json" },
  { name: "Марка", file: "data/mark.json" },
  { name: "Луки", file: "data/luke.json" },
  { name: "Иоанна", file: "data/john.json" }
];

let selectedBook = null; // выбранная книга
let bookData = null; // данные книги
let currentChapter = 1; // текущая глава

// при загрузке страницы показываем последнюю прочитанную книгу
window.addEventListener("DOMContentLoaded", async () => {
  const last = JSON.parse(localStorage.getItem("lastReading")); // получаем из localStorage
  if (last) { 
    const book = books.find(b => b.file === last.file) || books[3]; // ищем книгу
    await selectBook(book, false); // загружаем книгу без клика пользователя
    if (bookData[last.chapter]) showChapter(last.chapter); // показываем нужную главу
    else showChapter(1); // если нет такой главы, показываем первую
  } else {
    await selectBook(books[3], false); // если ничего нет, показываем иоанна
    showChapter(1); // первая глава
  }
});

// клик по кнопке книги
booksBtn.addEventListener("click", () => {
  toggle(booksContainer); // показать/скрыть список книг
  chaptersContainer.classList.add("hidden"); // скрыть список глав
});

// клик по кнопке главы
chaptersBtn.addEventListener("click", () => {
  if (selectedBook) toggle(chaptersContainer); // показать/скрыть главы
  booksContainer.classList.add("hidden"); // скрыть книги
});

// создаем список книг
books.forEach(b => {
  const div = document.createElement("div"); // создаем блок для книги
  div.textContent = b.name; // вставляем название
  div.addEventListener("click", () => selectBook(b)); // клик по книге
  booksContainer.appendChild(div); // добавляем в контейнер
});

// функция выбора книги
async function selectBook(book, userClick = true) {
  selectedBook = book; // сохраняем выбранную книгу
  chaptersContainer.innerHTML = ""; // очищаем список глав
  const loaded = await loadBook(book); // загружаем книгу
  if (!loaded) return;

  chaptersBtn.disabled = false; // разблокируем кнопку глав
  if (userClick) { 
    booksContainer.classList.add("hidden"); // скрываем книги
    chaptersContainer.classList.remove("hidden"); // показываем главы
  }
}

// функция загрузки книги
async function loadBook(book) {
  try {
    const res = await fetch(book.file); // загружаем файл
    bookData = await res.json(); // превращаем в объект
    generateChapters(); // создаем блоки глав
    console.log(`Книга "${book.name}" загружена успешно.`); // сообщение в консоль
    return true;
  } catch (e) {
    console.error("Ошибка загрузки книги:", e); // ошибка
    textContainer.textContent = "Ошибка загрузки книги."; // сообщение пользователю
    return false;
  }
}

// функция создания глав
function generateChapters() {
  chaptersContainer.innerHTML = ""; // очищаем контейнер
  const chapterNumbers = Object.keys(bookData); // получаем номера глав
  chapterNumbers.forEach(num => {
    const div = document.createElement("div"); // создаем блок для главы
    div.textContent = num; // вставляем номер
    div.addEventListener("click", () => { // клик по главе
      showChapter(parseInt(num)); // показываем выбранную главу
      chaptersContainer.classList.add("hidden"); // скрываем главы
    });
    chaptersContainer.appendChild(div); // добавляем в контейнер
  });
}

// функция показа главы
function showChapter(chapterNum) {
  if (!selectedBook || !bookData || !bookData[chapterNum]) return; // если нет данных, выходим

  currentChapter = chapterNum; // сохраняем текущую главу
  const verses = bookData[chapterNum]; // получаем стихи
  let html = `<h2>${selectedBook.name}, ${chapterNum}</h2>`; // заголовок
  verses.forEach(v => {
    html += `<p><strong>${v.num}</strong> ${v.text}</p>`; // стихи
  });
  textContainer.innerHTML = html; // вставляем в html

  // сохраняем последнюю прочитанную главу
  localStorage.setItem(
    "lastReading",
    JSON.stringify({
      file: selectedBook.file,
      name: selectedBook.name,
      chapter: chapterNum
    })
  );
}

// кнопки листания
prevChapter.addEventListener("click", () => changeChapter(-1)); // предыдущая глава
nextChapter.addEventListener("click", () => changeChapter(1)); // следующая глава

// функция смены главы
async function changeChapter(dir) {
  if (!selectedBook || !bookData) return; // если нет книги, выходим
  let chapters = Object.keys(bookData).map(n => parseInt(n)).sort((a,b)=>a-b); // список глав
  let idx = chapters.indexOf(currentChapter) + dir; // индекс следующей главы
  let bookIndex = books.findIndex(b => b.file === selectedBook.file); // индекс книги

  if (idx < 0) { // если листаем назад
    bookIndex = (bookIndex - 1 + books.length) % books.length; // предыдущая книга
    await selectBook(books[bookIndex], false); // загружаем книгу
    chapters = Object.keys(bookData).map(n=>parseInt(n)).sort((a,b)=>a-b); // обновляем главы
    showChapter(chapters[chapters.length-1]); // последняя глава
  } else if (idx >= chapters.length) { // если листаем вперед
    bookIndex = (bookIndex + 1) % books.length; // следующая книга
    await selectBook(books[bookIndex], false); // загружаем книгу
    chapters = Object.keys(bookData).map(n=>parseInt(n)).sort((a,b)=>a-b); // обновляем главы
    showChapter(chapters[0]); // первая глава
  } else { 
    showChapter(chapters[idx]); // обычная смена главы
  }
}

// функция показать/скрыть элемент
function toggle(el) {
  el.classList.toggle("hidden"); // меняем видимость
}