import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  const inputHandler = (e) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "description") {
      setDescription(e.target.value);
    }
  };

  const taskSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Task submitted:", { title, description });
    await fetch("http://localhost:8000/api/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Task created:", data))
      .catch((error) => console.error("Error:", error));
    setTitle("");
    setDescription("");
    getTasks();
  };

  const getTasks = async () => {
    // Fetch tasks from the backend API
    await fetch("http://localhost:8000/api/tasks/")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <nav>
        <h2>Task Manager</h2>
      </nav>

      <div className="container">
        <div className="add-task">
          <h3>Add Task +</h3>
          <form onSubmit={taskSubmitHandler}>
            <input
              type="text"
              name="title"
              value={title}
              placeholder="Task title"
              onChange={inputHandler}
              required
            />
            <input
              type="text"
              name="description"
              value={description}
              placeholder="description"
              onChange={inputHandler}
              required
            />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="task-list">
          <h3>Task List</h3>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <input type="checkbox" id="scales" name="scales" />
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
