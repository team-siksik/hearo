import numpy as np

with open('words.txt', 'r') as f:
    words = f.readlines()
    words = [word.strip() for word in words]
words = np.array(words)
