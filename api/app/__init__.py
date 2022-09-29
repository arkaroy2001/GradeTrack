from flask import Flask, session
from config import Config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_session import Session


calc_app = Flask(__name__)
calc_app.config.from_object(Config)
CORS(calc_app,supports_credentials=True) 
# calc_app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(calc_app)
db = SQLAlchemy(calc_app)
migrate = Migrate(calc_app, db)
server_session = Session(calc_app)

from app import routes, models 