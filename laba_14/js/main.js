const html2pdf = window.html2pdf;

// Функция для сохранения данных в localStorage
function saveToLocalStorage() {
  const resumeData = {
    name: document.querySelector('#resume h1')?.innerHTML || '',
    title: document.querySelector('#resume h2')?.innerHTML || '',
    email: document.querySelector('#resume p:nth-of-type(1)')?.innerHTML || '',
    phone: document.querySelector('#resume p:nth-of-type(2)')?.innerHTML || '',
    skills: document.querySelector('#resume p:nth-of-type(3)')?.innerHTML || ''
  };
  localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

// Функция для загрузки данных из localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    const resumeData = JSON.parse(savedData);
    
    const h1 = document.querySelector('#resume h1');
    const h2 = document.querySelector('#resume h2');
    const paragraphs = document.querySelectorAll('#resume p');
    
    if (h1 && resumeData.name) h1.innerHTML = resumeData.name;
    if (h2 && resumeData.title) h2.innerHTML = resumeData.title;
    if (paragraphs[0] && resumeData.email) paragraphs[0].innerHTML = resumeData.email;
    if (paragraphs[1] && resumeData.phone) paragraphs[1].innerHTML = resumeData.phone;
    if (paragraphs[2] && resumeData.skills) paragraphs[2].innerHTML = resumeData.skills;
  }
}

// Функция для отслеживания изменений в редактируемых полях
function listenToEditableChanges() {
  const editableElements = document.querySelectorAll('.editable');
  editableElements.forEach(element => {
    element.addEventListener('blur', () => {
      saveToLocalStorage();
    });
    
    // Сохраняем при каждом вводе (опционально)
    element.addEventListener('input', () => {
      saveToLocalStorage();
    });
  });
}

// Отрисовка HTML
document.querySelector('#app').innerHTML = `
  <div id="resume" class="resume-container">
    <h1 class="editable" contenteditable="true">Иван Иванов</h1>
    <h2 class="editable" contenteditable="true">Frontend Developer</h2>
    <p class="editable" contenteditable="true">Email: ivan@example.com</p>
    <p class="editable" contenteditable="true">Телефон: +7 900 123 45 67</p>
    <p class="editable" contenteditable="true">Django, React, Python, JavaScript</p>
    <button id="downloadBtn">Скачать PDF</button>
  </div>
`;

const resumeEl = document.getElementById('resume');
const downloadBtn = document.getElementById('downloadBtn');

// Функция ripple-эффекта
function createRipple(e) {
  const circle = document.createElement('span');
  circle.classList.add('ripple-effect');
  const rect = downloadBtn.getBoundingClientRect();
  circle.style.left = `${e.clientX - rect.left}px`;
  circle.style.top = `${e.clientY - rect.top}px`;
  downloadBtn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

// Загружаем сохраненные данные после отрисовки
loadFromLocalStorage();

// Начинаем отслеживать изменения
listenToEditableChanges();

// Кнопка скачивания PDF
downloadBtn.addEventListener('click', (e) => {
  if (document.activeElement) document.activeElement.blur();

  createRipple(e);
  downloadBtn.style.display = 'none';

  setTimeout(() => {
    html2pdf().set({
      margin:       0.5,
      filename:     'resume.pdf',
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(resumeEl).save().finally(() => {
      downloadBtn.style.display = '';
    });
  }, 200);
});