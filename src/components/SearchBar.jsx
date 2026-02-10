import { useRef, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Search, X } from "lucide-react";
import Button from "./common/Button";
import "./SearchBar.css";

function SearchBar({ value, onChange, onClear, isOpen, onToggle }) {
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        const iconButton = document.querySelector(".search-toggle-button");
        if (iconButton && iconButton.contains(event.target)) {
          return;
        }
        if (value.trim()) {
          return;
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
      ref={searchRef}
      className={`search-container ${isOpen ? "open" : "closed"}`}
    >
      <Row className="search-row align-items-center">
        <Col xs={12}>
          <div className="box-container search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search here"
              className="input-box input-inline search-input"
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onClear();
                  onToggle();
                }
              }}
              autoFocus
            />
            <Button
              variant="icon"
              size="small"
              icon={<X size={20} />}
              onClick={() => {
                onClear();
                onToggle();
              }}
              title="Close"
              className="btn-cancel"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SearchBar;
