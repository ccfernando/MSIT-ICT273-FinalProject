from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__, template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ToyProblem_db.db'
db = SQLAlchemy(app)

# Placed the following imports here to avoid circular imports
from .model import api

