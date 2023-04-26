import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar/Navbar";
import MyPage from "@/pages/MyPage";
import RecordsPage from "@/pages/RecordsPage";
import CommunicationPage from "@/pages/CommunicationPage";
import { SelectedPage } from "@/types/types";


// 캐러셀 적용해야하하고
// 로고누르면 메인으로 이동
function MainPage() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Mypage
    );
    const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY === 0) {
          setIsTopOfPage(true);
          setSelectedPage(SelectedPage.Mypage);
        }
        if (window.scrollY !== 0) setIsTopOfPage(false);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    return (
      <div>
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <MyPage/>
      {/* <RecordsPage/> */}
      <CommunicationPage/>
      </div>
      )
  } 
    
    
export default MainPage;