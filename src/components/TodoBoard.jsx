import React, { useState, useMemo, useRef, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import { BrushCleaning, ChevronUp } from "lucide-react";
import Button from "./common/Button";
import TodoItem from "./TodoItem.jsx";
import "./TodoBoard.css";

const TodoBoard = ({
  todoList,
  searchQuery,
  selectedTab,
  setSelectedTab,
  toggleComplete,
  updateTask,
  deleteItem,
  restoreTask,
  clearCompleted,
}) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const handleClearConfirmed = () => {
    clearCompleted();
    setShowClearConfirmModal(false);
  };

  const listRef = useRef(null);

  const SCROLL_TOP_THRESHOLD = 80;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
      setShowScrollToTop(false);
    }
  }, [selectedTab]);

  const handleListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setShowScrollToTop(el.scrollTop > SCROLL_TOP_THRESHOLD);
  };

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
    <div className="todo-board-root">
      <div className="todo-tabs">
        <button
          className={`todo-tab ${selectedTab === "all" ? "active" : ""}`}
          onClick={() => setSelectedTab("all")}
        >
          <div className="todo-tab-content">
            <div>ALL</div>
            <Badge bg="lightblue" className="todo-tab-badge">
              {counts.all}
            </Badge>
          </div>
        </button>
        <button
          className={`todo-tab ${selectedTab === "active" ? "active" : ""}`}
          onClick={() => setSelectedTab("active")}
        >
          <div className="todo-tab-content">
            <div>ACTIVE</div>
            <Badge bg="lightblue" className="todo-tab-badge">
              {counts.active}
            </Badge>
          </div>
        </button>
        <button
          className={`todo-tab ${selectedTab === "completed" ? "active" : ""}`}
          onClick={() => setSelectedTab("completed")}
        >
          <div className="todo-tab-content">
            <div>COMPLETED</div>
            <Badge bg="lightblue" className="todo-tab-badge">
              {counts.completed}
            </Badge>
          </div>
        </button>
      </div>

      <div
        ref={listRef}
        onScroll={handleListScroll}
        className={`todo-list-scrollable ${
          filteredByTab.length === 0 ? "empty-state" : ""
        }`}
      >
        {filteredByTab.length > 0 ? (
          filteredByTab.map((item) => (
            <TodoItem
              item={item}
              key={item._id}
              searchQuery={searchQuery}
              deleteItem={deleteItem}
              restoreTask={restoreTask}
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
        {selectedTab === "completed" && counts.completed > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.5rem",
            }}
          >
            <Button
              variant="danger"
              size="medium"
              icon={<BrushCleaning size={20} />}
              label="CLEAR ALL"
              showLabelOnHover
              onClick={() => setShowClearConfirmModal(true)}
              title="Clear all completed tasks"
            />
          </div>
        )}
      </div>
      {showScrollToTop && (
        <div className="scroll-to-top-wrap">
          <Button
            variant="primary"
            size="large"
            icon={<ChevronUp size={24} />}
            label="TOP"
            showLabelOnHover
            onClick={() =>
              listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            }
          />
        </div>
      )}
      <Modal
        show={showClearConfirmModal}
        onHide={() => setShowClearConfirmModal(false)}
        centered
        className="app-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete all completed tasks?
        </Modal.Body>
        <Modal.Footer className="app-modal-footer app-modal-footer-end">
          <Button
            variant="cancel"
            onClick={() => setShowClearConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearConfirmed}>
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TodoBoard;
