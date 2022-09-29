from app import calc_app,db
from app.models import User

@calc_app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User}

