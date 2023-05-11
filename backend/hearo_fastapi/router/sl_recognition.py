from fastapi import APIRouter, Response

import base64
import cv2
import numpy as np
import mediapipe as mp

from collections import deque
from tensorflow.keras.models import load_model

from main import socket_manager, logger
from ai_code.sl_recognition.utils import get_words_list_from_router, joint_to_angle_from_router


router = APIRouter(prefix="/sl")


@router.get("/test")
async def root():
    logger.info("root: sl router api 호출")
    return {"message": "hearo!"}


@router.get("/image")
async def test_image():
    logger.info("test_image: 이미지 처리 테스트용 API 호출")

    logger.debug("1. base64 인코딩")
    image = cv2.imread("ai_code/sl_recognition/example.jpg")
    buffer = cv2.imencode('.jpg', image)[1]
    image_string = base64.b64encode(buffer).decode('utf-8')
    logger.debug(f"image_string: {image_string}")

    logger.debug("2. base64 디코딩")
    image_np = await decode_image(image_string)
    logger.debug(f"image_np: {image_np}")

    logger.debug("3. 이미지 전처리")
    data = await preprocess_image(image_np)
    logger.debug(f"data: {data}")

    image_encoded = cv2.imencode(".jpg", image)[1]
    return Response(content=image_encoded.tobytes(), media_type="image/jpeg")


async def decode_image(base64_string):
    """
    base64 문자로 인코딩하여 전달받은 이미지를 cv2 호환되는 이미지로 변환
    Input: base64 인코딩된 문자 (string)
    Output: cv2 호환되는 넘파이 배열 (numpy.ndarray)
    """
    np_arr = np.fromstring(base64.b64decode(base64_string), np.uint8)  # base64 -> numpy array
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)  # numpy array -> opencv image
    return image


async def preprocess_image(image):
    """
    넘파이 배열 형식의 이미지를 모델 input에 맞게 전처리
    Input: 넘파이 배열 (numpy.ndarray)
    Output: 모델 인풋 사이즈에 맞추어 전처리된 넘파이 배열 (156,) (numpy.ndarray)
    """
    with mp_hands.Hands(model_complexity=0, min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
        results = hands.process(image)

        if not results.multi_hand_landmarks:
            logger.debug("!no hands detected!")
            return np.zeros((156,))
        
        left_joint, right_joint = np.zeros((21, 3)), np.zeros((21, 3))
        left_angle, right_angle = np.zeros((15,)), np.zeros((15,))

        for landmarks, hand in zip(results.multi_hand_landmarks, results.multi_handedness):
            hand = hand.classification[0].label.lower()

            if hand == "right":
                for j, lm in enumerate(landmarks.landmark):
                    right_joint[j] = [lm.x, lm.y, lm.z,]
                right_angle = await joint_to_angle_from_router(right_joint)
            else:
                for j, lm in enumerate(landmarks.landmark):
                    left_joint[j] = [lm.x, lm.y, lm.z,]
                left_angle = await joint_to_angle_from_router(left_joint)

        return np.concatenate([left_joint.flatten(), left_angle, right_joint.flatten(), right_angle,])


# mediapipe 세팅
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands

# 인식할 수 있는 수어 단어 목록 로드
words = get_words_list_from_router()

# 수어 인식 모델 로드
model = load_model("ai_code/sl_recognition/model/sl_recognizer.h5")

# 글로벌 변수 선언
global sequence, word_sequence
sequence = deque()  # 전처리된 데이터 저장
word_sequence = deque()  # 추론된 단어 저장


@socket_manager.on("image")
async def image(sid, data):
    await socket_manager.emit("info", f"{sid} sent image")
    logger.info(f"image: {sid} sent image")

    room_id = data["room_id"]
    base64_string = data["base64_string"]

    # 이미지 변환, 전처리 및 시퀀스에 저장
    image = await decode_image(base64_string)
    data = await preprocess_image(image)
    # logger.debug(f"1. data: {data}")
    logger.debug(f"1. data.shape: {data.shape}")
    sequence.append(data)

    # 시퀀스 길이가 30이 되기 전까지는 추론 실행하지 않음
    logger.debug(f"2. len(sequence): {len(sequence)}")
    if len(sequence) < 30:
        logger.debug("!less than 30!")
        return
    
    # 모델 인풋 사이즈에 맞게 시퀀스 전처리
    input_data = np.expand_dims(np.array(sequence, dtype=np.float32), axis=0)
    logger.debug(f"3. input_data: {input_data}")
    logger.debug(f"3. input_data.shape: {input_data.shape}")
    
    # 추론 실행
    y_pred = model.predict(input_data).squeeze()
    i_pred = int(np.argmax(y_pred))
    conf = y_pred[i_pred]
    logger.debug(f"4. inference result: word - {words[i_pred]}, conf - {conf}")

    # 시퀀스의 첫번째 인자 삭제
    sequence.popleft()
    logger.debug(f"5. len(sequence): {len(sequence)}")

    # 임계값 넘지 않으면 추론 결과 무시
    if conf < 0.9:
        logger.debug("!smaller than 0.9!")
        return

    # 추론된 단어 및 단어 시퀀스 저장  
    word = words[i_pred]
    word_sequence.append(word)
    logger.debug(f"5. word_sequence: {word_sequence}")

    # 추론된 단어가 3번이 되지 않는 경우 무시
    if len(word_sequence) < 3:
        logger.debug("!less than 3!")
        return
    
    # 추론된 단어가 3번 연속 동일하다면 맞는 추론으로 판단
    result = None
    if word_sequence[-1] == word_sequence[-2] == word_sequence[-3]:
        result = word
    socket_manager.emit("word", result, room_id, skip_sid=sid)
    socket_manager.emit("info", f"{sid} received result '{result}'")
    logger.info(f"image: {sid} received result '{result}'")
    
    # 추론된 단어 시퀀스의 첫번째 인자 삭제
    word_sequence.popleft()
