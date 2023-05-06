import time
import numpy as np


def get_words_list():
    with open("words.txt", "r") as f:
        words = f.readlines()
        words = [word.strip() for word in words]
    return words


def joint_to_angle(joint):
    # Compute angles between joints
    v1 = joint[
        [
            0,
            1,
            2,
            3,
            0,
            5,
            6,
            7,
            0,
            9,
            10,
            11,
            0,
            13,
            14,
            15,
            0,
            17,
            18,
            19,
        ],
        :3,
    ]  # Parent joint
    v2 = joint[
        [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
        ],
        :3,
    ]  # Child joint
    v = v2 - v1  # [20, 3]

    # Normalize v
    v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]

    # Get angle using arcos of dot product
    angle = np.arccos(
        np.einsum(
            "nt,nt->n",
            v[[0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18], :],
            v[[1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19], :],
        )
    )  # (15,)

    # Convert radian to degree
    # angle = np.degrees(angle) # 학습 저해하여 제외

    angle = np.array(angle, dtype=np.float32)

    return angle


def time_to_string(timestamp):
    time_obj = time.localtime(timestamp)
    return time.strftime("%y%m%d%H%M%S", time_obj)
