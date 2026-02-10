import { useEffect, useState, useMemo, useRef } from "react";
import Container from "react-bootstrap/Container";
import { Dropdown } from "react-bootstrap";
import {
  CircleCheckBig,
  Search,
  Plus,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import { useOptimisticUpdate } from "../hooks/useOptimisticUpdate";
import { showSnackbar, showSnackbarWithUndo } from "../utils/Snackbar.jsx";
import api from "../utils/api";
import TodoBoard from "../components/TodoBoard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AddTaskForm from "../components/AddTaskForm.jsx";
import Loader from "../components/common/Loader.jsx";
import Button from "../components/common/Button";
import "./TodoPage.css";
import "../utils/Snackbar.css";

function TodoPage({ logout, user }) {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const isLoadingTasksRef = useRef(false);

  const filteredList = useMemo(
    () =>
      todoList.filter((item) =>
        item.task.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      ),
    [todoList, searchQuery],
  );

  useEffect(() => {
    getTasks();
  }, []);

  const { toggleComplete, updateTask, deleteItem } = useOptimisticUpdate(
    todoList,
    setTodoList,
  );
  const getTasks = async (silent = false) => {
    if (isLoadingTasksRef.current && !silent) return;

    try {
      if (!silent) {
        setIsLoading(true);
        isLoadingTasksRef.current = true;
      }
      const response = await api.get("/tasks");
      setTodoList(response.data.data);
    } catch (err) {
      if (!silent) {
        showSnackbar(err?.error || "Failed to load");
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
        isLoadingTasksRef.current = false;
      }
    }
  };

  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        setTodoValue("");
        getTasks(true);
      } else {
        throw new Error("Task cannot be added");
      }
    } catch (err) {
      showSnackbar(err?.error || "Failed to add");
    }
  };

  const clearCompleted = async () => {
    try {
      const completedIds = todoList
        .filter((item) => item.isComplete)
        .map((i) => i._id);
      if (completedIds.length === 0) return;

      await Promise.all(completedIds.map((id) => api.delete(`/tasks/${id}`)));
      getTasks(true);
      showSnackbar("All completed tasks have been deleted");
    } catch (error) {
      showSnackbar(error?.error || "Failed to clear");
    }
  };
  const restoreTask = async (task) => {
    try {
      await api.post("/tasks", {
        task: task.task,
        isComplete: task.isComplete ?? false,
        ...(task.createdAt && { createdAt: task.createdAt }),
        ...(task.lastTextEditedAt && {
          lastTextEditedAt: task.lastTextEditedAt,
        }),
      });
      getTasks(true);
    } catch (err) {
      showSnackbar(err?.error || "Failed to restore");
    }
  };

  return (
    <Container className="page-transition">
      <div style={{ flexShrink: 0, textAlign: "center", width: "100%" }}>
        <h1 className="title">
          <span className="title-text">CHECK IT</span>
          <span className="title-icon">
            <CircleCheckBig strokeWidth={2.5} />
          </span>
          <span className="title-text">FF</span>
        </h1>
        <div className="icon-buttons-row">
          <Button
            variant="toggle"
            icon={<Plus size={24} />}
            label="ADD"
            showLabelOnHover
            isActive={isAddOpen}
            onClick={() => {
              setSearchQuery("");
              setIsSearchOpen(false);
              setSelectedTab("all");
              setIsAddOpen(!isAddOpen);
            }}
            title="Add Task"
            className="add-toggle-button"
          />
          <Button
            variant="toggle"
            icon={<Search size={24} />}
            label="SEARCH"
            showLabelOnHover
            isActive={isSearchOpen}
            onClick={() => {
              const willOpen = !isSearchOpen;
              setIsSearchOpen(willOpen);
              if (willOpen) setSelectedTab("all");
            }}
            title="Search"
            className="search-toggle-button"
          />

          <div className="account-menu-wrapper">
            <Dropdown align="start" className="account-menu-dropdown">
              <Dropdown.Toggle
                variant="light"
                id="account-menu-toggle"
                className="account-menu-toggle"
                title={user?.name || ""}
              >
                {user?.name ? (
                  <span className="account-avatar-letter">
                    {user.name.trim()[0]?.toUpperCase() || "?"}
                  </span>
                ) : (
                  <CircleUserRound size={24} className="account-menu-icon" />
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="account-dropdown-menu">
                <Dropdown.ItemText className="account-menu-name">
                  {user?.name || "User"}
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item
                  eventKey="logout"
                  onClick={() => {
                    logout();
                  }}
                  className="account-menu-item"
                >
                  <LogOut size={18} />
                  <span>LOGOUT</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
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
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
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
