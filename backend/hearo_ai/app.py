from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit

from ai_codes.genereate_sentence import *
from ai_codes.sound_classification import *
from ai_codes.speaker_diarization import *

import os


app = Flask(__name__)
socketio = SocketIO(app, logger=True, engineio_logger=True)


@app.route('/run/os')
def check_os():
    return os.name


@app.route('/run/generate', methods=['POST'])
def generate_sentence():
    text = request.form['text']

    # GPT 엔진 선택
    engine = "text-davinci-002"
    # engine = "gpt-3.5-turbo"

    while True:
        result = run_generate_sentence(text, engine)
        if len(result) == 5:
            break
    
    return jsonify(result)


@app.route('/run/sound', methods=['POST'])
def sound_classification():
    result = True
    return jsonify(result)


@app.route('/run/speaker', methods=['POST'])
def speaker_diarization():
    result = True
    return jsonify(result)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8090, debug=True)
