import React, { useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import { BrushCleaning } from "lucide-react";

const TodoBoard = ({
  todoList,
  toggleComplete,
  deleteItem,
  searchQuery,
  clearCompleted,
  updateTask,
}) => {
  const [selectedTab, setSelectedTab] = useState("all");

  const counts = useMemo(
    () => ({
      all: todoList.length,
      active: todoList.filter((item) => !item.isComplete).length,
      completed: todoList.filter((item) => item.isComplete).length,
    }),
    [todoList],
  );

  const filteredByTab = useMemo(() => {
    let result;
    if (selectedTab === "active")
      result = todoList.filter((item) => !item.isComplete);
    else if (selectedTab === "completed")
      result = todoList.filter((item) => item.isComplete);
    else {
      result = [...todoList].sort((a, b) => {
        if (a.isComplete !== b.isComplete) {
          return a.isComplete ? 1 : -1;
        }
        if (a.isComplete && b.isComplete) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        return 0;
      });
    }
    return result;
  }, [todoList, selectedTab]);

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div>
      <h5>TASKS</h5>
      <div className="todo-tabs">
        <button
          className={`todo-tab ${selectedTab === "all" ? "active" : ""}`}
          onClick={() => setSelectedTab("all")}
        >
          ALL ({counts.all})
        </button>
        <button
          className={`todo-tab ${selectedTab === "active" ? "active" : ""}`}
          onClick={() => setSelectedTab("active")}
        >
          ACTIVE ({counts.active})
        </button>
        <button
          className={`todo-tab ${selectedTab === "completed" ? "active" : ""}`}
          onClick={() => setSelectedTab("completed")}
        >
          COMPLETED ({counts.completed})
        </button>
      </div>

      {selectedTab === "completed" && counts.completed > 0 && (
        <div style={{ textAlign: "right", marginBottom: "0.5rem" }}>
          <button
            className="todo-tab"
            onClick={clearCompleted}
            title="Clear Completed Tasks"
          >
            <BrushCleaning size={20} />
          </button>
        </div>
      )}

      {filteredByTab.length > 0 ? (
        filteredByTab.map((item) => (
          <TodoItem
            item={item}
            key={item._id}
            deleteItem={deleteItem}
            toggleComplete={toggleComplete}
            updateTask={updateTask}
          />
        ))
      ) : hasQuery ? (
        <h2 className="no-result-msg">
          No results with "{searchQuery.trim()}"
        </h2>
      ) : (
        <h2 className="no-result-msg">No tasks yet</h2>
      )}
    </div>
  );
};

export default TodoBoard;
