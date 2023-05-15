import React , {useState, useEffect} from "react";
import Button from "../common/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

// TODO: 로그인된 상태에서 AUTH TOKEN 들고다녀야함

function ConvertBar() {
  const navigate = useNavigate();
  const isLoggedin = !!localStorage.getItem("access_token");
  const location = useLocation()
  
  const handleConversationPageClick = () => {
    navigate('/comm')
  }

  const handleRecordPageClick = () => {
    navigate('/records')
  }

  const [isSettingClickFocused, setIsSettingClickFocused] = useState(true);
  const [isFavClickFocused, setIsFavClickFocused] = useState(false);

  const SettingClick = () => {
    setIsSettingClickFocused(true);
    setIsFavClickFocused(false);
    navigate("/mypage/settings");

  }
  useEffect(() => {
    // console.log(location.pathname) 
    const parseurl = (location.pathname.split('/mypage/')[1])
    console.log(parseurl)
    // TODO: stringfy처리해야함 
     // function check() {
    //   if (parseurl === 'settings') 
    //  return setIsSettingClickFocused(true) 
    //  else {
    //     return setIsSettingClickFocused(false);
    //   }
    // }
    // console.log(check)
  }, [location.pathname]);

  const FavClick = () => {
    setIsFavClickFocused(true);
    setIsSettingClickFocused(false);
    navigate("/mypage/favcontents");
  }

  


  // 로그인된 상태에서만 MyPage로 이동
  // const handleMypageClick = () => {
  //   if (isLoggedin) {
  //     navigate("/mypage");
  //   } else {
  //     로그인되어 있지 않은 경우 로그인 모달이뜨도록 처리
  //     navigate("/login");
  //     setLoginModal(true);
  //   }
  // };

  // TODO: 클릭하자마자 바로 변경되어야해 
  return (
    <>
      <div className="fixed right-0 w-[76%] h-16 mt-6 mx-10 rounded-t-2xl shadow-gray-200 shadow-md">
        <div className="flex h-8 pt-4 px-4 mx-4 justify-start text-xl">
          {isSettingClickFocused ? (
            <>
            <button onClick={SettingClick} 
            className="flex flex-row justify-between h-10 hover:cursor-pointer border-b-4 border-blue-main text-blue-main"
              >  
              <div className="flex flex-row text-2xl font-light">
                <Cog6ToothIcon className="m-1 mr-2 h-6 w-6" />
                내 프로필
              </div>
            </button>
            <button onClick={FavClick} 
              className=
              "flex flex-row justify-between h-10 hover:cursor-pointer text-black ml-4"
              >
              <div className="flex flex-row text-2xl font-light">
                <BookmarkIcon className="m-1 mr-2 h-6 w-6" />
                자주쓰는 말 
              </div>
            </button>
              </>
          ) : isFavClickFocused ? (
            <>
            <button onClick={SettingClick} 
            className="flex flex-row justify-between h-10 hover:cursor-pointer hover:text-blue-main text-black"
            >  
              <div className="flex flex-row text-2xl font-light">
                <Cog6ToothIcon className="m-1 mr-2 h-6 w-6" />
                내 프로필
              </div>
            </button>
            <button 
              onClick={FavClick} 
              className=
              "flex flex-row justify-between h-10 border-b-4 border-blue-main text-blue-main ml-4"
              >
              <div className="flex flex-row text-2xl font-light">
                <BookmarkIcon className="m-1 mr-2 h-6 w-6" />
                자주쓰는 말 
              </div>
            </button>
              </>
          ) : (
            <>
              <button onClick={SettingClick} 
              className="flex flex-row justify-between h-10 hover:cursor-pointer hover:text-blue-main text-black"
              >  
                <div className="flex flex-row text-2xl font-light">
                  <Cog6ToothIcon className="m-1 mr-2 h-6 w-6" />
                  내 프로필
                </div>
              </button>
              <button 
                onClick={FavClick} 
                className=
                "flex flex-row justify-between h-10 hover:cursor-pointer hover:text-blue-main text-black ml-4"
                >
                <div className="flex flex-row text-2xl font-light">
                  <BookmarkIcon className="m-1 mr-2 h-6 w-6" />
                  자주쓰는 말 
                </div>
              </button>
            </> 
          )}
        </div>
      </div>
    </>
  );
}

export default ConvertBar;