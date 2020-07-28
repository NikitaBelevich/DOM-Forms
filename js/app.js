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
                    top: ${cellCoordinates.bottom}px;
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
