import React, { useEffect, useState } from "react";

interface DropDownProps {
  showGenDropDown: boolean;
  showFontDropDown : boolean;
  toggleDropDown: Function;
  gender: string[];
  genderSelection: Function;
  fontsize : string[];
  fontSizeSelection: Function;
};

function DropDown ({gender, genderSelection, fontsize, fontSizeSelection}: DropDownProps) {
  const [showGenDropDown, setShowGenDropDown] = useState<boolean>(false);
  const [showFontDropDown, setShowFontDropDown] = useState<boolean>(false);

  /**
   * 젠더 설정
   * 부모 컴포넌트로 이동
   *
   * @param gender
   * @param fontsize
   */
  const onClickGenderHandler = (gender: string): void => {
    genderSelection(gender);
  };

  useEffect(() => {
    setShowGenDropDown(showGenDropDown);
  }, [showGenDropDown]);

  const onClickFontsizeHandler = (fontsize: string): void => {
    fontSizeSelection(fontsize);
  };

  useEffect(() => {
    setShowFontDropDown(showFontDropDown);
  }, [showFontDropDown]);


  return (
    <>
    {gender && (
      <div className={showGenDropDown ? 'dropdown py-2' : 'dropdown active mt-2'}>
        {gender.map(
          (gender: string, index: number): JSX.Element => {
            return (
              <p
              className='hover:bg-blue-300 rounded-xl py-2'
              key={index}
              onClick={(): void => {
                onClickGenderHandler(gender);
              }}
              >
                {gender}
              </p>
            );
          }
          )}
      </div>
      )
    }
    {fontsize && (
      <div className={showFontDropDown ? 'dropdown py-2' : 'dropdown active mt-2'}>
        {fontsize.map(
          (fontsize: string, index: number): JSX.Element => {
            let textSize = "";
            if (index === 0) {
              textSize = "작게";
            } else if (index === 1) {
              textSize = "보통";
            } else if (index === 2) {
              textSize = "크게";
            }
            return (
              <p
                className="hover:bg-blue-300 rounded-xl py-2"
                key={index}
                onClick={(): void => {
                  onClickFontsizeHandler(fontsize);
                }}
              >
                {textSize}
              </p>
            );
          }
        )}
      </div>
    )}
    </>
  );
}

export default DropDown;
