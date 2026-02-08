import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Modal, Button } from "react-bootstrap";
import { Undo, Check, Trash } from "lucide-react";
import timeStamps from "../utils/timeStamps";
import { showSnackbarWithUndo } from "../utils/Snackbar.jsx";
import "./TodoItem.css";

const TodoItem = ({
  item,
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
              {item.task}
            </div>
            <div className="d-flex flex-row align-items-center  todo-item-actions">
              <button
                className={`icon-button ${item.isComplete ? "btn-undo" : "btn-done"}`}
                onClick={() => toggleComplete(item._id)}
                title={item.isComplete ? "Undo" : "Done"}
              >
                {item.isComplete ? <Undo size={20} /> : <Check size={20} />}
              </button>

              <button
                className="icon-button btn-delete"
                onClick={handleDeleteWithUndo}
                title="Delete"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
          <div className="todo-created-at">
            {hasBeenEdited && (
              <span style={{ fontSize: "0.7rem", color: "gray" }}>Edited </span>
            )}
            {timeStamps(displayTime)}
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
        </Modal.Body>
        <Modal.Footer className="app-modal-footer app-modal-footer-edit">
          <Button className="app-modal-btn-danger" onClick={handleDelete}>
            Delete
          </Button>
          <div className="app-modal-footer-actions">
            <Button className="app-modal-btn-cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="app-modal-btn-primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoItem;
