import os
import redis
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost/gradetrack_dev' or\
        os.environ.get('DATABASE_URL')
                            
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True  #sign the session cookie sid
    SESSION_REDIS = redis.from_url("redis://localhost:6379")
