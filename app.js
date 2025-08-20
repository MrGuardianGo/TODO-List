const todo_form = document.getElementsByTagName("form")[0];
const todo_text_input = document.getElementById("todo-input");
const todo_add_button = document.getElementById("todo-add");
const todo_container = document.getElementsByClassName("todo-container")[0];
const submit_icon = document.getElementById("submit-icon");
const theme_switch = document.getElementById("theme-switch");
const body = document.getElementsByTagName("body")[0];
const radios = document.querySelectorAll('input[type="radio"]');

let TODOS = JSON.parse(localStorage.getItem("TODOS")) || [];

function appendTodoElement({ id, text, completed }) {
  const outer_div = document.createElement("div");
  outer_div.setAttribute("class", `todo-item ${completed ? "completed" : ""}`);
  outer_div.setAttribute("id", id);
  outer_div.innerHTML = `
  <div class="checkbox-container">
            <input type="checkbox" class="completed-checkbox" id="completed-checkbox" ${
              completed ? "checked" : ""
            }/>
    </div>
  <div class="todo-text-container">
    <p class="todo-text">${text}</p>
  </div>
  <div class="todo-buttons">
    <button class="edit">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/></svg>
    </button>
    <button class ="remove">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
    </button>
  </div>`;

  todo_container.appendChild(outer_div);
}

function appendList(todos) {
  todo_container.innerHTML = "";
  todos.forEach((t) => {
    appendTodoElement(t);
  });
}

function filterTODOS(filter) {
  let def_TODOS = TODOS;

  switch (filter) {
    case "all":
      appendList(TODOS);
      break;
    case "completed":
      def_TODOS = def_TODOS.filter((t) => t.completed === true);
      appendList(def_TODOS);

      break;
    case "incomplete":
      def_TODOS = def_TODOS.filter((t) => t.completed === false);
      appendList(def_TODOS);

      break;
    default:
      appendList(TODOS);
      break;
  }
}

radios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const filter = e.target.id;
    filterTODOS(filter);
  });
});

TODOS.forEach((t) => {
  appendTodoElement(t);
});

if (localStorage.getItem("mode") == "dark") {
  body.classList.add("darkmode");
} else {
  body.classList.remove("darkmode");
}

function setTODOS() {
  localStorage.setItem("TODOS", JSON.stringify(TODOS));
}

let editMode = false;
let editID;

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

function deleteTodo(id) {
  TODOS = TODOS.filter((t) => t.id != id);
  setTODOS();
}

function updateEditedTodo() {
  let todo_item = TODOS.find((t) => t.id == editID);
  let index = TODOS.indexOf(todo_item);

  let newInput = todo_text_input.value;
  if (newInput !== "") {
    todo_item.text = newInput;
    todo_item.completed = false;

    TODOS[index] = todo_item;

    setTODOS();
    let todo_item_div =
      document.getElementById(editID).childNodes[3].childNodes[1];

    todo_item_div.innerHTML = newInput;
    document.getElementById(editID).classList.remove("completed");
    document.getElementById(editID).childNodes[1].childNodes[1].checked = false;
    editMode = false;
    editID = "";
    todo_text_input.value = "";
    // submit_icon.classList.remove("fa-pen-to-square");
    // submit_icon.classList.add("fa-plus");

    submit_icon.innerHTML = `<path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>`;
  }
}

function editTodo(id) {
  let todo_item = TODOS.find((t) => t.id == id);
  todo_text_input.value = todo_item.text;

  editID = id;
}

function addTodo(text) {
  if (text.length == 0) {
    return;
  }

  const todo_item = {
    text,
    id: guidGenerator(),
    completed: false,
  };

  TODOS.push(todo_item);
  setTODOS();
  appendTodoElement(todo_item);
}

function checkTodo(id) {
  let todo_item = TODOS.find((t) => t.id == id);
  let index = TODOS.indexOf(todo_item);
  let update_todo_item = {
    text: todo_item.text,
    id: todo_item.id,
    completed: !todo_item.completed,
  };

  TODOS[index] = update_todo_item;
  setTODOS();

  if (update_todo_item.completed) {
    document.getElementById(id).classList.add("completed");
  } else {
    document.getElementById(id).classList.remove("completed");
  }

  radios.forEach((r) => {
    if (r.checked === true) {
      filterTODOS(r.id);
    }
  });
}

todo_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = todo_text_input.value;
  if (editMode) {
    updateEditedTodo();
    return;
  }
  todo_text_input.value = "";
  addTodo(input);
});

todo_container.addEventListener("click", (e) => {
  const item = e.target;
  const id = e.target.parentElement.parentElement.id;

  if (item.classList[0] === "remove") {
    deleteTodo(id);
    e.target.parentElement.parentElement.style.display = "none";
  }

  if (item.classList[0] === "edit") {
    editMode = true;
    editID = id;
    // submit_icon.classList.remove("fa-plus");
    // submit_icon.classList.add("fa-pen-to-square");

    submit_icon.innerHTML = `<path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/>`;

    editTodo(id);

    // editMode = false;
    // editID = "";
  }

  if (item.classList[0] === "completed-checkbox") {
    checkTodo(id);
  }
});

theme_switch.addEventListener("click", () => {
  if (body.classList[0] == "darkmode") {
    body.classList.remove("darkmode");
    localStorage.setItem("mode", "light");
  } else {
    body.classList.add("darkmode");
    localStorage.setItem("mode", "dark");
  }
});
