'use strict';

// Task 1 ------------------------------------------------
let editArea1 = document.querySelector('.task1 .editArea');
editArea1.addEventListener('click', startEdit);

function startEdit() {
    const newTextarea = document.createElement('textarea');
    newTextarea.classList.add('editTextarea');
    newTextarea.value = editArea1.textContent;
    editArea1.replaceWith(newTextarea);
    newTextarea.focus();

    // Потеря фокуса
    newTextarea.addEventListener('blur', endEdit);
    // Enter
    newTextarea.addEventListener('keydown', function(e) {
        if (e.code == 'Enter') this.blur();
    });

    function endEdit() {
        let textValue = newTextarea.value;
        newTextarea.replaceWith(editArea1);
        editArea1.textContent = textValue;
    }
}


// Task 2. Сделайте ячейки таблицы редактируемыми по клику.

const baguaTable = document.querySelector('#bagua-table');
// Говорим выполниться 1 раз, чтобы только 1 ячейку можно было редактировать за раз
baguaTable.addEventListener('click', editBaguaCell, {once: true});

function editBaguaCell(event) {
    let targetCell = event.target.closest('td');
    if (!targetCell) return;
    const cellCoordinates = targetCell.getBoundingClientRect();
    const styleTargetCell = targetCell.className;
    
    // Создали textarea и вставили вместо ячейки на которую кликнули
    const textareaCell = document.createElement('textarea');
    const initialCellValue = targetCell.innerHTML;
    textareaCell.value = initialCellValue;
    textareaCell.classList.add('textarea-in-cell');
    targetCell.replaceWith(textareaCell);

    // Функция создаёт кнопки управления и их логику
    createControlButtons();
    function createControlButtons() {
        // Создаём кнопки-узлы
        const controllingContainer = document.createElement('div');
        controllingContainer.classList.add('control-buttons');
        const applayButton = document.createElement('button');
        applayButton.textContent = 'OK';
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'CANCEL';
        controllingContainer.append(applayButton, cancelButton);

        // Добавили на страницу и спозиционировали
        document.body.append(controllingContainer);
        controllingContainer.style.cssText = `
                    left: ${cellCoordinates.left}px;
                    top: ${cellCoordinates.bottom + pageYOffset}px;
        `;

        // Логика кнопки ОК
        applayButton.addEventListener('click', () => {
            // Считали значение из textarea и записали в новую ячейку, и добавили изначальные стили
            generateCell(textareaCell.value, styleTargetCell);
            // Снова навешиваем этот обработчик редактирования таблицы
            baguaTable.addEventListener('click', editBaguaCell, {once: true});
        });
        // Логика кнопки Cancel
        cancelButton.addEventListener('click', () => {
            // Считали изначальное значение ячейки, его и записываем в новую ячейку(ничего не поменяли)
            generateCell(initialCellValue, styleTargetCell);
            // Снова навешиваем этот обработчик редактирования таблицы
            baguaTable.addEventListener('click', editBaguaCell, {once: true});
        });

        // Функция создаёт новую ячейку с указанным содержимым и с указанными классами стилей и вставляет её вместо textarea
        function generateCell(textValue, styleClasses) {
            const newCell = document.createElement('td');
            newCell.innerHTML = textValue; // записали содержимое в новую ячейку
            newCell.classList.add(styleClasses); // добавили класс стиля который изначально был
            textareaCell.replaceWith(newCell); // произвели вставку на место textarea
            controllingContainer.remove(); // удалили кнопки редактирования
        }
    }
}

// Task 3. Двигаем мышь
const mouse3 = document.querySelector('#mouse');
mouse3.addEventListener('focus', function(e) {
    const mouseCoordinates = this.getBoundingClientRect();
    const mouseTop = mouseCoordinates.top + pageYOffset;
    // Спозиционировали там, где она изначально стояла
    this.style.cssText = `
                position: absolute;
                left: ${mouseCoordinates.left}px;
                top: ${mouseTop}px;
    `;

    // Логика передвижения мыши
    this.addEventListener('keydown', moovingMouse);
    function moovingMouse(e) {
        e.preventDefault();
        switch (e.code) {
            case 'ArrowUp':
                this.style.top = parseInt(this.style.top) - 8 + 'px';
                break;

            case 'ArrowDown':
                this.style.top = parseInt(this.style.top) + 8 + 'px';
                break;
            case 'ArrowLeft':
                this.style.left = parseInt(this.style.left) - 8 + 'px';
                break;
            case 'ArrowRight':
                this.style.left = parseInt(this.style.left) + 8 + 'px';
                break;

            default:
                break;
        }
    }

    this.onblur = () => {
        this.removeEventListener('keydown', moovingMouse);
    };
});


