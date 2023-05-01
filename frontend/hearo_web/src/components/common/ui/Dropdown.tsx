import React, { useEffect, useState } from 'react';

interface DropDownProps {
  gender: string[];
  showDropDown: boolean;
  toggleDropDown: Function;
  genderSelection: Function;
};

function DropDown ({gender, genderSelection}: DropDownProps) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  /**
   * 젠더 설정 
   * 부모 컴포넌트로 이동
   *
   * @param gender
   */
  const onClickHandler = (gender: string): void => {
    genderSelection(gender);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  return (
    <>
      <div className={showDropDown ? 'dropdown' : 'dropdown active py-1 '}>
        {gender.map(
          (gender: string, index: number): JSX.Element => {
            return (
              <p
                className='hover:bg-red-main rounded-xl'
                key={index}
                onClick={(): void => {
                  onClickHandler(gender);
                }}
              >
                {gender}
              </p>
            );
          }
        )}
      </div>
    </>
  );
};

export default DropDown;
