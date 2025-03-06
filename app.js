const add_task = document.getElementById("add_task_todo");
const modalClose = document.querySelectorAll(".close-btn");

const boardsBox = document.querySelector(".board-box");

let data = {
  boards: [
    {
      name: "Todo",
      des: "todo list dummy",
      tasks: [
        {
          name: "Task one",
          des: "a jafjksf tjket wetj",
          time: "<span>7:31PM ; Tuesday</span>",
        },
        {
          name: "Task two",
          des: "ket gjhthfhjk ruur wetj",
          time: "<span>7:42PM ; Tuesday</span>",
        },
      ],
    },
    {
      name: "Complete",
      des: "completed task",
      tasks: [
        {
          name: "Task three",
          des: "a jafjksf tjket wetj",
          time: "<span>7:31PM ; Tuesday</span>",
        },
      ],
    },
   
  ],
};
renderBoard();
updateRadioBtns();
function renderBoard() {
  data.boards.forEach((board) => {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");

    const boardEl = `
    <div class="board-title-box">
            <div class="board-title">
              <div class="board-title-text">
                <div class="board-circle"></div>
                <h2>${board.name}</h2>
              </div>
              <span> ${board.tasks.length} </span>
            </div>
            <h5>${board.des}</h5>
          </div>
          <div class="board-task-cards">
          </div>
          <button onclick="showOverlay()"  class="btn btn-task">+ Add new task</button>`;
    boardDiv.innerHTML = boardEl;
    boardsBox.appendChild(boardDiv);
    renderTasks(board, boardDiv);
  });
}

function renderTasks(board, boardDiv) {
  const taskCardsBox = boardDiv.querySelector(".board-task-cards");
  board.tasks.forEach((task , index) => {
    const newTask = document.createElement("div");
    newTask.setAttribute("id", index )
    newTask.classList.add("task-card");
    newTask.setAttribute("draggable", "true");
    newTask.innerHTML = `
    <div class="task-card-title">
        <h4>${task.name}</h4>
        <span>${task.time}</span>
    </div>
    <p>${task.des}</p>
    <div class="task-options">
    <button class="edit-task" data-board = ${board.name} data-index = ${index}>🖊️</button>
    <button class="delete-task" data-board = ${board.name} data-index = ${index}>🗑️</button>
    </div>
    `;
    taskCardsBox.appendChild(newTask);
  });
}


add_task.addEventListener("click", () => {
  const taskName = document.getElementById("task_name");
  const taskDes = document.getElementById("task_des");
  const board = document.querySelector("input[name='board']:checked");
  let boardName
  if(document.querySelector("input[name='board']:checked")){
    boardName = board.id 
  }
  createTask(taskName.value.trim(), taskDes.value.trim(), boardName);
  showOverlay();
  taskName.value = "";
  taskDes.value = "";
});

modalClose.forEach((element) => {
  element.addEventListener("click", () => {
    showOverlay();
  });
});

function updateRadioBtns() {
  const boardsRadioBtnWrapper = document.querySelector(".boards-select");
  boardsRadioBtnWrapper.innerHTML = "";
  data.boards.forEach((board) => {
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("button-group");

    const inputeData = ` <input type="radio" id="${board.name}" name="board" />
              <label for="${board.name}">${board.name}</label>`;

    btnWrapper.innerHTML += inputeData;
    // boardsRadioBtnWrapper.innerHTML = "";
    boardsRadioBtnWrapper.appendChild(btnWrapper);
  });
  const firstRadio = boardsRadioBtnWrapper.querySelector("input[name='board']");
  if (firstRadio) firstRadio.checked = true;

}

function showOverlay() {
  const overlayEl = document.querySelectorAll(".overlay");
  console.log("Overlay elements found:", overlayEl.length);
  if (overlayEl.length === 0) {
    console.error("No elements with class 'overlay' found!");
    return;
 }
  overlayEl.forEach((el) => {
    el.classList.toggle("active"); // Toggle active class
    console.log("Class added:", el.classList.contains("active"));
  });
}


function createTask(name, des, boardName) {
  if (!boardName) {
    console.error("Board name is undefined!");
    alert("Please select a board before adding a task.");
    return;
  }

  const currBoard = data.boards.find(board => board.name.toLowerCase() === boardName.toLowerCase())

  if(!currBoard){
    console.error("Board not found!");
    alert("Invalid board selected.");
    return;
  }

  const newTask = {
    name,
    des,
    time: getCurrentTime(),
  };
  currBoard.tasks.push(newTask)
  boardsBox.innerHTML = "";
  renderBoard();
}

function getCurrentTime() {
  const date = new Date();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = dayNames[date.getDay()];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `<span>${hours}:${minutes}${ampm} ; ${day}</span>`;
}
