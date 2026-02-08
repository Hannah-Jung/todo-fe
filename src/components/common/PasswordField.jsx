import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  label,
  placeholder,
  controlId,
  value,
  onChange,
  name,
  variant,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputGroup = (
    <InputGroup className="password-input-wrap">
      <Form.Control
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        {...rest}
      />
      <InputGroup.Text
        as="button"
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword((p) => !p)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        title={showPassword ? "Hide" : "Show"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </InputGroup.Text>
    </InputGroup>
  );

  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      {inputGroup}
      {error && (
        <Form.Text className="text-danger d-block" role="alert">
          {error}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default PasswordField;
