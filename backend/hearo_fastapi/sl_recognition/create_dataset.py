import cv2
import mediapipe as mp
import numpy as np
import time
import os

from utils import get_words_list, joint_to_angle, time_to_string


words = get_words_list()
seq_length = 30
secs_for_action = 30

created_time = time_to_string(time.time())
os.makedirs("dataset", exist_ok=True)

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands

cap = cv2.VideoCapture(0)

with mp_hands.Hands(
    model_complexity=0, min_detection_confidence=0.5, min_tracking_confidence=0.5
) as hands:
    while cap.isOpened():
        for idx, word in enumerate(words):
            data = []

            success, image = cap.read()

            if not success:
                print("Ignoring empty camera frame.")
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
                results = hands.process(image)
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                if not results.multi_hand_landmarks:
                    continue

                left_joint, right_joint = np.zeros((21, 4)), np.zeros((21, 4))
                left_angle, right_angle = np.zeros((15,)), np.zeros((15,))

                for landmarks, hand in zip(
                    results.multi_hand_landmarks, results.multi_handedness
                ):
                    hand = hand.classification[0].label.lower()

                    for j, lm in enumerate(landmarks.landmark):
                        globals()["{}_joint".format(hand)][j] = [
                            lm.x,
                            lm.y,
                            lm.z,
                            lm.visibility,
                        ]

                    globals()["{}_angle".format(hand)] = joint_to_angle(
                        globals()["{}_joint".format(hand)]
                    )

                    mp_drawing.draw_landmarks(
                        image,
                        landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing_styles.get_default_hand_landmarks_style(),
                        mp_drawing_styles.get_default_hand_connections_style(),
                    )

                d = np.concatenate(
                    [
                        left_joint.flatten(),
                        left_angle,
                        right_joint.flatten(),
                        right_angle,
                    ]
                )
                d = np.append(d, idx)
                data.append(d)  # (199,)

                cv2.imshow(word.upper(), image)
                if cv2.waitKey(5) & 0xFF == 27:
                    break

            data = np.array(data)
            print(word, data.shape)
            np.save(os.path.join(
                "dataset", f"raw_{word}_{created_time}"), data)

            # Create sequence data
            full_seq_data = []
            for seq in range(len(data) - seq_length):
                full_seq_data.append(data[seq: seq + seq_length])

            full_seq_data = np.array(full_seq_data)
            print(word, full_seq_data.shape)
            np.save(
                os.path.join(
                    "dataset", f"seq_{word}_{created_time}"), full_seq_data
            )
        break

cap.release()