// Task 4. Депозитный калькулятор
const calculatorForm = document.querySelector('.deposit-calculator');
const beforeOut = calculatorForm.querySelector('.calculator-out .before span');
const afterOut = calculatorForm.querySelector('.calculator-out .after span');
const depositField = calculatorForm.elements['deposit-field'];
const timeOfDepositSelect = calculatorForm.elements['time-of-deposit'];
const interestRateField = calculatorForm.elements['interest-rate'];
depositField.addEventListener('input', calcDeposit);
interestRateField.addEventListener('input', calcDeposit);
timeOfDepositSelect.addEventListener('change', calcDeposit);

function calcDeposit() {
    const deposit = +depositField.value;
    const timeOfDeposit = +timeOfDepositSelect.value;
    const interestRate = +interestRateField.value;

    const result = Math.round(deposit * (1 + (interestRate / 100) * (timeOfDeposit / 12)));

    beforeOut.textContent = ' ' + deposit;
    afterOut.textContent = ' ' + result;
}


const task5 = document.querySelector('.task5');
const callAPopup = task5.querySelector('.call-popup');

callAPopup.addEventListener('click', () => {
    showPrompt('Введите что-нибудь<br>...умное :)', (value) => {alert(`Вы ввели: ${value}`)});
});

function showPrompt(htmlTitle, callback) {
    showOverlay(); // Показали оверлей
    const modalWindow = document.querySelector('.modal-container');
    const modalForm = modalWindow.querySelector('form');
    const formTitle = modalForm.querySelector('.form-title');
    formTitle.innerHTML = htmlTitle; // Записали в заголовок переданную надпись
    modalWindow.classList.toggle('hide-modal'); // Показали модалку
    // Обработка кнопок
    const modalInp = modalForm.querySelector('input[name="modal-input"]');
    modalInp.focus();
    modalForm.onsubmit = (e) => {
        closeModal();
        let value = modalInp.value.trim();
        if (!value) { 
            // Если значение пустое, тогда отменяем submit, выдаём ошибку
            console.error('Value is empty');
            e.preventDefault();
            return false;
        };
        callback(value); // Отправили данные
    };
    // Кнопка отмена
    const cancelButton = modalForm.querySelector('.form-buttons button:last-child');
    cancelButton.onclick = (e) => {
        e.preventDefault(); // Отменяем submit
        cancelInput();
    };
    // Клавиши
    document.onkeydown = (e) => {
        if (e.code == 'Escape') {
            cancelInput();
        }
    };
    cancelButton.onkeydown = (e) => {
        if (e.code == 'Tab') {
            e.preventDefault();
            modalInp.focus();
        }
    };



    // Функция отмены отправки формы, выдаёт null как результат и закрывает модальное окно
    function cancelInput() {
        callback(null); // Выводим null
        closeModal(); // Всё закрываем
        document.onkeydown = null;
        cancelButton.onkeydown = null;
    }
}

// Функция создаёт оверлей при активном модальном окне
function showOverlay() {
    const cover = document.createElement('div');
    cover.classList.add('modal-overlay');
    document.body.append(cover); // включили оверлей
    document.body.style.overflowY = 'hidden'; // скрыли прокрутку
}
// Функция удаляет оверлей и скрывает модальное окно
function closeModal() {
    const cover = document.querySelector('.modal-overlay');
    if (!cover) return;
    cover.remove(); // Удалили оверлей
    document.body.style.overflowY = ''; // Вернули прокрутку
    const modalWindow = document.querySelector('.modal-container');
    modalWindow.classList.toggle('hide-modal'); // Скрыли модалку
}
