import React from "react";

import "./Button.css"

type ButtonVariant =
  | "login"
  | "cardPrimary"
  | "cardSecondary"
  | "card"
  | "pagination";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, children, ...rest }) => {
  const getClassName = () => {
    switch (variant) {
      case "login":
        return "login-button";
      case "cardPrimary":
        return "card-button card-primaryButton";
      case "cardSecondary":
        return "card-button card-secondaryButton";
      case "pagination":
        return "paginationMenu-button";
      default:
        return "";
    }
  };

  return (
    <button className={getClassName()} {...rest}>
      {children}
    </button>
  );
};

export default Button;
