import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Test from "@/assets/headphone.png"
import Test1 from "@/assets/Hearo_logo.png"
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { SelectedPage } from "@/types/types";

// interface PropsType {
//   children: React.ReactNode;
// }

type Props = {
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
}

const Navbar = ({selectedPage, setSelectedPage }: Props) => {
  const navigate = useNavigate();
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navbarBackground = "bg-primary-100 drop-shadow";
  const links = [
    { name: "대화 시작하기", to: "comm", id:1},
    { name: "대화 참여하기", to: "comm", id:2},
    { name: "기록 확인하기", to: "records", id:3},
    // 로그아웃 만들어야 함
    // { name: "대화 시작하기", to: "records", id:4}
  ]

  const homeClick = () => {
    navigate('/');
  }
  const handleSettingsClick = () => {
    navigate('/setting');
    setIsMenuToggled(false);
  };

  const handleLogoutClick = () => {
    navigate('/logout');
    setIsMenuToggled(false);
  };

  const sideVariants = {
    open: {
      transition: {
        duration:0.2,
      },
      width: 250
    },
    closed: {
      transition: {
        duration:0.2,
      },
      width: 0
    }
  };
  
  const itemVariants = {
    open: { 
      opacity: 1,
    },
    closed: {
      opacity: 0,
      transition:{
       duration:0.1,
      }
    }
  };

  
  return (
    <nav>
    {/* 고정나브바 */}
    <div
      className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-2 bg-white`}
      >
      <div className={`${flexBetween} mx-auto w-11/12`}>
        <div className={`${flexBetween} w-full gap-16`}>
          {/* LEFT SIDE */}
          <img onClick={homeClick} alt="logo" src={Test1} className="h-10 w-30"/>
          <button
              className="rounded-full bg-white p-1"
              onClick={() => setIsMenuToggled(!isMenuToggled)}>
                <Bars3Icon className="h-6 w-6 text-black" />
          </button>
        </div>
      </div>
    </div>



    {/* 버튼 클릭시 오른쪽에서 나오는 상태창*/}
    <AnimatePresence>
      {isMenuToggled && (
      <motion.aside
        initial={{width: 0}}
        animate={{
          width: 250,
          transition: {
            duration:0.2
          }
        }}
        exit={{
          width: 0,
          transition: {
            duration:0.2
          }
        }}>
          <motion.div 
            className="fixed right-0 bottom-0 z-40 h-full w-[250px] bg-primary-100 drop-shadow-xl"
            initial="closed"
            animate='open'
            exit='closed'
            variants={sideVariants}
            >
            {/* CLOSE ICON */}
              <motion.div className="flex justify-end h-14 p-2" variants={itemVariants}>
                <button
                  className="rounded-full bg-white mt-1 mr-2 h-8 p-1"
                  onClick={() => setIsMenuToggled(!isMenuToggled)}>
                    <XMarkIcon className="h-6 w-6 text-black" />
                </button>
              </motion.div>

        {/* MENU ITEMS */}
        <div className="mt-[5%] ml-[25%] flex flex-col gap-10 text-2xl">
          {links.map(({ name, to, id }) => (
            <motion.a
              key={id}
              href={to}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95}}
              variants={itemVariants}
              >
              {name}
            </motion.a>
           ))}
        </div>
        <motion.div 
          className="mt-[120%] flex flex-col gap-3 text-lg"
          variants={itemVariants}
          >
          <button onClick={handleSettingsClick}>환경설정</button>
          <button onClick={handleLogoutClick}>로그아웃</button>
        </motion.div>
      </motion.div>


      </motion.aside>
      )}
    </AnimatePresence>
    </nav>
  )
}
export default Navbar;

