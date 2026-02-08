import "./TodoPage.css";
import TodoBoard from "../components/TodoBoard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AddTaskForm from "../components/AddTaskForm.jsx";
import Loader from "../components/common/Loader.jsx";
import Container from "react-bootstrap/Container";
import { useEffect, useState, useMemo } from "react";
import api from "../utils/api";
import { CircleCheckBig, Search, Plus } from "lucide-react";
import { useOptimisticUpdate } from "../hooks/useOptimisticUpdate";
import { showSnackbar, showSnackbarWithUndo } from "../utils/Snackbar.jsx";
import "../utils/Snackbar.css";

function TodoPage() {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredList = useMemo(
    () =>
      todoList.filter((item) =>
        item.task.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      ),
    [todoList, searchQuery],
  );

  // const getTasks = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await api.get("/tasks");
  //     setTodoList(response.data.data);
  //   } catch (err) {
  //     console.log("Error", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const getTasks = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      // await new Promise((r) => setTimeout(r, 1000));
      const response = await api.get("/tasks");
      setTodoList(response.data.data);
    } catch (err) {
      console.log("Error", err);
    } finally {
      if (!silent) setIsLoading(false);
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

  const { toggleComplete, updateTask, deleteItem } = useOptimisticUpdate(
    todoList,
    setTodoList,
  );

  const clearCompleted = async () => {
    try {
      const completedIds = todoList
        .filter((item) => item.isComplete)
        .map((i) => i._id);
      if (completedIds.length === 0) return;

      await Promise.all(completedIds.map((id) => api.delete(`/tasks/${id}`)));
      // getTasks();
      getTasks(true);
      showSnackbar("All completed tasks have been deleted");
    } catch (error) {
      console.log("error", error);
    }
  };

  const restoreTask = async (task) => {
    try {
      await api.post("/tasks", {
        task: task.task,
        isComplete: task.isComplete ?? false,
      });
      // getTasks();
      getTasks(true);
    } catch (err) {
      console.log("Error restoring task", err);
    }
  };

  return (
    <Container>
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <h1 className="title">
          <span className="title-text">CHECK IT</span>
          <span className="title-icon">
            <CircleCheckBig strokeWidth={2.5} />
          </span>
          <span className="title-text">FF</span>
        </h1>
        <div className="icon-buttons-row">
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className={`icon-button add-toggle-button${isAddOpen ? " add-toggle-open" : ""}`}
            title="Add Task"
          >
            <Plus size={24} className="add-toggle-icon" />
            <span className="add-toggle-label">ADD</span>
          </button>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`icon-button search-toggle-button${isSearchOpen ? " search-toggle-open" : ""}`}
            title="Search"
          >
            <Search size={24} className="search-toggle-icon" />
            <span className="search-toggle-label">SEARCH</span>
          </button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          isOpen={isSearchOpen}
          onToggle={() => setIsSearchOpen(!isSearchOpen)}
        />

        <AddTaskForm
          value={todoValue}
          onChange={(e) => setTodoValue(e.target.value)}
          onSubmit={() => {
            addTask();
            setIsAddOpen(false);
          }}
          isOpen={isAddOpen}
          onToggle={() => setIsAddOpen(!isAddOpen)}
          onClear={() => setTodoValue("")}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TodoBoard
          todoList={filteredList}
          toggleComplete={toggleComplete}
          updateTask={updateTask}
          deleteItem={deleteItem}
          restoreTask={restoreTask}
          searchQuery={searchQuery}
          clearCompleted={clearCompleted}
        />
      </div>
      {isLoading && <Loader />}
    </Container>
  );
}

export default TodoPage;
