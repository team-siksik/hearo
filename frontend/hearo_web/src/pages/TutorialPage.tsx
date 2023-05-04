// import React, {useState, useEffect} from "react";
// import TutorialBalloon from "@/components/common/ui/TutorialBalloon";
// import { BackgroundHider } from "@/components";


// function TutorialPage() {

//   const TUTORIAL_DONE = 4; //해당 페이지에서 강조할 요소의 개수

//   const [count, setCount] = useState(0); //현재 튜토리얼 단계를 가진 상태
  
//   const tutorialCounter = (callback) => {
//     setCount(callback);
//   };

//   useEffect(() => {
//     if (count === TUTORIAL_DONE) {
//       tutorialCounter((prev) => ++prev);
//       return;
//     }
//   }, [count]);
  
//   return (
//     <div>
//   {count === 0 && ( //처음 보여줄 요소의 말풍선
//     <TutorialBalloon
//       direction='right'
//       content='버튼을 클릭하면 정보를 수정할 수 있어요'
//       />
//   )}

//     </div>
//   )
// }

// export default TutorialPage;
