import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import { Undo, Check, Trash } from "lucide-react";
import Button from "./common/Button";
import timeStamps from "../utils/timeStamps";
import { showSnackbarWithUndo } from "../utils/Snackbar.jsx";
import "./TodoItem.css";

function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const isMatch = part.toLowerCase() === query.toLowerCase();
    return isMatch ? (
      <span key={`hl-${i}-${part.slice(0, 8)}`} className="search-highlight">
        {part}
      </span>
    ) : (
      part
    );
  });
}

const TodoItem = ({
  item,
  searchQuery = "",
  toggleComplete,
  deleteItem,
  restoreTask,
  updateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.task);
  const textareaRef = useRef(null);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const maxHeight = parseFloat(getComputedStyle(el).maxHeight);
    const next = Math.min(
      el.scrollHeight,
      isNaN(maxHeight) ? el.scrollHeight : maxHeight,
    );

    el.style.height = `${next}px`;
  };

  useEffect(() => {
    if (isEditing) {
      setTimeout(autoGrow, 0);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(item.task);
  }, [item.task]);

  const hasBeenEdited = !!item.lastTextEditedAt;
  const displayTime = hasBeenEdited ? item.lastTextEditedAt : item.createdAt;

  const handleSave = () => {
    if (!editValue.trim()) {
      handleCancel();
      return;
    }
    if (editValue.trim() !== item.task) {
      updateTask(item._id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(item.task);
    setIsEditing(false);
  };

  const handleDeleteWithUndo = async () => {
    const deleted = await deleteItem(item._id);
    if (deleted && restoreTask) {
      showSnackbarWithUndo("Task deleted", () => restoreTask(deleted));
    }
    return deleted;
  };

  const handleDelete = async () => {
    await handleDeleteWithUndo();
    setIsEditing(false);
  };
  return (
    <>
      <Row className="todo-item-row align-items-stretch">
        <Col xs={12}>
          <div
            className={`box-container todo-item ${item.isComplete ? "item-complete" : ""}`}
          >
            <div
              className="todo-content"
              onClick={() => !item.isComplete && setIsEditing(true)}
              style={{ cursor: item.isComplete ? "default" : "pointer" }}
            >
              {searchQuery.trim()
                ? highlightMatch(item.task, searchQuery.trim())
                : item.task}
            </div>
            <div className="d-flex flex-row align-items-center  todo-item-actions">
              {item.isComplete ? (
                <Button
                  variant="icon"
                  size="small"
                  icon={<Undo size={20} />}
                  onClick={() => toggleComplete(item._id)}
                  title="Undo"
                  className="btn-undo"
                />
              ) : (
                <Button
                  variant="icon"
                  size="small"
                  icon={<Check size={20} />}
                  onClick={() => toggleComplete(item._id)}
                  title="Done"
                  className="btn-done"
                />
              )}

              <Button
                variant="icon"
                size="small"
                icon={<Trash size={20} />}
                onClick={handleDeleteWithUndo}
                title="Delete"
                className="btn-delete"
              />
            </div>
          </div>
          <div className="todo-created-at">
            <span
              title={
                hasBeenEdited ? `Created ${timeStamps(item.createdAt)}` : ""
              }
            >
              {hasBeenEdited && (
                <span style={{ fontSize: "0.7rem", color: "gray" }}>
                  Edited{" "}
                </span>
              )}
              {timeStamps(displayTime)}
            </span>
            {item.author?.name && ` · by ${item.author.name}`}
          </div>
        </Col>
      </Row>
      <Modal
        show={isEditing}
        onHide={handleCancel}
        centered
        className="app-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            ref={textareaRef}
            className="todo-edit-textarea"
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              autoGrow();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
            }}
            rows={2}
          />
          <div className="todo-edit-timestamps">
            {hasBeenEdited && (
              <div>Edited {timeStamps(item.lastTextEditedAt)}</div>
            )}
            <div>Created {timeStamps(item.createdAt)}</div>
          </div>
        </Modal.Body>
        <Modal.Footer className="app-modal-footer app-modal-footer-edit">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <div className="app-modal-footer-actions">
            <Button variant="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoItem;
