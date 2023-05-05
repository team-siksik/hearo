import cv2
import numpy as np
import mediapipe as mp

from tensorflow.keras.models import load_model

from utils import get_words_list, joint_to_angle


words = get_words_list()
seq_length = 30

model = load_model("model/model.h5")

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands

cap = cv2.VideoCapture(0)

seq = []
word_seq = []

with mp_hands.Hands(
    model_complexity=0, min_detection_confidence=0.5, min_tracking_confidence=0.5
) as hands:
    while cap.isOpened():
        success, image = cap.read()

        if not success:
            print("EMPTY CAMERA FRAME")
            continue

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

            d = np.concatenate(
                [
                    left_joint.flatten(),
                    left_angle,
                    right_joint.flatten(),
                    right_angle,
                ]
            )
            seq.append(d)

            mp_drawing.draw_landmarks(
                image,
                landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style(),
            )

            if len(seq) < seq_length:
                continue

            input_data = np.expand_dims(
                np.array(seq[-seq_length:], dtype=mp.float32), axis=0
            )

            y_pred = model.predict(input_data).squeeze()
            i_pred = int(np.argmax(y_pred))
            conf = y_pred[i_pred]

            if conf < 0.9:
                continue

            word = words[i_pred]
            word_seq.append(word)

            if len(word_seq) < 3:
                continue

            this_word = "?"
            if word_seq[-1] == word_seq[-2] == word_seq[-3]:
                this_word = word

            cv2.putText(
                image,
                f"{this_word.upper()}",
                org=(
                    int(landmarks.landmark[0].x * image.shape[1]),
                    int(landmarks.landmark[0].y * image.shape[0] + 20),
                ),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=1,
                color=(255, 255, 255),
                thickness=2,
            )

        cv2.imshow("image", image)
        if cv2.waitKey(5) & 0xFF == 27:
            break
