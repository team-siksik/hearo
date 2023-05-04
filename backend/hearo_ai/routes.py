from flask import Blueprint, request, session, redirect, url_for, render_template, jsonify

from ai_codes.genereate_sentence import *
from ai_codes.sound_classification import *
from ai_codes.speaker_diarization import *

import os


main = Blueprint('main', __name__, url_prefix='/')


@main.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    
    username = request.form['username']
    category = request.form['category']
    room = username + '-' + category

    session['username'] = username
    session['room'] = room

    if category == 'chat':
        return redirect(url_for('main.chat'))
    elif category == 'speaker':
        return redirect(url_for('main.speaker'))
    elif category == 'sign-language':
        return redirect(url_for('main.sign_language'))
    else: # category == 'sound'
        return redirect(url_for('main.sound'))


@main.route('/chat')
def chat():
    username = session.get('username', '')
    room = session.get('room')
    return render_template('chat.html', username=username, room=room)


@main.route('/speaker')
def speaker():
    username = session.get('username', '')
    room = session.get('room')
    return render_template('speaker.html', username=username, room=room)


@main.route('/sign-language')
def sign_language():
    username = session.get('username', '')
    room = session.get('room')
    return render_template('sign-language.html', username=username, room=room)


@main.route('/sound')
def sound():
    username = session.get('username', '')
    room = session.get('room')
    return render_template('sound.html', username=username, room=room)


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
