import React, { useEffect, useState } from 'react';

interface DropDownProps {
  showDropDown: boolean;
  toggleDropDown: Function;
  gender: string[];
  genderSelection: Function;
  fontsize : string[];
  fontSizeSelection: Function;
};

function DropDown ({gender, genderSelection, fontsize, fontSizeSelection}: DropDownProps) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

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
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  const onClickFontsizeHandler = (fontsize: string): void => {
    fontSizeSelection(fontsize);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);


  return (
    <>
    {gender && (
      <div className={showDropDown ? 'dropdown py-2' : 'dropdown active mt-2'}>
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
      <div className={showDropDown ? 'dropdown py-2' : 'dropdown active mt-2'}>
        {fontsize.map(
          (fontsize: string, index: number): JSX.Element => {
            return (
              <p
              className='hover:bg-blue-300 rounded-xl py-2'
              key={index}
              onClick={(): void => {
                onClickFontsizeHandler(fontsize);
              }}
              >
                {fontsize}
              </p>
            );
          }
          )}
      </div>
      )
    } 
    </>
  );
};

export default DropDown;
