import React from "react";

interface PropsType {
  children: React.ReactNode;
}

function Button({ children }: PropsType) {
  return (
    <div>
      <button></button>
    </div>
  );
}

export default Button;
