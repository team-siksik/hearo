import React, { useState } from "react";
import Navbar from "@/components/common/Navbar/Navbar";
import Carousel from "@/components/common/Carousel/Carousel";
import { SelectedPage } from "@/types/types";

function MainPage() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.CommunicationPage
  );

  return (
    <div className="bg-gray-200">
      <Navbar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="mt-14">
      <div> 
        <h1>
        안녕하세요, 김동준님
        </h1>
        <h3>
        히어로에 오신 것을 환영해요.  
        </h3>
      </div>
        <Carousel/>
      </div>
    </div>
  );
}

export default MainPage;