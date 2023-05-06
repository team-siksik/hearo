import React from "react";

interface PropsType {
  type?: string;
  children: React.ReactNode;
}

export default function Layout({ type, children }: PropsType) {
  if (type === "default") {
    return <div>{children}</div>;
  } else {
    return <div className="m-auto w-[90%] p-4">{children}</div>;
  }
}
