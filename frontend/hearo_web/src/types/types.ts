//인터페이스 모음
export enum SelectedPage {
  CommunicationPage = "communication",
  RecordsPage = "record",
  Mypage = "mypage",
}

export interface MemoType {
  content: string;
  timestamp: number;
}
