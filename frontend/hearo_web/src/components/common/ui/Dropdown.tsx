import { useAppDispatch } from "@/redux/hooks";
import { updateUserSetting } from "@/redux/modules/profile";
import React, { useEffect, useState } from "react";

interface DropDownProps {
  showGenDropDown: boolean;
  toggleDropDown: Function;
  gender: string[];
  genderSelection: Function;
}

function DropDown({ gender, genderSelection }: DropDownProps) {
  const [showGenDropDown, setShowGenDropDown] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  /**
   * 젠더 설정
   * 부모 컴포넌트로 이동
   *
   * @param gender
   * @param fontsize
   */
  const onClickGenderHandler = (index: number, gender: string): void => {
    genderSelection(gender);
    dispatch(updateUserSetting(index + 1));
  };

  useEffect(() => {
    setShowGenDropDown(showGenDropDown);
  }, [showGenDropDown]);

  return (
    <>
      {gender && (
        <div
          className={showGenDropDown ? "dropdown py-2" : "dropdown active mt-2"}
        >
          {gender.map((gender: string, index: number): JSX.Element => {
            return (
              <p
                className="rounded-xl py-2 hover:bg-blue-300"
                key={index}
                onClick={(): void => {
                  onClickGenderHandler(index, gender);
                }}
              >
                {gender}
              </p>
            );
          })}
        </div>
      )}
    </>
  );
}

export default DropDown;
