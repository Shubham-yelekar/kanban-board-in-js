const add_task = document.getElementById("add_task_todo");

const formBox = document.getElementById("form_box");
const boardsBox = document.querySelector(".board-box");

let modalMode = "addTask"; // "addTask", "editTask", "addBoard"
let editBoardName = "";
let editTaskIndex = null;
let draggedTask = null;

let data = JSON.parse(localStorage.getItem("taskData")) || {
  boards: [
    {
      name: "Todo",
      des: "Todo list",
      tasks: [],
    },
  ],
};

function saveData() {
  localStorage.setItem("taskData", JSON.stringify(data));
}

renderBoard();
updateRadioBtns();

// 🛠 Render all boards and their tasks
function renderBoard() {
  boardsBox.innerHTML = "";
  data.boards.forEach((board) => {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    boardDiv.dataset.boardName = board.name;
    const boardEl = `
    <div class="board-title-box">
      <div class="board-title">
        <div class="board-title-text">
          <h2>${board.name}</h2>
        </div>
        <span>${board.tasks.length}</span>
      </div>
      <h5>${board.des}</h5>
    </div>
    <div class="board-task-cards"></div>
    <button onclick="toggleModal('addTask', '${board.name}')" class="btn btn-task">+ Add new task</button>
    <button class="btn btn-delete-board" onclick="deleteBoard('${board.name}')">❌ Delete Board</button>`;

    boardDiv.innerHTML = boardEl;
      // Allow dragging into the board
      boardDiv.addEventListener("dragover", handleDragOver);
      boardDiv.addEventListener("drop", handleDropOnBoard);
    boardsBox.appendChild(boardDiv);
    renderTasks(board, boardDiv);
  });
}

// 🛠 Render all tasks inside a board
function renderTasks(board, boardDiv) {
  const taskCardsBox = boardDiv.querySelector(".board-task-cards");
  taskCardsBox.innerHTML = "";
  board.tasks.forEach((task, index) => {
    const newTask = document.createElement("div");
    newTask.classList.add("task-card");
    newTask.setAttribute("draggable", "true");
    newTask.dataset.boardName = board.name;
    newTask.dataset.index = index;
    newTask.innerHTML = `
      <div class="task-card-title">
        <h4>${task.name}</h4>
        <span>${task.time}</span>
      </div>
      <p>${task.des}</p>
      <div class="task-options">
        <button class="edit-task" onclick="toggleModal('editTask', '${board.name}', ${index})">🖊️</button>
        <button class="delete-task" onclick="deleteTask('${board.name}', ${index})">🗑️</button>
      </div>
    `;
    newTask.addEventListener("dragstart", handleDragStart);
    newTask.addEventListener("dragover", handleDragOver);
    newTask.addEventListener("drop", handleDrop);

    taskCardsBox.appendChild(newTask);
  });
}
// 🛠 Drag n Drop

function handleDragStart(event){
  draggedTask = event.target
  event.dataTransfer.setData("text/plain", JSON.stringify({
    boardName: draggedTask.dataset.boardName,
    taskIndex: draggedTask.dataset.index
  }));
}

function handleDragOver(event) {
  event.preventDefault(); // Allow drop
}

function handleDrop(event) {
  event.preventDefault();
  
  const dropTarget = event.target.closest(".task-card");
  if (!dropTarget) return;

  const dropBoardName = dropTarget.dataset.boardName;
  const dropIndex = dropTarget.dataset.index;

  const { boardName, taskIndex } = JSON.parse(event.dataTransfer.getData("text/plain"));

  if (boardName === dropBoardName) {
    // Sorting within the same board
    const board = data.boards.find(b => b.name === boardName);
    const movedTask = board.tasks.splice(taskIndex, 1)[0];
    board.tasks.splice(dropIndex, 0, movedTask);
  } else {
    // Moving task to another board
    const sourceBoard = data.boards.find(b => b.name === boardName);
    const targetBoard = data.boards.find(b => b.name === dropBoardName);
    
    if (sourceBoard && targetBoard) {
      const movedTask = sourceBoard.tasks.splice(taskIndex, 1)[0];
      targetBoard.tasks.push(movedTask);
    }
  }

  saveData();
  renderBoard();
}

function handleDropOnBoard(event) {
  event.preventDefault();
  
  const boardName = event.currentTarget.dataset.boardName;
  const { boardName: sourceBoardName, taskIndex } = JSON.parse(event.dataTransfer.getData("text/plain"));

  if (sourceBoardName !== boardName) {
    const sourceBoard = data.boards.find(b => b.name === sourceBoardName);
    const targetBoard = data.boards.find(b => b.name === boardName);

    if (sourceBoard && targetBoard) {
      const movedTask = sourceBoard.tasks.splice(taskIndex, 1)[0];
      targetBoard.tasks.push(movedTask);
    }

    saveData();
    renderBoard();
  }
}

