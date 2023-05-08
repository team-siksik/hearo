import React, { SetStateAction } from "react";

//BackgroundHider.tsx
interface BackgroundHiderProps {
  tutorialCounter: React.Dispatch<React.SetStateAction<number>>;
}

function BackgroundHider({ tutorialCounter} : BackgroundHiderProps) {
  const clickBackground = () => {
    tutorialCounter((prev) => ++prev);
  };

  return (
    <div
      className='absolute top-0 bottom-0 left-0 right-0 z-50 h-screen bg-black/80'
      onClick={clickBackground}
    />
  );
};

export default BackgroundHider;