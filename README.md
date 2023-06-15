# :ear: Hearo



### 목차

1. [서비스 소개](#1.-서비스-소개)
2. [기술 스택](#2.-기술-스택)
3. [주요 기능](#3.-주요-기능)
4. [프로젝트 구성도](#4.-프로젝트-구성도)
5. [데모 영상](#5.-데모-영상)
6. [팀 소개](#6.-팀-소개)



## 1. 서비스 소개

2023년 통계를 기준으로, 전 세계에는 약 7천만 명의 청각 장애인이 있습니다. 많은 청각 장애인들은 직장에서, 그리고 일상생활에서 소통에 불편함을 겪습니다. 이제 히어로를 사용해 소통의 장벽을 허물어 보세요!  

Hearo는 청각장애인과 비장애인을 연결하는 소통 특화 플랫폼으로, 웹과 앱, 글래스와 워치를 통해 사용할 수 있습니다.  

- Hearo App: 일상 생활에서의 불편함을 해결해 줍니다. 대화 기능, 위험 소음 인식, 수어 번역 기능을 제공합니다.
- Hearo Glass: 특별 제작된 글래스로 Hearo App의 기능을 사용할 수 있습니다. 글래스를 통해 휴대폰 화면이 아닌 상대방의 눈을 바라보며 소통할 수 있습니다.
- Hearo Office (Web): Hearo의 오피스 특화 서비스로, 실시간으로 회의 내용을 파악할 수 있습니다.



## 2. 기술 스택

| **Frontend** | <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"/> <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white"/>  <img src="https://img.shields.io/badge/React%20Router-CA4245?style=flat&logo=react-router&logoColor=white"/> <img src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white"/> <img src="https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white"/> |
| :----------: | :----------------------------------------------------------: |
| **Backend**  | <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white"/> <img src="https://img.shields.io/badge/Gradle-02303A?style=flat&logo=gradle&logoColor=white"/> <img src="https://img.shields.io/badge/Spring%20Data%20JPA-000000?style=flat&logoColor=white"/> <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat&logo=spring-security&logoColor=white"/> <img src="https://img.shields.io/badge/Spring%20Cloud-000000?style=flat&logoColor=white"/> <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white"/> <img src="https://img.shields.io/badge/Clova%20Speech%20API-000000?style=flat&logoColor=white"/> <img src="https://img.shields.io/badge/ChatGPT%20API-000000?style=flat&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white"/> |
|   **IoT**    | <img src="https://img.shields.io/badge/CirtcuitPython-000000?style=flat&logoColor=white"/> <img src="https://img.shields.io/badge/Adafruit-000000?style=flat&logo=adafruit&logoColor=white"/> |
|    **AI**    | <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"/> <img src="https://img.shields.io/badge/Tensorflow-FF6F00?style=flat&logo=tensorflow&logoColor=white"/> <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=flat&logo=opencv&logoColor=white"/> <img src="https://img.shields.io/badge/Mediapipe-000000?style=flat&logoColor=white"/> |
|  **Infra**   | <img src="https://img.shields.io/badge/NGINX-009639?style=flat&logo=nginx&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white"/> <img src="https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=flat&logo=amazon-ec2&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=flat&logo=amazon-s3&logoColor=white"/> |



## 3. 주요 기능

### Hearo App

- 로그인

  - 구글 소셜 로그인 지원
  - 최초 로그인 시 사용에 필요한 권한 요청

  <img src="https://github.com/team-siksik/hearo/assets/98254573/3e86a231-e107-42bc-87e6-6a1ecc9e0714" width="300"/>

- 모드 선택

  - Hearo Glass 사용 여부에 따라 `연결 없이 시작하기` 또는 `H-Glass 시작하기` 선택

  <img src="https://github.com/team-siksik/hearo/assets/98254573/734864a2-a515-4fac-bd09-dc028ccb3b97" width="300"/>

- 메인 화면

  - `대화 나누기`, `주변 소음 인식`, `수어 인식`, `앱 권한 설정`, `자주 쓰는 말` 기능
  - 물음표 아이콘 선택하여 기능 설명 확인

  <img src="https://github.com/team-siksik/hearo/assets/98254573/7144d2d9-6fe7-4bd8-b171-35b95125fe97" width="300"/>

- 대화 나누기

  <img src="https://github.com/team-siksik/hearo/assets/98254573/9bfa3c17-5844-4e8f-9f37-9b9f38e42a62" width="300"/>

- 주변 소음 인식

  <img src="https://github.com/team-siksik/hearo/assets/98254573/9f265b37-8608-4260-a586-ee1c483ce862" width="300"/>

- 수어 인식

  <img src="https://github.com/team-siksik/hearo/assets/98254573/49f84dd7-bfce-493e-acc9-e2bb5bea70b7" width="300"/>

- 자주 쓰는 말

  <img src="https://github.com/team-siksik/hearo/assets/98254573/7c9c347f-d896-4559-bd7b-8f6f4668d769" width="300"/>

- 앱 권한 설정

  <img src="https://github.com/team-siksik/hearo/assets/98254573/5336ee61-a759-4ed7-a303-2a1d36993d70" width="300"/>

- 내 계정

  <img src="https://github.com/team-siksik/hearo/assets/98254573/4dfb0600-c872-4b0e-8af4-eae8df845903" width="300"/>



### Hearo Glass

- Hearo Glass 연결

  <img src="https://github.com/team-siksik/hearo/assets/98254573/8bc1fd26-a8d8-4b90-9b56-3d58dcaa218e" width="300"/><img src="https://github.com/team-siksik/hearo/assets/98254573/6ea39fa4-ca8c-4c78-9d31-9bea35b0abb0" height="622"/>

- 대화 나누기

  <img src="https://github.com/team-siksik/hearo/assets/98254573/ae5bae7d-bbe8-45d7-b781-50fe6415a519" width="300"/><img src="https://github.com/team-siksik/hearo/assets/98254573/56d41039-2033-4462-9751-a95c6a3397a7" height="622"/>

- 주변 소음 인식

  <img src="https://github.com/team-siksik/hearo/assets/98254573/cef0b3ef-06f2-422d-87f9-dc508d1fb820" width="600"/>



### Hearo Office (Web)

- 로그인

  <img src="https://github.com/team-siksik/hearo/assets/98254573/d4d57c8f-ce7c-46b4-8a7c-5e03cdea92bc"/>

- 메인 화면

  <img src="https://github.com/team-siksik/hearo/assets/98254573/9eff56c6-69a3-462e-8502-1e3b75188f51"/>

- 회의 진행 화면

  <img src="https://github.com/team-siksik/hearo/assets/98254573/bde205bf-5647-405e-8740-6804e233d688"/>

- 내 기록

  <img src="https://github.com/team-siksik/hearo/assets/98254573/a7bb3a77-848d-4c0f-a2a9-c3370e83b51b"/>

- 내 정보
  ![내 정보](https://github.com/team-siksik/hearo/assets/98254573/0e39f20c-4e28-4e33-902d-742e713db256)
  <img src="https://github.com/team-siksik/hearo/assets/98254573/0e39f20c-4e28-4e33-902d-742e713db256"/>



## 4. 프로젝트 구성도

### 개체-관계 모델 (ERD)

![ERD_230513](https://github.com/team-siksik/hearo/assets/98254573/4a4b915a-5ec3-4f1a-ba45-5e208d721f86)



## 5. 데모 영상

[![데모 영상](https://img.youtube.com/vi/wH8JIsThcEE/0.jpg)](https://youtu.be/wH8JIsThcEE)



## 6. 팀 소개

|  이름  |          역할           |
| :----: | :---------------------: |
| 김동준 | 팀장<br/>Frontend (App) |
| 김나연 |     Backend<br/>AI      |
| 남기성 |     Frontend (Web)      |
| 노현정 |     Frontend (Web)      |
| 박장훈 |      CI/CD<br/>AI       |
| 홍영민 |       IoT<br/>AI        |
