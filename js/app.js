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
