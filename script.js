const booksBtn = document.getElementById("booksBtn");
const chaptersBtn = document.getElementById("chaptersBtn");
const booksContainer = document.getElementById("booksContainer");
const chaptersContainer = document.getElementById("chaptersContainer");
const textContainer = document.getElementById("textContainer");

// Пример данных
const books = ["Бытие", "Исход", "Левит", "Числа", "Второзаконие"];
const chapters = {
  "Бытие": 50,
  "Исход": 40,
  "Левит": 27,
  "Числа": 36,
  "Второзаконие": 34
};

// Кнопки вверху
booksBtn.addEventListener("click", () => {
  toggleVisibility(booksContainer);
  chaptersContainer.classList.add("hidden");
});

chaptersBtn.addEventListener("click", () => {
  toggleVisibility(chaptersContainer);
  booksContainer.classList.add("hidden");
});

// Генерация книг
books.forEach(book => {
  const div = document.createElement("div");
  div.textContent = book;
  div.addEventListener("click", () => selectBook(book));
  booksContainer.appendChild(div);
});

function selectBook(book) {
  textContainer.textContent = "";
  chaptersContainer.innerHTML = "";
  booksContainer.classList.add("hidden");
  chaptersBtn.disabled = false;
  generateChapters(book);
  chaptersContainer.classList.remove("hidden");
}

function generateChapters(book) {
  for (let i = 1; i <= chapters[book]; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    div.addEventListener("click", () => selectChapter(book, i));
    chaptersContainer.appendChild(div);
  }
}

function selectChapter(book, chapter) {
  chaptersContainer.classList.add("hidden");
  textContainer.textContent = `Текст ${book}, глава ${chapter}. Здесь будет текст Библии.`;
}

function toggleVisibility(el) {
  el.classList.toggle("hidden");
}
