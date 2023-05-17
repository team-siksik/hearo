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

export interface FrequentType { 
  frequentSeq : number;
  sentence : string;
}

export interface RecordListType {
  recordSeq: number;
  conversationSeq: number;
  title: string;
  recordingTime: string;
  preview: string;
  isFavorite: number;
  regDtm: string;
  modDtm: string;
}

export interface RecordItemType {
  recordSeq: number;
  conversationSeq: number;
  title: string;
  isFavorite: number;
  clovaFile: string; // JSON.parse 해야함
  recordedFileUrl: string;
  recordingTime: string;
  regDtm: string;
  modDtm: string;
  memoList: MemoFromServerType[];
}

export interface MemoFromServerType {
  memoSeq: number;
  content: string;
  timestamp: number;
}

