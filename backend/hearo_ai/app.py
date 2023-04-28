from flask import Flask, request, jsonify
from ai_codes.genereate_sentence import *
from ai_codes.sound_classification import *
from ai_codes.speaker_diarization import *
import os

app = Flask(__name__)

@app.route('/run/os')
def check_os():
    return os.name

@app.route('/run/generate', methods=['POST'])
def generate_sentence():
    text = request.form['text']

    while True:
        result = run_generate_sentence(text)
        if len(result) == 5:
            break
    return jsonify(result)

@app.route('/run/generategpt', methods=['POST'])
def generate_sentence_gpt():
    text = request.form['text']

    while True:
        result = run_generate_sentence_gpt3_5(text)
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
    app.run(host='0.0.0.0',
            port=8090)