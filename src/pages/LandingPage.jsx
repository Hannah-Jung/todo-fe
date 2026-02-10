import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CircleCheckBig, X } from "lucide-react";
import Button from "../components/common/Button";
import "./LandingPage.css";
import "./TodoPage.css";

function LandingPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  const slides = [
    { src: "/LandingPage_Add.png", alt: "Add task" },
    { src: "/LandingPage_Edit.png", alt: "Edit task" },
    { src: "/LandingPage_ClearAll.png", alt: "Clear all task" },
    { src: "/LandingPage_Search.png", alt: "Search task" },
  ];

  const prev = () =>
    setSelectedIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setSelectedIndex((i) => (i + 1) % slides.length);

  return (
    <div className="landing-page page-transition">
      <div className="landing-content">
        <div className="landing-left">
          <h1 className="title">
            <span className="title-text">CHECK IT</span>
            <span className="title-icon">
              <CircleCheckBig strokeWidth={2.5} />
            </span>
            <span className="title-text">FF</span>
          </h1>
          <p className="landing-desc">
            A simple, responsive to-do list app designed to help you quickly
            add, edit, complete, and organize your tasks. Features include
            search, filtering, and undo support—perfect for managing tasks on
            any device.
          </p>

          <div className="landing-cta">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="cancel"
              size="large"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </div>
        </div>
        <div className="landing-slider-wrap" aria-label="App screens carousel">
          <div className="landing-slider">
            <div className="landing-slider-track">
              <div className="landing-slider-group">
                <img
                  src="/LandingPage_Add.png"
                  alt="Add task"
                  className="landing-slide"
                  onClick={() => setSelectedIndex(0)}
                  role="button"
                  tabIndex={0}
                />
                <img
                  src="/LandingPage_Edit.png"
                  alt="Edit task"
                  className="landing-slide"
                  onClick={() => setSelectedIndex(1)}
                  role="button"
                  tabIndex={0}
                />
                <img
                  src="/LandingPage_ClearAll.png"
                  alt="Clear completed"
                  className="landing-slide"
                  onClick={() => setSelectedIndex(2)}
                  role="button"
                  tabIndex={0}
                />
                <img
                  src="/LandingPage_Search.png"
                  alt="Search"
                  className="landing-slide"
                  onClick={() => setSelectedIndex(3)}
                  role="button"
                  tabIndex={0}
                />
              </div>
              <div className="landing-slider-group" aria-hidden="true">
                <img
                  src="/LandingPage_Add.png"
                  alt=""
                  className="landing-slide"
                  onClick={() => setSelectedIndex(0)}
                  role="button"
                  tabIndex={0}
                />
                <img
                  src="/LandingPage_Edit.png"
                  alt=""
                  className="landing-slide"
                  onClick={() => setSelectedIndex(1)}
                  role="button"
                  tabIndex={0}
                />
                <img
                  src="/LandingPage_ClearAll.png"
                  alt=""
                  className="landing-slide"
                  onClick={() => setSelectedIndex(2)}
                  role="button"
                  tabIndex={0}
                />
                <img
                  src="/LandingPage_Search.png"
                  alt=""
                  className="landing-slide"
                  onClick={() => setSelectedIndex(3)}
                  role="button"
                  tabIndex={0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={selectedIndex !== null}
        onHide={() => setSelectedIndex(null)}
        centered
        size="lg"
        className="landing-image-modal"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
      >
        <Modal.Body
          className="p-0 text-center"
          onClick={() => setSelectedIndex(null)}
        >
          {selectedIndex !== null && (
            <div
              className="landing-modal-nav"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="landing-modal-close"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close image viewer"
              >
                <X size={20} />
              </button>
              <span className="landing-modal-counter">
                {selectedIndex + 1} / {slides.length}
              </span>
              <button className="landing-modal-arrow left" onClick={prev}>
                ‹
              </button>
              <img
                src={slides[selectedIndex].src}
                alt={slides[selectedIndex].alt}
                className="landing-modal-image"
              />
              <button className="landing-modal-arrow right" onClick={next}>
                ›
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LandingPage;
