from fastapi import APIRouter, Response

import base64
import cv2
import numpy as np
import mediapipe as mp

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
    try:
        np_arr = np.fromstring(base64.b64decode(base64_string), np.uint8)  # base64 -> numpy array
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)  # numpy array -> opencv image
        return image
    except Exception as e:
        logger.debug(f"Failed to decode the image: {str(e)}")
        return None


async def preprocess_image(image):
    """
    넘파이 배열 형식의 이미지를 모델 input에 맞게 전처리
    Input: 넘파이 배열 (numpy.ndarray)
    Output: 모델 인풋 사이즈에 맞추어 전처리된 넘파이 배열 (192,) (numpy.ndarray)
    """
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        results = holistic.process(image)

        if not results.left_hand_landmarks and not results.right_hand_landmarks:
            return None
        
        pose = np.zeros((12, 3))
        left_joint, right_joint = np.zeros((21, 3)), np.zeros((21, 3))
        left_angle, right_angle = np.zeros((15,)), np.zeros((15,))

        if results.pose_landmarks:
            logger.debug("pose")
            for idx, lm in enumerate(results.pose_landmarks.landmark):
                if 10 < idx < 23:
                    pose[idx - 11] = [lm.x, lm.y, lm.z]

        if results.left_hand_landmarks:
            logger.debug("left hand")
            for idx, lm in enumerate(results.left_hand_landmarks.landmark):
                left_joint[idx] = [lm.x, lm.y, lm.z]
            left_angle = await joint_to_angle_from_router(left_joint)

        if results.right_hand_landmarks:
            logger.debug("right hand")
            for idx, lm in enumerate(results.right_hand_landmarks.landmark):
                right_joint[idx] = [lm.x, lm.y, lm.z]
            right_angle = await joint_to_angle_from_router(right_joint)

        data = np.concatenate([pose.flatten(), left_joint.flatten(), left_angle, right_joint.flatten(), right_angle,])  # (192,)
        data = np.expand_dims(data, axis=0)  # (1, 192)
        
        return data


# mediapipe 세팅
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_holistic = mp.solutions.holistic

# 인식할 수 있는 수어 단어 목록 로드
words = get_words_list_from_router()
words_dict = {
    "well-exist": "안녕하세요",
    "meet": "만나다",
    "glad": "반가워요",
    "hobby": "취미",
    "what": "무엇인가요",
    "hiking": "등산",
    "like": "좋아해요",
    "thank": "고마워요",
    "everyone": "여러분",
    "effort": "수고했어요",
    "me": "저",
    "you": "당신",
    "many": "많아요"
}

# 수어 인식 모델 로드
model = load_model("ai_code/sl_recognition/model/sl_recognizer.h5")

# 글로벌 변수 선언
global word_before
word_before = None


@socket_manager.on("image")
async def image(sid, data):
    logger.info(f"image: {sid} sent image")

    room_id = data["room_id"]
    base64_string = data["base64_string"]

    await socket_manager.emit("info", f"{sid} sent image", room_id, skip_sid=sid)
    
    logger.debug(f"1. 데이터 전처리")
    # base64 인코딩된 string -> image
    image = await decode_image(base64_string)
    if image is None:
        logger.debug(f"! FAILED TO DECODE THE IMAGE !")
        return
    # 모델 input에 맞추어 전처리
    data = await preprocess_image(image)
    if data is None:
        logger.debug(f"! NO HANDS DETECTED !")
        return
    logger.debug(f"data.shape: {data.shape}")

    logger.debug(f"2. 모델 추론")
    y_pred = model.predict(data).squeeze()
    i_pred = int(np.argmax(y_pred))
    conf = y_pred[i_pred]
    logger.debug(f"result: word - {words[i_pred]}, conf - {conf}")

    # 임계값 넘지 않으면 추론 결과 무시
    threshold = 0.8
    if conf < threshold:
        logger.debug(f"! confidence smaller than {threshold} !")
        return

    # 두 글자 단어(안녕하세요) 처리
    word = words[i_pred]
    if word == "well":
        word_before = "well"
        return
    if word == "exist" and word_before == "well":
        word = "well-exist"
        word_before = None

    # 추론 결과 전송
    await socket_manager.emit("word", words_dict[word], room_id)

    logger.info(f"image: {sid} received result '{words_dict[word]}'")
