import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PasswordField from "../components/common/PasswordField";
import api from "../utils/api";
import { isValidEmail } from "../utils/validation";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }
    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }
    try {
      const response = await api.post("/user/login", { email, password });
      if (response.status === 200) {
        setUser(response.data.user);
        sessionStorage.setItem("token", response.data.token);
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;
        toast.success(`Welcome back, ${response.data.user?.name || "there"}!`);
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const message = err?.error || err?.message || "Something went wrong";
      setPasswordError(message);
    }
  };

  return (
    <div className="auth-page display-center">
      <Form className="login-box" onSubmit={handleLogin}>
        <h1>Login</h1>
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
          placeholder="Enter your password"
          controlId="formBasicPassword"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          error={passwordError}
        />
        <div className="button-box">
          <Button type="submit" className="btn-primary">
            Login
          </Button>
          <span>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link-button">
              Sign up
            </Link>
          </span>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
