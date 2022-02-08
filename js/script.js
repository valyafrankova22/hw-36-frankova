'use strict';

(() => {

    const todoList = {
        formId: null,
        form: null,
        inputs: null,
        todoItemContainer: null,
        todoData: {},
        storeArr: [],
        completed: false,
        todoItemId: 0,

        findForm() {
            const form = document.getElementById(this.formId);
            if(form === null || form.nodeName !== 'FORM') {
                alert('There is not such a form on the page');
            };

            this.form = form;
            return form;
        },

        setEvents() {
            this.form.addEventListener(
                'submit', 
                event => this.formHandler(event));

            document.addEventListener(
                'DOMContentLoaded',
                 () => this.prefillHandler());

            this.todoItemContainer.addEventListener(
                'change',
                 event => this.isChecked(event));

            this.todoItemContainer.addEventListener(
                'click', 
                event => this.removeTodoItem(event));

            this.form.addEventListener(
                'click', 
                event => this.deleteAllTodoItems(event))
        },


        formHandler(event) {
            event.preventDefault();
            this.todoItemId += 1;

            this.setDataValues(this.todoData);
            if(!this.isEmptyValues(this.inputs)) {
                this.setData(this.todoData);
                this.getData(this.formId);
                this.getTodoItemContainer().prepend(this.createTemplate(this.todoData));
            }
            event.target.reset();
        },

        isChecked({target}) {
            const itemId = target.getAttribute('data-id');
            const status = target.checked;
            const data = JSON.parse(localStorage.getItem(this.formId));
            const currentItem = data.find(todoItem => todoItem.itemId === +itemId);
            currentItem.completed = status;
            localStorage.setItem(this.formId, JSON.stringify(data));
        },

        removeTodoItem({target}) {
            if(!target.classList.contains('delete-item-btn')) return;
            const data = JSON.parse(localStorage.getItem(this.formId));
            const itemId = +target.getAttribute('data-id');
            const currentItemId = data.findIndex(todoItem => todoItem.itemId === itemId);
            data.splice(currentItemId, 1);
            localStorage.setItem(this.formId, JSON.stringify(data));
            const todoItemContainer = this.findParentElByClass(target, 'taskWrapper');
            todoItemContainer.parentElement.remove();
        },

        findParentElByClass(currentElement, parentClassName) {
            if(currentElement === null) return null;
            
            if(currentElement.classList.contains(parentClassName)) {
                return currentElement
            };
            
            return this.findParentElByClass(currentElement.parentElement, parentClassName);

        },

        deleteAllTodoItems({target}) {
            if(!target.classList.contains('remove-all')) return;
            localStorage.removeItem(this.formId);
            this.getTodoItemContainer().innerHTML = '';
        },

        getInputs({target}) {
            return target.querySelectorAll('input:not([type="submit"], [type="reset"]), textarea');
        },

        setDataValues(data) {
            this.inputs = Array.from(this.getInputs(event));

            for(const input of this.inputs) {   
                data[input.name] = input.value;
            };
            data['completed'] = this.completed;
            data['itemId'] = this.todoItemId;
            return data;
        },

        isEmptyValues(inputs) {
            let flag = inputs.some(input => !input.value.trim());
            flag ? alert('Please, fill both inputs') : false;
            return flag;
        },

        getTodoItemContainer() {
            return this.todoItemContainer = document.getElementById('todoItems');
        },

        createTemplate({title, description, itemId, completed}) {
            const todoItem = this.createElement('div', 'col-4');
            const taskWrapper = this.createElement('div', 'taskWrapper');
            const taskHeading = this.createElement('div', 'taskHeading', title);
            const taskDescription = this.createElement('div', 'taskDescription', description);
            const checkboxLabel = this.createElement('label');
            const checkbox = this.createElement('input', 'taskCheckbox');
            const span = this.createElement('span');
            const deleteTaskBtn = this.createElement('button', ['btn', 'btn-danger', 'delete-item-btn']);
            
            todoItem.append(taskWrapper);
            checkbox.setAttribute('data-id', itemId);
            checkbox.setAttribute('type', 'checkbox');
            span.innerHTML = 'Completed ?';
            checkboxLabel.append(checkbox);
            checkboxLabel.append(span);
            deleteTaskBtn.setAttribute('data-id', itemId);
            deleteTaskBtn.innerHTML += 'Delete'
            
            taskWrapper.append(taskHeading);
            taskWrapper.append(taskDescription);
            taskWrapper.innerHTML += '<hr>';
            taskWrapper.append(checkboxLabel);
            taskWrapper.innerHTML += '<hr>';
            taskWrapper.append(deleteTaskBtn);

            todoItem.querySelector('input[type=checkbox]').checked = completed;
            
            return todoItem;
        },

        createElement(nodeName, classes, innerContent = '') {
            const el = document.createElement(nodeName);

            if(Array.isArray(classes)) {
                for(const singleClass of classes) {
                    el.classList.add(singleClass);
                };
            } else {
                el.classList.add(classes);
            };
            
            if(classes === undefined) el.removeAttribute('class');
            el.innerHTML = innerContent;
            return el;
        },

        setData(data) {
            if(!localStorage.getItem(this.formId)) {
                this.storeArr.push(data);
                localStorage.setItem(this.formId, JSON.stringify(this.storeArr));
                return;
            }

            let exsistingData = localStorage.getItem(this.formId);
            exsistingData = JSON.parse(exsistingData);
            exsistingData.push(data);
            localStorage.setItem(this.formId, JSON.stringify(exsistingData));
            return exsistingData;
        },

        getData(data) {
            return JSON.parse(localStorage.getItem(data));
        },

        prefillHandler() {
            const data = this.getData(this.formId);
            if(!data || !data.length) return;
            this.todoItemId = data[data.length - 1].itemId;
            data.forEach(itemData => this.getTodoItemContainer().prepend(this.createTemplate(itemData)));
        },

        init(currentFormId) {
            if(typeof currentFormId !== 'string' || !currentFormId.trim()) {
                alert('Form ID is not valid');
            }

            this.formId = currentFormId;

            this.findForm();
            this.getTodoItemContainer();
            this.setEvents();
        },
    };

    todoList.init('todoForm');

})();
   