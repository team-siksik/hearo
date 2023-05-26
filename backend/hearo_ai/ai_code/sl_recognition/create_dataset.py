import cv2
import mediapipe as mp
import numpy as np
import time
import os

from utils import get_words_list, joint_to_angle, time_to_string


name = 'ny'

words = get_words_list()
secs_for_action = 30

created_time = time_to_string(time.time())
os.makedirs("dataset", exist_ok=True)

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_holistic = mp.solutions.holistic

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# 지원하는 해상도 목록 출력
# supported_resolutions = []
# for i in range(100):
#     width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
#     height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
#     if width == 0 or height == 0:
#         break
#     supported_resolutions.append((int(width), int(height)))
#     cap.read()

# for resolution in supported_resolutions:
#     print(f"Width: {resolution[0]}, Height: {resolution[1]}")


with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    while cap.isOpened():
        for word_idx, word in enumerate(words):
            data = []

            success, image = cap.read()

            if not success:
                print("EMPTY CAMERA FRAME")
                continue

            image = cv2.flip(image, 1)

            cv2.putText(
                image,
                f"Waiting for collecting {word.upper()} action...",
                org=(10, 30),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=1,
                color=(255, 255, 255),
                thickness=2,
            )
            cv2.imshow("image", image)
            cv2.waitKey(3000)

            start_time = time.time()

            while time.time() - start_time < secs_for_action:
                success, image = cap.read()

                image = cv2.flip(image, 1)
                image.flags.writeable = False
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                results = holistic.process(image)

                if not results.left_hand_landmarks and not results.right_hand_landmarks:
                    continue

                # print(results.pose_landmarks, results.left_hand_landmarks, results.right_hand_landmarks)

                pose = np.zeros((12, 3))
                left_joint, right_joint = np.zeros((21, 3)), np.zeros((21, 3))
                left_angle, right_angle = np.zeros((15,)), np.zeros((15,))

                for idx, lm in enumerate(results.pose_landmarks.landmark):
                    if 10 < idx < 23:
                        pose[idx - 11] = [lm.x, lm.y, lm.z]

                if results.left_hand_landmarks:
                    for idx, lm in enumerate(results.left_hand_landmarks.landmark):
                        left_joint[idx] = [lm.x, lm.y, lm.z]
                    left_angle = joint_to_angle(left_joint)

                if results.right_hand_landmarks:
                    for idx, lm in enumerate(results.right_hand_landmarks.landmark):
                        right_joint[idx] = [lm.x, lm.y, lm.z]
                    right_angle = joint_to_angle(right_joint)

                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                mp_drawing.draw_landmarks(
                    image,
                    results.pose_landmarks,
                    mp_holistic.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
                mp_drawing.draw_landmarks(
                    image,
                    results.left_hand_landmarks,
                    mp_holistic.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style(),
                )
                mp_drawing.draw_landmarks(
                    image,
                    results.right_hand_landmarks,
                    mp_holistic.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style(),
                )

                d = np.concatenate([pose.flatten(), left_joint.flatten(), left_angle, right_joint.flatten(), right_angle])
                d = np.append(d, word_idx)
                data.append(d)  # (193,)

                cv2.imshow(word.upper(), image)
                if cv2.waitKey(5) & 0xFF == 27:
                    break

            data = np.array(data)
            print(word, data.shape)

            size = data.shape[0]

            np.save(os.path.join("dataset", f"{word}_{name}_{size}_{created_time}"), data)
            
        break

cap.release()
