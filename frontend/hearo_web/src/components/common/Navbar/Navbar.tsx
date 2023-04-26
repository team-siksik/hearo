import React, {useState} from "react";
import Hamburger from "@/assets/Hamburger.svg";
import Link from "./Link";
import { SelectedPage } from "@/types/types";

// interface PropsType {
//   children: React.ReactNode;
// }

type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
}

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";
  
  return (
  <nav>
    <button className="rounded-full bg-red-1 p-2"
      onClick={() => setIsMenuToggled(!isMenuToggled)}>
    </button>

  {/* MOBILE MENU MODAL */}
  {isMenuToggled && (
    <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl">
      {/* CLOSE ICON */}
      <div className="flex justify-end p-12">
        <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
          <Hamburger/>
        </button>
      </div>

      {/* MENU ITEMS */}
      <div className="ml-[33%] flex flex-col gap-10 text-2xl">

        <Link
          page="Communicationpage"
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <Link
          page="Communicationpage"
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <Link
          page="RecordsPage"
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </div>
    </div>
  )}
</nav>
)
}
export default Navbar;

