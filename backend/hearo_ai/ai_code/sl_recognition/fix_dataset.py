import numpy as np
import os

from utils import get_words_list


words = get_words_list()
words_dict = {v: k for k, v in enumerate(words)}

path = "./dataset"
files = os.listdir(path)
files = [os.path.join(path, file) for file in files]

for file in files:
    print(file)
    class_name = file.split('/')[2].split('_')[0]
    load_file = np.load(file)
    load_file[:, -1] = words_dict[class_name]
    np.save(file, load_file)


# 참고
# data = np.concatenate([np.load(file) for file in files], axis=0)  # (total, 193)
# np.save(os.path.join("dataset", f"{word}_{name}_{size}_{created_time}"), data)
