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
    {
      name: "Pending",
      des: "Pending task",
      tasks: [],
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
          <button class="btn btn-task">+ Add new task</button>`;
    boardDiv.innerHTML = boardEl;
    boardsBox.appendChild(boardDiv);
    renderTasks(board, boardDiv);
  });
}

function renderTasks(board, boardDiv) {
  const taskCardsBox = boardDiv.querySelector(".board-task-cards");
  board.tasks.forEach((task) => {
    const newTask = document.createElement("div");
    newTask.classList.add("task-card");
    newTask.setAttribute("draggable", "true");
    newTask.innerHTML = `
    <div class="task-card-title">
        <h4>${task.name}</h4>
        <span>${task.time}</span>
    </div>
    <p>${task.des}</p>`;
    taskCardsBox.appendChild(newTask);
  });
}

add_task.addEventListener("click", () => {
  const taskName = document.getElementById("task_name");
  const taskDes = document.getElementById("task_des");
  const board = document.querySelector("input[name='board']:checked")?.value;

  createTask(taskName.value.trim(), taskDes.value.trim());
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
  console.log(firstRadio);
}

function showOverlay() {
  const overlayEl = document.querySelectorAll(".overlay");
  overlayEl.forEach((el) => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
    } else {
      el.classList.add("active");
    }
  });
}

function createTask(name, des, board) {
  const newTask = document.createElement("div");
  newTask.classList.add("task-card");
  newTask.setAttribute("draggable", "true");
  newTask.innerHTML = `
    <div class="task-card-title">
        <h4>${name}</h4>
        <span>${getCurrentTime()}</span>
    </div>
    <p>${des}</p>`;

  boardCardsBox.forEach((box) => {
    box.appendChild(newTask);
  });
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
