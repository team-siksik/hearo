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
    room_type = request.form['room_type']
    room_name = session['username'] + '-' + request.form['room']

    session['username'] = username
    session['room'] = room_name

    if room_type == 'sd':
        pass #sl, sc

    return redirect(url_for('main.conversation'))


@main.route('/conversation')
def conversation():
    name = session.get('name', '')
    room = session.get('room', '')
    return render_template('conversation.html', name=name, room=room)


@main.route('/chat')
def chat():
    name = session.get('name', '')
    room = session.get('room', '')
    if name == '' or room == '':
        return redirect(url_for('.index'))
    return render_template('conversation.html', name=name, room=room)


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
