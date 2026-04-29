const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/", (req, res) => {
  const { title, user_id } = req.body;
  db.run(
    "INSERT INTO tasks(title, user_id) VALUES(?, ?)",
    [title, user_id],
    function(err) {
      if (err) return res.status(400).send(err);
      res.send({ id: this.lastID, title, user_id });
    }
  );
});

router.get("/", (req, res) => {
  db.all(`
    SELECT tasks.id, tasks.title, tasks.user_id, users.name
    FROM tasks
    JOIN users ON tasks.user_id = users.id
  `, [], (err, rows) => {
    if (err) return res.status(400).send(err);
    res.send(rows);
  });
});

router.put("/:id", (req, res) => {
  const { title, user_id } = req.body;
  db.run(
    "UPDATE tasks SET title = ?, user_id = ? WHERE id = ?",
    [title, user_id, req.params.id],
    function(err) {
      if (err) return res.status(400).send(err);
      res.send({ id: req.params.id, title, user_id });
    }
  );
});

module.exports = router;
