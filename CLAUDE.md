# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start the server (runs on http://localhost:3000)
npm start
# or
node server.js
```

There is no build step, test runner, or linter configured.

## Architecture

Full-stack CRUD app in plain JavaScript (CommonJS). No TypeScript, no bundler, no frontend framework.

**Request flow:**
1. Browser loads `public/index.html` → `public/app.js`
2. Frontend makes `fetch()` calls to `/users` and `/tasks`
3. Express routes in `routes/users.js` and `routes/tasks.js` handle requests
4. Routes call the SQLite db instance exported from `database.js`

**Key files:**
- [server.js](server.js) — Express entry point; mounts routes and serves `public/` as static files
- [database.js](database.js) — Opens `database.db` and creates the `users` and `tasks` tables on startup; exports the `db` instance used by all routes
- [routes/tasks.js](routes/tasks.js) — `GET /tasks` uses a JOIN to return tasks with their owner's name
- [public/app.js](public/app.js) — All frontend logic; functions named in Spanish (`crearUsuario`, `crearTarea`, `cargarUsuarios`, `cargarTareas`)

**Data model:**
- `users(id INTEGER PK, name TEXT)`
- `tasks(id INTEGER PK, title TEXT, user_id INTEGER FK → users.id)`

The database file `database.db` is created automatically on first run and lives in the project root.
