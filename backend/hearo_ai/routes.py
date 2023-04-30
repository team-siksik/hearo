from flask import Blueprint, request, session, redirect, url_for, render_template, jsonify

from ai_codes.genereate_sentence import *
from ai_codes.sound_classification import *
from ai_codes.speaker_diarization import *

import os


main = Blueprint('main', __name__, url_prefix='/')


@main.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        session['name'] = request.form['name']
        session['room'] = request.form['room']
        return redirect(url_for('main.chat'))
    return render_template('index.html')


@main.route('/chat')
def chat():
    name = session.get('name', '')
    room = session.get('room', '')
    if name == '' or room == '':
        return redirect(url_for('.index'))
    return render_template('chat.html', name=name, room=room)


@main.route('/run/os')
def check_os():
    return os.name


@main.route('/run/generate', methods=['POST'])
def generate_sentence():
    text = request.form['text']

    while True:
        result = run_generate_sentence(text)
        if len(result) == 5:
            break

    return jsonify(result)


@main.route('/run/sound', methods=['POST'])
def sound_classification():
    result = True
    return jsonify(result)


@main.route('/run/speaker', methods=['POST'])
def speaker_diarization():
    result = True
    return jsonify(result)
