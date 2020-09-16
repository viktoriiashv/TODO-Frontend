class Task {
  constructor(id, name, done, taskListId) {
        this.id = id;
        this.name = name;
        this.done = done;
        this.taskListId = taskListId;
  }
}

const todoElement = document.getElementById('todolist');
const todoForm = document.forms['todoform'];

function appendTask(task) {
  const { id, name, done, taskListId } = task;
  todoElement.innerHTML += `
    <li data-id="${id}">
      <span ${done ? `class="done"` : ``} >${id} ${name}</span>
      <div class="controls">
      <label><input type="checkbox" name="Done" class="checkbox" value="${done}" ${done ? `checked` : ``}>IsDone</label>
      <button class="del" title="Delete TODO"><i class="fas fa-trash"></i></button>
      </div>
    </li>`;
}

function removeTask(target) {
    target.remove();
}
function postTask(task) {
  const jsonBody = {
    name: task.name,
    done: task.done,
    taskListId: task.taskListId
  };
  return fetch(tasksEndpoint, {
      method: 'POST', 
      headers:  {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody)
  })
  .then(response => response.json())
}

function deleteTask(id) {
  return fetch(tasksEndpoint + id, {
      method: 'DELETE', 
      headers:  {
          'Content-Type': 'application/json'
      },

  });
}

function updateTaskStatus(id, taskStatus) {
  const jsonBody = {
    done: taskStatus
  };
  return fetch(tasksEndpoint + id, {
      method: 'PATCH', 
      headers:  {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody)
  });
}

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(todoForm);
    const task = new Task(1, Object.fromEntries(formData.entries()).name, false, 1);
    console.log(task);
    postTask(task)
    .then(appendTask)
    .then(_ => todoForm.reset())
})


let tasksEndpoint = 'http://localhost:5000/api/tasks/';

fetch(tasksEndpoint)
    .then(response => response.json())
    .then(tasks => tasks.map(appendTask));

    todoElement.addEventListener('click', (event) => {//another way - foreach with adding function for inputs
      if (event.target.tagName === 'INPUT') {
        const target = event.target.closest("LI").querySelector('SPAN');
        let id = event.target.closest("LI").dataset.id;
        if(target.classList.contains('done')) {
          target.classList.remove('done');
          updateTaskStatus(id, false);
        } else {
          target.classList.add('done');
          updateTaskStatus(id, true);
        }
      }
      else if (event.target.tagName === 'BUTTON' || event.target.tagName === 'I') {
        const target = event.target.closest("LI");
        let id = target.dataset.id;
        deleteTask(id)
        .then(removeTask(target));
      }
    }) 
