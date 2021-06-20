import requests
from flask import Blueprint, render_template, request
from json2html import *
from .model import app

blueprint = Blueprint('api', __name__, url_prefix='/api')
BASE = "http://127.0.0.1:5000/api/"


# ROUTING
@app.route("/")
def index():
    return render_template('index.html')


@app.route("/start", methods=['POST'])
def start():
    # by default, I set the number of random number of persons to be generated to 50
    requests.post(BASE + "RandomPerson/initialize/50")
    requests.post(BASE + "Player/register/" + request.form.get('nickname'))
    return render_template('start.html', rest=60, imetype='text/html')


@app.route("/leaderboard", methods=['GET'])
def leaderboard():
    response = requests.get(BASE + "Player/leaderboard/")
    val = json2html.convert(json=response.text, table_attributes="id=\"info-table\" class=\"table table table-responsive table-hover\"")
    return render_template('leaderboard.html', table=val, mimetype='text/html')
