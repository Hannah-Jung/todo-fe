import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PasswordField from "../components/common/PasswordField";
import api from "../utils/api";
import { isValidEmail } from "../utils/validation";
import "./LoginPage.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    if (!name.trim()) {
      setNameError("Please enter your name");
      return;
    }
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }
    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }
    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    try {
      const response = await api.post("/user", { name, email, password });
      if (response.status === 200) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const message = err?.error || err?.message || "Something went wrong";
      setEmailError(message);
    }
  };

  return (
    <div className="auth-page display-center">
      <Form className="login-box" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            isInvalid={!!nameError}
          />
          {nameError && (
            <Form.Control.Feedback
              type="invalid"
              className="d-block"
              role="alert"
            >
              {nameError}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            onBlur={() => {
              if (!email.trim()) setEmailError("");
              else if (!isValidEmail(email))
                setEmailError("Invalid email format");
              else setEmailError("");
            }}
            isInvalid={!!emailError}
          />
          {emailError && (
            <Form.Control.Feedback
              type="invalid"
              className="d-block"
              role="alert"
            >
              {emailError}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <PasswordField
          label="Password"
          placeholder="Create a password"
          controlId="formBasicPassword"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          onBlur={() => {
            if (password && password.length < 4) {
              setPasswordError("Password must be at least 4 characters");
            } else if (password.length >= 4) {
              setPasswordError("");
            }
          }}
          error={passwordError}
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Re-enter your password"
          controlId="formConfirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError("");
          }}
          onBlur={() => {
            if (confirmPassword && confirmPassword !== password) {
              setConfirmPasswordError("Passwords do not match");
            } else if (confirmPassword && confirmPassword === password) {
              setConfirmPasswordError("");
            }
          }}
          error={confirmPasswordError}
        />
        <div className="button-box">
          <Button className="btn-primary" type="submit">
            Sign Up
          </Button>
          <span>
            Already a member?{" "}
            <Link to="/login" className="auth-link-button">
              Log In
            </Link>
          </span>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
