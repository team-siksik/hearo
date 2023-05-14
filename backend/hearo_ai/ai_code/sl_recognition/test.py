import cv2
import numpy as np
import mediapipe as mp

from collections import deque
from tensorflow.keras.models import load_model

from utils import get_words_list, joint_to_angle


words = get_words_list()
# seq_length = 30

model = load_model("model/sl_recognizer.h5")

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_holistic = mp.solutions.holistic

cap = cv2.VideoCapture(0)

# seq = []
word_seq = deque()

with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    while cap.isOpened():
        success, image = cap.read()

        if not success:
            print("EMPTY CAMERA FRAME")
            continue

        image = cv2.flip(image, 1)
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = holistic.process(image)
        # image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

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

        data = np.concatenate([pose.flatten(), left_joint.flatten(), left_angle, right_joint.flatten(), right_angle,])  # (192,)
        data = np.expand_dims(data, axis=0)  # (1, 192)

        # cv2.imshow(word.upper(), image)
        # if cv2.waitKey(5) & 0xFF == 27:
        #     break

        # input_data = np.expand_dims(
        #     np.array(seq[-seq_length:], dtype=np.float32), axis=0
        # )

        y_pred = model.predict(data).squeeze()
        i_pred = int(np.argmax(y_pred))
        conf = y_pred[i_pred]
        print(words[i_pred], conf)

        if conf < 0.9:
            continue

        word = words[i_pred]
        word_seq.append(word)

        if len(word_seq) < 3:
            continue

        this_word = "?"
        if word_seq[-1] == word_seq[-2] == word_seq[-3]:
            this_word = word_seq[-1]
        print(word_seq)
        
        word_seq.popleft()

        cv2.putText(
            image,
            f"{this_word.upper()}",
            org=(10, 30),
            fontFace=cv2.FONT_HERSHEY_SIMPLEX,
            fontScale=1,
            color=(255, 255, 255),
            thickness=2,
        )

        cv2.imshow("image", image)
        if cv2.waitKey(5) & 0xFF == 27:
            break
