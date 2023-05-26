# import base64
# import librosa
# import io
# import numpy as np


# binary_data = base64.b64decode(base64_string)

# buffer = io.BytesIO(binary_data)
# audio, sr = librosa.load(buffer, sr=None)
# stft = np.abs(librosa.stft(audio))
# spectral_centroids = librosa.feature.spectral_centroid(S=stft, sr=sr)

# print(spectral_centroids)