import React from "react";

const Button = ({ className, text, buttonType, onClick, disabled }) => {
  return (
    <button
      type={buttonType}
      className={className}
      onClick={onClick}
      disabled={disabled ? disabled : false}
    >
      {text}
    </button>
  );
};

export default Button;
