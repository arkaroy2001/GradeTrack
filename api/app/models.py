from app import db
from datetime import datetime
from flask_bcrypt import generate_password_hash
from flask_bcrypt import check_password_hash


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    def __repr__(self):
        return '<User {}>'.format(self.username)

    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'id'         : self.id,
           'username' : self.username,
           'email'         : self.email
       }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Classes(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key = True)
    class_name = db.Column(db.String(64))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'id'         : self.id,
           'class_name' : self.class_name,
           'timestamp'         : self.timestamp,
           'user_id'         : self.user_id
       }
    
    @property
    def names_only(self):
       """Return object data in easily serializable format"""
       return {
           'class_name' : self.class_name
       }

    def __repr__(self):
        return '<Task {}>'.format(self.class_name)

class Group(db.Model):
    __tablename__ = 'group'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(64))
    type = db.Column(db.String(10))
    grade = db.Column(db.Integer, default=0)
    weight = db.Column(db.Integer)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    def __repr__(self):
        return '<Task {}>'.format(self.name)

    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'id'         : self.id,
           'main_group_name' : self.name,
           'type':self.type,
           'grade':self.grade,
           'weight':self.weight,
           'timestamp'         : self.timestamp,
           'user_id'         : self.user_id,
           'class_id': self.class_id
       }

# class SubGroup(db.Model):
#     __tablename__='subgroup'
#     id = db.Column(db.Integer, primary_key = True)
#     name = db.Column(db.String(64))
#     grade = db.Column(db.Integer)
#     weight = db.Column(db.Integer)
#     class_id = db.Column(db.Integer, db.ForeignKey('class.id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     def __repr__(self):
#         return '<Task {}>'.format(self.name)