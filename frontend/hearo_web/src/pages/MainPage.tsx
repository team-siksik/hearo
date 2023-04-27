import React, { useState} from "react";
import Navbar from "@/components/common/Navbar/Navbar";
import { SelectedPage } from "@/types/types";


// 캐러셀 적용해야하하고
// 로고누르면 메인으로 이동



function MainPage() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.CommunicationPage);

    return (
      <div className="bg-gray-600">
      <Navbar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      <div>
        메인페이지 해줘~~~ 
      </div>
      </div>
      )
  } 
    
    
export default MainPage;