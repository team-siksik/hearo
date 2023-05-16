import React from "react";
import { PuffLoader } from "react-spinners";

interface PropsType {
  loading: boolean;
}

/**
 * 로딩중 표시하는 컴포넌트 입니다.
 * @loading : 로딩중일 때만 spinner가 돕니다.
 */
function Spinner({ loading }: PropsType) {
  return <PuffLoader loading={loading} color="#1A73E8" />;
}

export default Spinner;
