import React, { SetStateAction } from "react";
import Modal from "../common/ui/Modal";
import { GOOGLE_AUTH_URL } from "@/apis/oAuthGoogle";
import google_logo from "@/assets/Google_Logo.svg";
import Button from "../common/ui/Button";
interface PropsType {
  setLoginModal: React.Dispatch<SetStateAction<boolean>>;
}
function LoginModal({ setLoginModal }: PropsType) {
  return (
    <Modal open={true} cannotExit={false} setLoginModal={setLoginModal}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="m-auto flex justify-center font-chewy text-5xl text-blue-main">
            Hearo
          </h2>
          <p className="m-auto flex justify-center font-nanum text-2xl text-blue-main">
            소리를 잇는 다리
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            히어로에 오신 것을 환영해요. <br></br> 자주 사용하시는 구글 계정으로
            로그인하세요.
          </p>
          <a className="m-auto" href={GOOGLE_AUTH_URL}>
            <Button type="whiteButton">
              <div className="flex justify-center">
                <img className="mx-3 w-5" src={google_logo} />
                <p className="  mr-3 text-sm text-gray-600 ">
                  Sign in with Google
                </p>
              </div>
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
