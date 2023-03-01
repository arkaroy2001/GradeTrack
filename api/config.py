import os
import redis
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                    'sqlite:///' + os.path.join(basedir, 'app.db?check_same_thread=False')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True  #sign the session cookie sid
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
