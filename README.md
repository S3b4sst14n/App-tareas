# App Tareas

Aplicación web CRUD para gestionar usuarios y tareas. Backend con Node.js y Express, base de datos SQLite, frontend en HTML/CSS/JavaScript puro.

## Requisitos

- Node.js 18 o superior

## Instalación y uso

```bash
npm install
npm start
```

La app queda disponible en `http://localhost:3000`.

La base de datos (`database.db`) se crea automáticamente en la raíz del proyecto al primer arranque.

## Funcionalidades

- Crear usuarios y listarlos
- Crear tareas asignadas a un usuario mediante un dropdown
- Validación de campos vacíos en todos los formularios
- Filtro de búsqueda de tareas por ID o por nombre (en tiempo real)
- Edición inline de cualquier tarea (título y usuario asignado)

## Estructura del proyecto

```
├── server.js          # Punto de entrada Express
├── database.js        # Conexión SQLite y creación de tablas
├── routes/
│   ├── users.js       # GET /users · POST /users
│   └── tasks.js       # GET /tasks · POST /tasks · PUT /tasks/:id
└── public/
    ├── index.html     # Interfaz de usuario
    ├── app.js         # Lógica del navegador
    └── styles.css     # Estilos
```

## API

| Método | Ruta           | Descripción                        |
|--------|----------------|------------------------------------|
| GET    | /users         | Lista todos los usuarios           |
| POST   | /users         | Crea un usuario `{ name }`         |
| GET    | /tasks         | Lista tareas con nombre de usuario |
| POST   | /tasks         | Crea una tarea `{ title, user_id }`|
| PUT    | /tasks/:id     | Edita una tarea `{ title, user_id }`|

## Documentación

El proyecto incluye dos scripts para generar documentación en PDF:

```bash
node generate-pdf.js         # PDF con formato visual
node generate-pdf-simple.js  # PDF en texto plano
```
