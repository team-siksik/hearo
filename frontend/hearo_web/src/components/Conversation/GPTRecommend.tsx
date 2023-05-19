import React, { SetStateAction, useEffect, useState } from "react";
import { Button, Modal, Spinner } from "@/components";
import { MeetingAPI } from "@/apis/api";
import axios from "axios";

interface PropsType {
  requestString: string;
  openGPTModal: boolean;
  setOpenGPTModal: React.Dispatch<SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

function GPTRecommend({
  requestString,
  openGPTModal,
  setOpenGPTModal,
  inputRef,
}: PropsType) {
  const [suggestedList, setSuggestedList] = useState<string[]>([]);
  async function getRecomm() {
    await axios
      .post(
        //FIXME: CORS 에러
        `https://k8a6031.p.ssafy.io:8090/api/v1/tg/generate`,
        { text: requestString },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setSuggestedList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function chooseItem(item: string) {
    if (inputRef.current) {
      inputRef.current.value = item;
    }
    setOpenGPTModal(false);
  }

  // 컴포넌트 렌더링 되자마자 파일
  useEffect(() => {
    getRecomm();
  }, []);

  return (
    <Modal open={true} cannotExit={false} setOpenGPTModal={setOpenGPTModal}>
      <h4 className="mb-3 text-lg font-bold">GPT 추천</h4>
      <div className="flex flex-col gap-3">
        {suggestedList.length > 0 ? (
          suggestedList.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex justify-end"
                onClick={() => chooseItem(item)}
              >
                <Button type="contentBtn">{item}</Button>
              </div>
            );
          })
        ) : (
          <div className="m-auto flex">
            <Spinner loading={true} />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default GPTRecommend;
