const API = "http://localhost:3000";
let allTasks = [];
let allUsers = [];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Usuarios ---

async function crearUsuario() {
  const input = document.getElementById("userName");
  const name = input.value.trim();

  if (!name) {
    input.classList.add("error");
    return;
  }

  await fetch(API + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  input.value = "";
  await cargarUsuarios();
}

async function cargarUsuarios() {
  const res = await fetch(API + "/users");
  allUsers = await res.json();

  const lista = document.getElementById("listaUsuarios");
  const select = document.getElementById("userSelect");

  lista.innerHTML = allUsers.length
    ? allUsers.map(u => `
        <li>
          <span class="user-name">${escapeHtml(u.name)}</span>
          <span class="user-id">#${u.id}</span>
        </li>
      `).join("")
    : `<li class="empty-msg">Sin usuarios aún</li>`;

  select.innerHTML =
    `<option value="">Seleccionar usuario</option>` +
    allUsers.map(u => `<option value="${u.id}">#${u.id} — ${escapeHtml(u.name)}</option>`).join("");
}

// --- Tareas ---

async function crearTarea() {
  const titleInput = document.getElementById("taskTitle");
  const selectInput = document.getElementById("userSelect");
  const title = titleInput.value.trim();
  const user_id = selectInput.value;

  let valid = true;
  if (!title)   { titleInput.classList.add("error");  valid = false; }
  if (!user_id) { selectInput.classList.add("error"); valid = false; }
  if (!valid) return;

  await fetch(API + "/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, user_id })
  });

  titleInput.value = "";
  selectInput.value = "";
  await cargarTareas();
}

async function cargarTareas() {
  const res = await fetch(API + "/tasks");
  allTasks = await res.json();
  filtrarTareas();
}

function filtrarTareas() {
  const idVal   = document.getElementById("searchId").value.trim();
  const nameVal = document.getElementById("searchName").value.trim().toLowerCase();

  const filtered = allTasks.filter(t => {
    const matchId   = idVal   === "" || String(t.id) === idVal;
    const matchName = nameVal === "" || t.title.toLowerCase().includes(nameVal);
    return matchId && matchName;
  });

  renderTareas(filtered);
}

function renderTareas(tasks) {
  const lista = document.getElementById("listaTareas");

  if (!tasks.length) {
    const emptyText = allTasks.length ? "Sin resultados" : "Sin tareas aún";
    lista.innerHTML = `<li class="empty-msg">${emptyText}</li>`;
    return;
  }

  lista.innerHTML = tasks.map(t => `
    <li id="task-${t.id}" data-title="${escapeHtml(t.title)}" data-userid="${t.user_id}">
      <div class="task-info">
        <div class="task-id">#${t.id}</div>
        <div class="task-title">${escapeHtml(t.title)}</div>
        <div class="task-owner">${escapeHtml(t.name)}</div>
      </div>
      <button class="btn-edit" onclick="mostrarEdicion(${t.id})">Editar</button>
    </li>
  `).join("");
}

function mostrarEdicion(id) {
  const li = document.getElementById(`task-${id}`);
  const currentTitle  = li.dataset.title;
  const currentUserId = parseInt(li.dataset.userid);

  const optionsHtml = allUsers.map(u =>
    `<option value="${u.id}" ${u.id === currentUserId ? "selected" : ""}>#${u.id} — ${escapeHtml(u.name)}</option>`
  ).join("");

  li.innerHTML = `
    <div class="edit-form">
      <input id="edit-title-${id}" value="${escapeHtml(currentTitle)}" placeholder="Título"
             oninput="this.classList.remove('error')" />
      <select id="edit-user-${id}" oninput="this.classList.remove('error')">${optionsHtml}</select>
      <div class="edit-actions">
        <button class="btn-save"   onclick="guardarEdicion(${id})">Guardar</button>
        <button class="btn-cancel" onclick="cargarTareas()">Cancelar</button>
      </div>
    </div>
  `;
}

async function guardarEdicion(id) {
  const titleInput = document.getElementById(`edit-title-${id}`);
  const userSelect = document.getElementById(`edit-user-${id}`);
  const title   = titleInput.value.trim();
  const user_id = userSelect.value;

  let valid = true;
  if (!title)   { titleInput.classList.add("error");  valid = false; }
  if (!user_id) { userSelect.classList.add("error"); valid = false; }
  if (!valid) return;

  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, user_id })
  });

  await cargarTareas();
}

cargarUsuarios();
cargarTareas();
