class Task {
  constructor(Id, Name, Done, TaskListId) {
        this.Id = Id;
        this.Name = Name;
        this.Done = Done;
        this.TaskListId = TaskListId;
  }
}

const todoElement = document.getElementById('todolist');
const todoForm = document.forms['todoform'];

function appendTask(task) {
  console.log(task);
  const { Id, Name, Done, TaskListId } = task;
  console.log(Name);
  todoElement.innerHTML += `
    <li>
      <span ${Done ? `class="done"` : ``} >${Id} ${Name}</span>
      <label><input type="checkbox" name="Done" class="checkbox" value="${Done}" ${Done ? `checked` : ``}>IsDone</label>
    </li>`;
}
function postTask(task) {
  console.log(JSON.stringify(task));
  return fetch(tasksEndpoint, {
      method: 'POST', 
      headers:  {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
  })
  .then(response => response.json())
}


todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(todoForm);
    const task = new Task(90, Object.fromEntries(formData.entries()).Name, false, 1);
    postTask(task)
    .then(appendTask)
    .then(_ => todoForm.reset())
})


todoElement.addEventListener('click', (event) => {//another way - foreach with adding function for inputs
  if (event.target.tagName === 'INPUT') {
    const target = event.target.closest("LI").querySelector('SPAN');
    if(target.classList.contains('done')) {
      target.classList.remove('done');
    } else {
      target.classList.add('done');
    }
  }
})

let tasksEndpoint = 'http://localhost:5000/api/tasks/';

fetch(tasksEndpoint)
    .then(response => response.json())
    .then(tasks => tasks.forEach(appendTask));
