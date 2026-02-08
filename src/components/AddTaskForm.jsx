import { useRef, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Plus } from "lucide-react";
import "./AddTaskForm.css";

function AddTaskForm({ value, onChange, onSubmit, isOpen, onToggle, onClear }) {
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        const iconButton = document.querySelector(".add-toggle-button");
        if (iconButton && iconButton.contains(event.target)) {
          return;
        }
        if (value.trim()) {
          onClear();
        }
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle, value, onClear]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  return (
    <div
      ref={formRef}
      className={`add-container ${isOpen ? "open" : "closed"}`}
    >
      <Row className="add-item-row align-items-center">
        <Col xs={12}>
          <div className="box-container add-task-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add your task here"
              className="input-box input-inline add-task-input"
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) {
                  onSubmit();
                }
                if (e.key === "Escape") {
                  onToggle();
                }
              }}
              autoFocus
            />
            <button
              className="icon-button button-add-inline"
              onClick={onSubmit}
              disabled={!value.trim()}
              title="Add"
            >
              <Plus size={20} />
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AddTaskForm;
