import os
import redis
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")

    x=1

    if x == 1:
        SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:s7FZcQV5ETLUk0u@gradetrack-db.flycast:5432' or\
            os.environ.get('DATABASE_URL')
        SESSION_REDIS = redis.from_url("redis://default:8ae7eb3a9e494687872e669601a0a575@fly-gradecalc.upstash.io")
    else:
        SQLALCHEMY_DATABASE_URI='postgresql://postgres:postgres@localhost/gradetrack_dev'
        SESSION_REDIS = redis.from_url("redis://localhost:6379")

    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True} 

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True  #sign the session cookie sid
