import { useRef, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Plus, SquarePen } from "lucide-react";
import Button from "./common/Button";
import "./AddTaskForm.css";

function AddTaskForm({ value, onChange, onSubmit, isOpen, onToggle, onClear }) {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("");
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
    } else {
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!value.trim()) {
      setErrorMessage("Enter your task first");
      return;
    }
    setErrorMessage("");
    onSubmit();
  };

  const handleChange = (e) => {
    onChange(e);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <div
      ref={formRef}
      className={`add-container ${isOpen ? "open" : "closed"}`}
    >
      <Row className="add-item-row align-items-center">
        <Col xs={12}>
          <div className="box-container add-task-wrapper">
            <SquarePen size={20} className="add-task-input-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Add your task here"
              className={`input-box input-inline add-task-input ${errorMessage ? "is-invalid" : ""}`}
              value={value}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
                if (e.key === "Escape") {
                  setErrorMessage("");
                  onToggle();
                }
              }}
              autoFocus
            />
            <Button
              variant="icon"
              size="small"
              icon={<Plus size={20} />}
              onClick={handleSubmit}
              title="Add"
              className="button-add-inline"
            />
          </div>
          {errorMessage && (
            <div className="add-task-error" role="alert">
              {errorMessage}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default AddTaskForm;
