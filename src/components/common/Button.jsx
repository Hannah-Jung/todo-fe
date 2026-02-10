import React from "react";
import "./Button.css";

const Button = ({
  variant = "primary",
  size = "medium",
  children,
  icon,
  label,
  showLabelOnHover = false,
  isActive = false,
  className = "",
  ...props
}) => {
  const baseClass = "app-button";
  const variantClass = `app-button-${variant}`;
  const sizeClass = `app-button-${size}`;
  const activeClass = isActive ? "app-button-active" : "";
  const hoverLabelClass = showLabelOnHover ? "app-button-hover-label" : "";

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    activeClass,
    hoverLabelClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {icon && <span className="app-button-icon-content">{icon}</span>}
      {label && <span className="app-button-label">{label}</span>}
      {children}
    </button>
  );
};

export default Button;
