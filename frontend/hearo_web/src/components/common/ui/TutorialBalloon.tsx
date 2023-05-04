import React, { useState } from "react";

interface HighlightDescriptionProps {
  direction: 'top' | 'right' | 'bottom' | 'left';
  content: string;
}

function TutorialBalloon({direction, content}: HighlightDescriptionProps) {
  return (
    <div
      className={
        direction === 'left' || direction === 'right'
          ? direction === 'left'
            ? 'flex justify-center items-center z-[200] max-w-[250px] popover-left relative'
            : 'flex justify-center items-center z-[200] max-w-[250px] popover-right relative'
          : direction === 'bottom'
          ? 'flex flex-col justify-center items-center z-[200] max-w-[320px] popover-bottom relative'
          : 'flex flex-col justify-center items-center z-[200] max-w-[320px] popover-top relative'
      }
    >
      <div className='z-[200] flex items-center px-3 py-2 text-xl rounded-xl bg-bgColor-100 relative'>
        {content}
      </div>
    </div>
  );
};

export default TutorialBalloon;