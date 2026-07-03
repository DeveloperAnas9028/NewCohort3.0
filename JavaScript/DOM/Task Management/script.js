let body = document.querySelector('body')

let createbtn = document.querySelector("#create")

let form_container = document.querySelector(".task-form-container")
let form = document.querySelector("#taskForm")
let inp1 = document.querySelector("#taskTitle")
let select_inp = document.querySelector("#taskCategory")

let tasks_div = document.querySelector(".tasks")

let submitForm = document.querySelector('.submit-task-btn')
let closeForm = document.querySelector('#closeFormBtn')

let toggleTheme = document.querySelector('#dark-light')


const TaskArr = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;



function renderTasks() {
    tasks_div.innerHTML = "";

    let totalCountEl = document.querySelector('.totalTask h2:last-child');
    let pendingCountEl = document.querySelector('.pendingTask h2:last-child');
    let completedCountEl = document.querySelector('.completedTask h2:last-child');

    totalCountEl.innerText = TaskArr.length;
    pendingCountEl.innerText = TaskArr.filter(task => task.status === "Pending").length;
    completedCountEl.innerText = TaskArr.filter(task => task.status === "Completed").length;


    TaskArr.forEach(task => {
        let task_div = document.createElement('div');
        task_div.classList.add('task');

        task_div.dataset.id = task.id;
        task_div.dataset.status = task.status;
        task_div.dataset.category = task.taskCategory;


        let taskInfodiv = document.createElement('div');
        taskInfodiv.classList.add('task_info');

        let h2 = document.createElement('h2');
        h2.innerText = task.taskName;

        let p = document.createElement('p');
        p.classList.add('capsule');
        p.innerText = task.taskCategory;

        let span = document.createElement('span');
        span.classList.add('status');
        span.innerText = task.status;


        if (task.status === "Completed") {
            span.style.backgroundColor = "#83fc9b";
            span.style.color = "#075416";
        }

        taskInfodiv.append(h2, p, span);

        let statusButtons = document.createElement('div');
        statusButtons.classList.add('status_buttons');

        let editBtn = document.createElement('button');
        editBtn.classList.add("update");
        editBtn.innerText = "Edit";

        let markAsCompletedBtn = document.createElement('button');
        markAsCompletedBtn.classList.add("completed");
        markAsCompletedBtn.innerText = "Mark As Completed";

        let delBtn = document.createElement('button');
        delBtn.classList.add("delete");
        delBtn.innerText = "Delete";

        statusButtons.append(editBtn, markAsCompletedBtn, delBtn);
        task_div.append(taskInfodiv, statusButtons);

        tasks_div.append(task_div);
    });
}


form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!inp1.value.trim() || !select_inp.value) {
        alert("Plz fill all the fields");
        return;
    }

    let taskName = inp1.value;
    let taskCategory = select_inp.value;


    if (editId !== null) {

        let taskObj = TaskArr.find(task => task.id == editId);
        if (taskObj) {
            taskObj.taskName = taskName;
            taskObj.taskCategory = taskCategory;
        }

        editId = null;
        submitForm.innerText = "Add Task";
    }

    else {
        let taskObj = {
            id: Date.now(),
            taskName,
            taskCategory,
            status: "Pending"
        };
        TaskArr.push(taskObj);
    }


    localStorage.setItem("tasks", JSON.stringify(TaskArr));

    renderTasks();

    form.reset();
    form_container.style.display = "none";
})

tasks_div.addEventListener('click', (e) => {
    let currentCard = e.target.parentElement.parentElement;

    if (e.target.classList.contains('update')) {

        form_container.style.display = "flex";

        editId = currentCard.dataset.id;

        inp1.value = currentCard.children[0].firstChild.innerText;
        select_inp.value = currentCard.children[0].children[1].innerText;
        submitForm.innerText = "Update Task";

    }


    if (e.target.classList.contains('completed')) {
        let cardId = currentCard.dataset.id;
        let taskObj = TaskArr.find(task => task.id == cardId);

        if (taskObj) {
            taskObj.status = "Completed";
        }
        localStorage.setItem("tasks", JSON.stringify(TaskArr));
        renderTasks();
    }

    if (e.target.classList.contains('delete')) {
        let cardId = currentCard.dataset.id;

        let taskIndex = TaskArr.findIndex(task => task.id == cardId);
        if (taskIndex !== -1) {
            TaskArr.splice(taskIndex, 1);
        }

        localStorage.setItem("tasks", JSON.stringify(TaskArr));
        renderTasks();
    }

})


toggleTheme.addEventListener("click", () => {
    let currentTheme = document.body.getAttribute('data-theme')
    console.log(currentTheme);

    if (currentTheme === "dark") {
        document.body.setAttribute('data-theme', "light")
    }
    else {
        document.body.setAttribute('data-theme', "dark")
    }
})


createbtn.addEventListener('click', () => {
    form_container.style.display = "flex";
})

submitForm.addEventListener('click', () => {
    form_container.style.display = "none";
})

closeForm.addEventListener("click", () => {
    form_container.style.display = "none";
})




let grandparent = document.querySelector('.grandparent')
let parent = document.querySelector('.parent')
let child = document.querySelector('.button-child')
let consoleOutput = document.querySelector('.console-output')


function showOutput(message, containerId) {
    let p = document.createElement("p");
    p.classList.add("event_message")
    p.innerText = message;
    document.querySelector(containerId).append(p);
}



//Diffrence between Event Bubbling and Event Capturing:
// Event Bubbling: Events are by default triggered in bubbling way means bottom to top approach (child,parent, and then grandparent).
//Event Capturing: In this, we manually reverse their order means (grandparent, parent and then child) with the help of giving {capture : true} attribute in the Event Listener method or function.   

child.addEventListener('click', (event) => {
    console.log("Child (Bubbling)");
    showOutput("Child Triggered...", "#bubbling-log");
})


grandparent.addEventListener('click', (event) => {
    console.log("Grandparent (Bubbling)");
    showOutput("Grandparent Triggered... ", "#bubbling-log");
})

parent.addEventListener('click', (event) => {
    console.log("Parent (Bubbling)");
    showOutput("Parent Triggered... ", "#bubbling-log");
})


child.addEventListener('click', (event) => {
    console.log("Child (Capturing)");
    showOutput("Child Triggered...", "#capturing-log");
}, { capture: true })


grandparent.addEventListener('click', (event) => {
    console.log("Grandparent (Capturing)");
    showOutput("Grandparent Triggered...", "#capturing-log");
}, { capture: true })

parent.addEventListener('click', (event) => {
    console.log("Parent (Capturing)");
    showOutput("Parent Triggered...", "#capturing-log");
}, { capture: true })

renderTasks();
