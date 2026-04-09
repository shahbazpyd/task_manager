import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

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

  const changeStatus = async (e) => {
    const taskId = e.target.id;
    const task = tasks.find((t) => t.id === parseInt(taskId));
    console.log("Changing status for task:", task);
    const newStatus = task.status === "pending" ? "completed" : "pending";

    await fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Task updated:", data))
      .catch((error) => console.error("Error:", error));

    getTasks();
  };

  async function deleteHandler(id) {
    await fetch(`http://localhost:8000/api/tasks/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({status: "deleted"}),
    })
      .then(() => console.log("Task deleted"))
      .catch((error) => console.error("Error:", error));
    getTasks();
  }

  const editHandler = async (e) => {
    e.preventDefault();
    console.log("editingTaskId", editingTaskId);
    let id = editingTaskId;
    const task = tasks.find((t) => t.id === id);
    await fetch(`http://localhost:8000/api/tasks/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, title, description }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Task updated:", data))
      .catch((error) => console.error("Error:", error));
    getTasks();
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
  };

  return (
    <>
      <nav>
        <h2>Task Manager</h2>
      </nav>

      <div className="container">
        <div className="add-task">
          <h3>{editingTaskId ? "Edit Task" : "Add Task"}</h3>
          <form onSubmit={editingTaskId ? editHandler : taskSubmitHandler}>
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
            <button type="submit">{editingTaskId ? "Update" : "Add"}</button>
            <button
              onClick={() => {
                setEditingTaskId(null);
                setTitle("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          </form>
        </div>

        <div className="task-list">
          <table>
            <thead>
              <tr>
                <th>Done</th>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Update/Delete</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <input
                      type="checkbox"
                      id={task.id}
                      name="scales"
                      checked={task.status === "completed"}
                      onChange={changeStatus}
                    />
                  </td>
                  <td>{task.id}</td>
                  <td>
                    {task.status === "deleted" ? <del>{task.title}</del> : <b>{task.title}</b>}
                  </td>
                  <td>{task.status === "deleted" ? <del>{task.description}</del> : <p>{task.description}</p>}</td>
                  <td>
                    <button
                      onClick={() => {
                        setTitle(task.title);
                        setDescription(task.description);
                        setEditingTaskId(task.id);
                      }}
                    >
                      Update
                    </button>
                    <button onClick={() => deleteHandler(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
