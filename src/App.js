import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoBoard from "./components/TodoBoard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import api from "./utils/api";
import { Plus, Search, X, CircleCheckBig } from "lucide-react";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredList = todoList.filter((item) =>
    item.task.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const getTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tasks");
      setTodoList(response.data.data);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        console.log("Successfully added a task");
        setTodoValue("");
        getTasks();
      } else {
        throw new Error("Task cannot be added");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      if (!task) return;
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateTask = async (id, newTask) => {
    try {
      const response = await api.put(`/tasks/${id}`, {
        task: newTask,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedIds = todoList
        .filter((item) => item.isComplete)
        .map((i) => i._id);
      if (completedIds.length === 0) return;

      await Promise.all(completedIds.map((id) => api.delete(`/tasks/${id}`)));

      getTasks();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Container>
      <h1 className="title">
        CHECK IT{" "}
        <span className="title-icon">
          <CircleCheckBig size={40} strokeWidth={2.5} />
        </span>
        FF
      </h1>
      <h5>SEARCH</h5>
      <Row className="search-row align-items-center">
        <Col xs={12}>
          <div className="box-container search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search here"
              className="input-box input-inline search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="icon-button btn-cancel"
              onClick={() => setSearchQuery("")}
              title="Clear"
            >
              <X size={20} />
            </button>
          </div>
        </Col>
      </Row>
      <h5>ADD HERE</h5>
      <Row className="add-item-row align-items-center">
        <Col xs={12}>
          <div className="box-container add-task-wrapper">
            <input
              type="text"
              placeholder="Add your task here"
              className="input-box input-inline add-task-input"
              value={todoValue}
              onChange={(event) => setTodoValue(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && todoValue.trim()) {
                  addTask();
                }
              }}
            />
            <button
              className="icon-button button-add-inline"
              onClick={addTask}
              disabled={!todoValue.trim()}
              title="Add"
            >
              <Plus size={20} />
            </button>
          </div>
        </Col>
      </Row>

      <TodoBoard
        todoList={filteredList}
        toggleComplete={toggleComplete}
        updateTask={updateTask}
        deleteItem={deleteItem}
        searchQuery={searchQuery}
        clearCompleted={clearCompleted}
      />

      {isLoading && (
        <div className="loader-overlay">
          <span className="loader"></span>
        </div>
      )}
    </Container>
  );
}

export default App;
