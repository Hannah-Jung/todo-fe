import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Undo, Check, Trash, X, Save } from "lucide-react";
import timeStamps from "../utils/timeStamps";

const TodoItem = ({ item, toggleComplete, deleteItem, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.task);

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

  return (
    <Row className="todo-item-row align-items-stretch">
      <Col xs={12}>
        <div
          className={`box-container todo-item ${item.isComplete ? "item-complete" : ""}`}
        >
          {isEditing ? (
            <>
              <input
                className="todo-edit-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                autoFocus
              />
              <div className="d-flex flex-row align-items-center">
                <button
                  className="icon-button btn-done"
                  onClick={handleSave}
                  title="Save"
                >
                  <Save size={20} />
                </button>
                <button
                  className="icon-button btn-delete"
                  onClick={handleCancel}
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="todo-content"
                onClick={() => !item.isComplete && setIsEditing(true)}
                style={{ cursor: item.isComplete ? "default" : "pointer" }}
              >
                {item.task}
              </div>
              <div className="d-flex flex-row align-items-center">
                <button
                  className={`icon-button ${item.isComplete ? "btn-undo" : "btn-done"}`}
                  onClick={() => toggleComplete(item._id)}
                  title={item.isComplete ? "Undo" : "Done"}
                >
                  {item.isComplete ? <Undo size={20} /> : <Check size={20} />}
                </button>

                <button
                  className="icon-button btn-delete"
                  onClick={() => deleteItem(item._id)}
                  title="Delete"
                >
                  <Trash size={20} />
                </button>
              </div>
            </>
          )}
        </div>
        <div className="todo-created-at">
          {hasBeenEdited && (
            <span style={{ fontSize: "0.7rem", color: "gray" }}>Edited </span>
          )}
          {timeStamps(displayTime)}
        </div>
      </Col>
    </Row>
  );
};

export default TodoItem;
