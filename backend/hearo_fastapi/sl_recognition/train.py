import numpy as np
import os

from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import multilabel_confusion_matrix
from sklearn.model_selection import train_test_split

from utils import get_words_list


words = get_words_list()

path = "./dataset"
files = os.listdir(path)
files = [os.path.join(path, file) for file in files if file.startswith("seq")]

data = np.concatenate([np.load(file)
                      for file in files], axis=0)  # (total, 30, 157)

x_data = data[:, :, :-1]  # (total, 30, 156)
y_data = to_categorical(
    data[:, 0, -1], num_classes=len(words))  # (total, class)

x_data = x_data.astype(np.float32)
y_data = y_data.astype(np.float32)

x_train, x_val, y_train, y_val = train_test_split(
    x_data, y_data, test_size=0.1, random_state=2021)

# (train, 30, 156) (train, class)
print("train data: ", x_train.shape, y_train.shape)
# (val, 30, 156) (val, class)
print("validation data: ", x_val.shape, y_val.shape)

model = Sequential(
    [
        LSTM(
            64, return_sequences=True, activation="relu", input_shape=x_train.shape[1:3]
        ),
        LSTM(128, return_sequences=True, activation="relu"),
        LSTM(64, return_sequences=False, activation="relu"),
        Dense(64, activation="relu"),
        Dense(32, activation="relu"),
        Dense(len(words), activation="softmax"),
    ]
)
model.compile(optimizer="adam",
              loss="categorical_crossentropy", metrics=["acc"])
model.summary()

history = model.fit(
    x_train,
    y_train,
    validation_data=(x_val, y_val),
    epochs=200,
    callbacks=[
        ModelCheckpoint(
            "model/sl_recognizer.h5",
            monitor="val_acc",
            verbose=1,
            save_best_only=True,
            mode="auto",
        ),
        ReduceLROnPlateau(
            monitor="val_acc", factor=0.5, patience=50, verbose=1, mode="auto"
        ),
        EarlyStopping(monitor="val_acc", patience=10),
    ],
)

model = load_model("model/sl_recognizer.h5")
y_pred = model.predict(x_val)
print(multilabel_confusion_matrix(
    np.argmax(y_val, axis=1), np.argmax(y_pred, axis=1)))
