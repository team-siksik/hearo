import React, { useRef, useState } from "react";
import { Button, FavContents, GPTRecommend, Input } from "@/components";
import { ReactComponent as Star } from "../../assets/Star.svg";
import { ReactComponent as Send } from "../../assets/Send.svg";

interface PropsType {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

function ConversationFooter({ setNewMessage }: PropsType) {
  const [openFavModal, setOpenFavModal] = useState<boolean>(false);
  const [openGPTModal, setOpenGPTModal] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleFavClick() {
    // 내가 자주 쓰는 말
    setOpenFavModal(!openFavModal);
  }
  function handleGPTClick() {
    // 상대방 말 클릭 -> gpt 추천 -> 추천 리스트
    setOpenGPTModal(!openGPTModal);
  }
  function handleSendClick() {
    // 내가 input창의 내용 보내기 및 읽기
    const msg = inputRef.current?.value ?? "";
    setNewMessage(msg);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) {
      // isComposing 이 true 이면
      return; // 조합 중이므로 동작을 막는다.
    }

    if (e.key === "Enter" && e.shiftKey) {
      // [shift] + [Enter] 치면 걍 리턴
      return;
    } else if (e.key === "Enter") {
      handleSendClick();
      e.preventDefault();
    }
  }
  function handleSubmitEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return (
    <>
      <div className="fixed bottom-0 z-10 h-12 w-full bg-white">
        <div className="my-2 flex w-full items-center px-4">
          <Button onClick={handleFavClick}>
            <Star />
          </Button>
          <form
            onSubmit={(e) => handleSubmitEvent(e)}
            className="send-msg-form flex w-full items-center"
          >
            <label htmlFor="messageInput" hidden>
              Enter Message
            </label>
            <div className="mx-2 grow">
              <Input
                inputRef={inputRef}
                type="InputFull"
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSendClick}>
              <Send />
            </Button>
          </form>
        </div>
      </div>
      {openFavModal ? <FavContents /> : null}
      {openGPTModal ? <GPTRecommend /> : null}
    </>
  );
}

export default ConversationFooter;
