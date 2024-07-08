const express = require("express");
const fs = require("fs");
const PORT = 3001;
const server = express();
// middleware to parse  JSON
server.use(express.json());
// Function to read database
function readDatabase() {
  const data = fs.readFileSync("./db.json");
  return JSON.parse(data);
}
// function to write to database
function writeDatabase(data) {
  fs.writeFileSync("./db.json", JSON.stringify(data));
}
// get all todos
server.get("/todos", (req, res) => {
  const data = readDatabase();
  console.log(data);
  res.json(data.todos);
});
// add new todos
server.post("/todos", (req, res) => {
  const data = readDatabase();
  console.log("data from db.json", data);
  const newTodo = {
    id: data.todos.length ? data.todos[data.todos.length - 1].id + 1 : 1, //if last length = 2 (db.todos.length-1) +1 then id:3 if lentgth is grater than 0
    task: req.body.task,
    status: false,
  };
  data.todos.push(newTodo);
  writeDatabase(data);
  console.log("new +old todos", data);
  res.json(newTodo);
});
// Update status of even ID todos
server.put("/todos/update-even", (req, res) => {
  const data = readDatabase();
  data.todos.forEach((todo) => {
    if (todo.id % 2 === 0 && !todo.status) {
      todo.status = true; //An API to update the status of all the todos that have even ID from false to true. This will work only if the todo with even ID has a status as false.
    }
  });
  writeDatabase(data);
  res.json({ message: "Updated even ID todos" });
});
// detele todos
server.delete("/todos", (req, res) => {
  const data = readDatabase();
  const deletedData = data.todos.filter((todo) => !todo.status);
  writeDatabase(deletedData);
  res.json({ message: "Deleted todos with status true" });
});
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
