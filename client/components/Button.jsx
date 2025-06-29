import React from "react";

const Button = ({ className, text, buttonType, onClick }) => {
  return (
    <button type={buttonType} className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
