const checkBoxAccept = document.querySelector('#candidate-true');
const confirmBtn = document.querySelector('.feedback-form__btn');
const myForm = document.querySelector('.feedback-form');
const validate = new JustValidate('#feedback-form', {
    errorLabelStyle: {},
    errorLabelCssClass: 'custom-input__error',

});
let allInputs = document.querySelectorAll('.custom-input__field');
const vacanciesNames = document.querySelectorAll('.vacancies__list-vacancy');
let currentEditIndex = -1;


checkBoxAccept.addEventListener('click', function (e) {
    let isChecked = e.target.checked;
    if (isChecked) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
});

setupValidation()


function setupValidation() {
    allInputs.forEach(input => {
        //Задаем array правил
        const rules = [];

        //Общие правила
        rules.push(
            {
                rule: 'required',
                errorMessage: `Заполните поле "${input.parentElement.querySelector('.custom-input__label').textContent}"`,

            },
        )
        
        if (input.type === 'email') {
            rules.push({
                rule: 'email',
                errorMessage: `Введите корректный e-mail`,
            });
        }
        if (input.type === 'tel') {
            rules.push({
                rule: 'customRegexp',
                value: /^\+[\d\s\-()]{7,20}$/,
                errorMessage: `Введите номер в международном формате, например +7 999 123-45-67`,

            });
        }
        if (rules.length > 0) {
            validate.addField(input, rules);
        }
    });

    validate.onValidate((result) => {
        Object.values(result.fields).forEach(field => {
            if (!field.elem) return;

            const parent = field.elem.parentElement;
            const existingError = parent.querySelector('.custom-input__error');

            if (field.touched) {
                if (field.isValid) {
                    parent.classList.remove('custom-input--error');
                    if (existingError) existingError.remove();
                } else {
                    parent.classList.add('custom-input--error');

                    if (!existingError) {
                        const errorDiv = document.createElement('div');
                        errorDiv.classList.add('custom-input__error');
                        errorDiv.textContent = field.errorMessage;
                        parent.appendChild(errorDiv);
                    } else {
                        existingError.textContent = field.errorMessage;
                    }
                }
            }
        });
    });
    validate.onFail(() => {
        const errorFields = document.querySelectorAll('.just-validate-error-field');
        errorFields.forEach(field => {
            field.parentElement.classList.add('custom-input--error');
            console.log('Ошибка в поле:', field.name);
        });
    });

    validate.onSuccess((e) => {
        e.preventDefault();
        addToOrEditLocalLibrary();
        resetForm();
    });

}


function addToOrEditLocalLibrary() {
    const employees = getLocStorList();
    const formData = new FormData(myForm);
    const emplObj = {};
    formData.forEach((value, key) => {
        emplObj[key] = value;
    });
    if (currentEditIndex !== -1) {
        employees[currentEditIndex] = emplObj;
    } else {
        employees.push(emplObj);
    }
    localStorage.setItem('employees', JSON.stringify(employees))
    renderTable(employees)

}


function getLocStorList() {
    let data = JSON.parse(localStorage.getItem('employees')) || [];
    return data;
}

function renderTable(employees) {
    const myTableBody = document.querySelector('#candidate-tbody');
    myTableBody.innerHTML = '';
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-index', index);
        row.innerHTML = `
            <td>${index + 1}</td>         
            <td>${employee['candidate-secname']}</td>
            <td>${employee['candidate-name']}</td>
            <td>${employee['candidate-position']}</td>
            <td>${employee['candidate-phone']}</td>
            <td>${employee['candidate-email']}</td>
            <td>${employee['candidate-cv']}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn--small btn--delete">Удалить</button>
                    <button class="btn btn--small btn--edit">Редактировать</button>
                    <a href="mailto:${employee['candidate-email']}" class="btn btn--small btn--send">E-mail</a>
                </div>
            </td>
            `
        Array.from(row.querySelectorAll('td')).forEach(td => {
            td.classList.add('output__table-cell');
        });
        myTableBody.appendChild(row);

    });
    bindActionButtons();
}


function bindActionButtons() {
    document.querySelectorAll('.btn--delete').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', function (e) {
            const closestTr = e.target.closest('tr');
            deleteRow(closestTr)
        });
    });
    document.querySelectorAll('.btn--edit').forEach(editBtn => {
        editBtn.addEventListener('click', function (e) {
            const closestTr = e.target.closest('tr');
            editRow(closestTr);
        });
    });
    
}


function deleteRow(closestTr) {
    const indexRow = +closestTr.dataset.index;
    const employees = getLocStorList();
    if (indexRow >= 0 && indexRow < employees.length) {
        employees.splice(indexRow, 1);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderTable(employees);
    }
}

function editRow(closestTr) {
    const employees = getLocStorList();
    confirmBtn.textContent = "Редактировать";
    confirmBtn.disabled = false;
    const indexRow = +closestTr.dataset.index;
    document.querySelector('.custom-checkbox').classList.add('visually-hidden');
    if (indexRow >= 0 && indexRow < employees.length) {
        currentEditIndex = indexRow;
        const employee = employees[indexRow];
        allInputs[0].focus();
        allInputs.forEach(input => {
            if (employee.hasOwnProperty(input.name)) {
                input.value = employee[input.name];
            }
        });

    }
}

vacanciesNames.forEach(vacancy => {
    vacancy.addEventListener('click', function (e) {
        const posField = document.querySelector('#candidate-position');
        posField.value = vacancy.textContent;
        allInputs[4].focus();
    });
});


const sortBtns = document.querySelectorAll('.output__table-header-cell-sort-up, .output__table-header-cell-sort-down');
sortBtns.forEach(sortBtn => {
    sortBtn.addEventListener('click', function (e) {
        const sortedItems = sortItems(e);
        renderTable(sortedItems);

    });
});

function sortItems(e) {
    const employees = getLocStorList();
    const fieldKey = e.target.closest('th')?.dataset.field;
    if (e.target.classList.contains('output__table-header-cell-sort-up')) {
        return [...employees].sort((a, b) => a[fieldKey].localeCompare(b[fieldKey]));
    } else if (e.target.classList.contains('output__table-header-cell-sort-down')) {
        return [...employees].sort((a, b) => b[fieldKey].localeCompare(a[fieldKey]));
    }
}

const employees = getLocStorList();
renderTable(employees);


function resetForm() {
    myForm.reset();
    confirmBtn.textContent = "Отправить заявку";
    confirmBtn.disabled = true;
    document.querySelector('.custom-checkbox').classList.remove('visually-hidden');
    currentEditIndex = -1;
}

const cookieBox = document.querySelector('.cookie');

cookieBox.addEventListener('click', (e) => {
    if (e.target.matches('.cookie__btn')) {
        cookieBox.classList.add('cookie--inactive');
    }
});