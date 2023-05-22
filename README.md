# Hearo 히어로 - 소리를 잇는 다리

![mainpage](/uploads/0e7b53d8852b1f83cbf657bee44affc6/mainpage.png)

#### Hearo [바로가기](https://k8a603.p.ssafy.io/)

## 프로젝트 소개

2023년 통계를 기준으로, 전세계에서 7천만 명 정도의 사람들이 청각 장애가 있습니다.
청각 장애인들의
청각 장애인과 비 청각 장애인간의 소통을 돕습니다.
소리를 잇는 다리, 히어로입니다.

## 주요 기능

### 오피스

#### - 실시간 대화 내용 텍스트화

### 앱

### 글래스

## 주요 기술

Backend Stack

- Java OpenJDK 11
- Spring Boot Gradle 2.7.10
  - Spring Data JPA
  - Spring Security
  - Spring Cloud Gateway
  - Lombok
  - Swagger 2.9.2
  - JWT 0.9.1
- Mysql 8.0.33
- Clova Speech

Frontend Stack

- Node.js 18.14.2
- Vite 2.4.0
- TypeScript 4.9.5
- React 18.2.0
  - React Router Dom 6.8.2
  - Redux 8.0.5
  - Redux Toolkit 1.9.5
- axios 1.3.5
- socket io client 4.6.1
- Flutter 3.10.0-3.0.pre.44

AI Stack

- python 3.8
- Tensorflow 2.11.0
- Fast Api

Server

- AWS EC2 t3.large
- AWS S3

CI/CD Stack

- Jenkins
- docker compose 2.16.0
- nginx

IoT Stack

- CircuitPython 8.0.5
  - Adafruit circuitpython libraries

## 협업 툴

## 아키텍쳐

## ERD

![ERD_230513](/uploads/f1d19b15b95484b15643781b65ff84f0/ERD_230513.png)

## 서비스 소개

## 앱

### 로그인 화면

![KakaoTalk_20230522_143644686_10.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9e16cb78-e5f3-41d0-9e5b-1c3271dc35fb/KakaoTalk_20230522_143644686_10.jpg)

- 구글 소셜 로그인을 통해 로그인을 할 수 있습니다.

### 모드 선택

![KakaoTalk_20230522_143644686_09.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/242db7f5-d153-411a-93c0-96702662451d/KakaoTalk_20230522_143644686_09.jpg)

- 자체 히어로 글래스가 있는 사람과 없는 사람이 모드를 정할 수 있습니다.

### 일반 홈

![KakaoTalk_20230522_143644686_08.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f5b915d3-9033-4ac7-a697-661f32c4a7c2/KakaoTalk_20230522_143644686_08.jpg)

- 기능을 선택하여 들어갈 수 있는 화면입니다.

### 계정 페이지

![KakaoTalk_20230522_143644686.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f5d91664-8503-4c41-9244-386e072a099a/KakaoTalk_20230522_143644686.jpg)

- 계정 페이지입니다.
- 모드를 변경하거나  로그아웃 및 회원 탈퇴가 가능합니다.

![KakaoTalk_20230522_143644686_01.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a195809d-835e-4146-9320-a2373b75f729/KakaoTalk_20230522_143644686_01.jpg)

- 자주 쓰는 말을 등록, 수정 및 삭제할 수 있습니다.

![KakaoTalk_20230522_150419693.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c66df40e-783f-4195-8ca0-e33bf9f06d6e/KakaoTalk_20230522_150419693.jpg)

- 앱의 권한 설정을 관리할 수 있습니다.

### 대화

![KakaoTalk_20230522_143644686_06.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7add2257-5da3-41cf-b2e9-99ae32637946/KakaoTalk_20230522_143644686_06.jpg)

![KakaoTalk_20230522_143644686_05.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ae756a65-9f0e-4639-bde1-862de969d46d/KakaoTalk_20230522_143644686_05.jpg)

![KakaoTalk_20230522_151650202.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3fdb3998-e362-4fdd-886b-aec7cd6ca4d6/KakaoTalk_20230522_151650202.jpg)

- 대화 화면입니다.
    - 대화 이용하기 도움말을 통해 기능을 알 수 있습니다.

### 소음 인식

- 안경과 동일

### 수어 인식

![KakaoTalk_20230522_143644686_07.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/80093e5e-edf2-4bcd-b8a6-def5e9044817/KakaoTalk_20230522_143644686_07.jpg)

## 글래스

### 글래스

![KakaoTalk_20230522_143644686_04.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e170a4ed-7aa2-47d5-a04c-37a847c8310f/KakaoTalk_20230522_143644686_04.jpg)

### 글래스 찾기

![KakaoTalk_20230522_144922130_01.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2c667fcb-6c62-4886-8c23-3fdd7d187cca/KakaoTalk_20230522_144922130_01.jpg)

![KakaoTalk_20230522_144922130.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d9221d15-87ba-447f-bd5f-fb3b8ced2721/KakaoTalk_20230522_144922130.jpg)

### 글래스 홈

![KakaoTalk_20230522_144922130_02.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9506c4cd-e8c6-4400-a680-b14e85943b15/KakaoTalk_20230522_144922130_02.jpg)

### 대화

![KakaoTalk_20230522_143644686_06.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7add2257-5da3-41cf-b2e9-99ae32637946/KakaoTalk_20230522_143644686_06.jpg)

![KakaoTalk_20230521_220243759.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b579a4ea-c609-4bfe-8d8f-c51e13b129ef/KakaoTalk_20230521_220243759.gif)

### 소음 인식

![KakaoTalk_20230522_143644686_12.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/97746c3e-721e-4d5e-88c3-2f4922e856f1/KakaoTalk_20230522_143644686_12.jpg)

![KakaoTalk_20230522_143644686_11.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6f5cd452-b856-42f0-bd8a-f234a81d507e/KakaoTalk_20230522_143644686_11.jpg)

![KakaoTalk_20230522_143644686_02.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/832b4f76-0288-4933-8f39-4018727aa2d8/KakaoTalk_20230522_143644686_02.jpg)

## 팀원 소개

### 6_6씩씩이

| 이름   | 역할             |
| ------ | ---------------- |
| 김동준 | 팀장, Flutter FE |
| 김나연 | Backend, AI      |
| 남기성 | Frontend         |
| 노현정 | Frontend         |
| 박장훈 | CI/CD, AI        |
| 홍영민 | IoT, AI          |