// 🛠 Toggle Modal for different actions


function toggleModal(mode = "addTask", boardName = "", taskIndex = null) {
  modalMode = mode;
  editBoardName = boardName;
  editTaskIndex = taskIndex;

  document.querySelector(".overlay").classList.toggle("active");

  // Update the modal title and button text
  const modalTitle = document.querySelector(".form-box h4");
  const modalButton = document.querySelector(".btn-primary");

  if (mode === "addTask") {
    modalTitle.textContent = "Add New Task";
    modalButton.textContent = "Add Task";
  } else if (mode === "editTask") {
    modalTitle.textContent = "Edit Task";
    modalButton.textContent = "Save Changes";
  } else if (mode === "addBoard") {
    modalTitle.textContent = "Create New Board";
    modalButton.textContent = "Create Board";
  }

  document.getElementById("task_name").value = "";
  document.getElementById("task_des").value = "";

  const modalClose = document.querySelector(".close-btn");
  modalClose.addEventListener('click', ()=>{
    document.getElementById("task_name").value = ''
    document.getElementById("task_des").value = ''
    document.querySelector(".overlay").classList.toggle('active');
  })

  updateRadioBtns();
}

// 🛠 Add / Edit a task
add_task.addEventListener("click", () => {
  const taskName = document.getElementById("task_name").value.trim();
  const taskDes = document.getElementById("task_des").value.trim();
  const selectedBoard = document.querySelector("input[name='board']:checked");

  if (modalMode === "addTask") {
    if (!selectedBoard) {
      alert("Please select a board.");
      return;
    }
    createTask(taskName, taskDes, selectedBoard.id);
  } else if (modalMode === "editTask") {
    updateTask(taskName, taskDes);
  } else if (modalMode === "addBoard") {
    createBoard(taskName, taskDes);
  }

  toggleModal();
});

// 🛠 Create a new task
function createTask(name, des, boardName) {
  if (!name) {
    alert("Task name cannot be empty.");
    return;
  }

  const currBoard = data.boards.find((board) => board.name === boardName);
  if (!currBoard) {
    alert("Invalid board selected.");
    return;
  }

  currBoard.tasks.push({
    name,
    des,
    time: getCurrentTime(),
  });

  saveData();
  renderBoard();
}

// 🛠 Edit an existing task
function updateTask(name, des) {
  const curBoard = data.boards.find((b) => b.name === editBoardName);
  if (curBoard && curBoard.tasks[editTaskIndex]) {
    curBoard.tasks[editTaskIndex].name = name;
    curBoard.tasks[editTaskIndex].des = des;
    saveData();
    renderBoard();
  }
}

// 🛠 Delete a task
function deleteTask(boardName, index) {
  const curBoard = data.boards.find((b) => b.name === boardName);
  if (curBoard) {
    curBoard.tasks.splice(index, 1);
    saveData();
    renderBoard();
  }
}

// 🛠 Create a new board
function createBoard(name, des) {
  if (!name) {
    alert("Board name cannot be empty.");
    return;
  }

  if (data.boards.some((board) => board.name.toLowerCase() === name.toLowerCase())) {
    alert("A board with this name already exists!");
    return;
  }

  data.boards.push({
    name,
    des: des || "No description",
    tasks: [],
  });

  saveData();
  renderBoard();
  updateRadioBtns();
}

// 🛠 Delete a board
function deleteBoard(boardName) {
  data.boards = data.boards.filter((board) => board.name !== boardName);
  saveData();
  renderBoard();
}

// 🛠 Update radio buttons dynamically
function updateRadioBtns() {
  const boardsRadioBtnWrapper = document.querySelector(".boards-select");
  boardsRadioBtnWrapper.innerHTML = "";

  data.boards.forEach((board) => {
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("button-group");

    const inputHTML = `
      <input type="radio" id="${board.name}" name="board" />
      <label for="${board.name}">${board.name}</label>
    `;

    btnWrapper.innerHTML = inputHTML;
    boardsRadioBtnWrapper.appendChild(btnWrapper);
  });

  const firstRadio = boardsRadioBtnWrapper.querySelector("input[name='board']");
  if (firstRadio) firstRadio.checked = true;
}

// 🛠 Get current time
function getCurrentTime() {
  const date = new Date();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[date.getDay()];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `<span>${hours}:${minutes} ${ampm}; ${day}</span>`;
}
