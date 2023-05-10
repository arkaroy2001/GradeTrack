from app import db
from decimal import *
from datetime import datetime
from flask_bcrypt import generate_password_hash
from flask_bcrypt import check_password_hash
from sqlalchemy.orm import column_property
from sqlalchemy import func, select
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import cast, Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
class User(db.Model,Base):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    classes = db.relationship('Classes',backref='user',lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'user.id'         : self.id,
           'username' : self.username,
           'email'         : self.email
       }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


#grades of the class 
#name: HW
#group_type: main or sub
#grade: 50%
#weight: 20
#class_id: cse120
#user_id:6

class Group(db.Model,Base):
    __tablename__ = 'group'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(64))
    group_type = db.Column(db.String(10))
    grade = db.Column(db.Numeric(5,2))
    weight = db.Column(db.Numeric(5,2))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, index=True, default=func.now())
    def __repr__(self):
        return '<Task {}>'.format(self.name)

    @property
    def serialize(self):
        new_grade = self.grade

        if int(new_grade*100) % 10 == 0:
            string_num = str(new_grade)
            new_grade = float(string_num[:-1])
        

        if (int(new_grade*100) // 10) % 10 == 0:
            string_num_2 = str(new_grade)
            new_grade = float(string_num_2[:-1])

        new_weight = self.weight

        if int(new_weight*100) % 10 == 0:
            string_weight = str(new_weight)
            new_weight = float(string_weight[:-1])
        

        if (int(new_weight*100) // 10) % 10 == 0:
            string_weight_2 = str(new_weight)
            new_weight = float(string_weight_2[:-1])

        return {
            'main_group_id'         : self.id,
            'main_group_name' : self.name,
            'group_type':self.group_type,
            'main_group_grade':new_grade,
            'main_group_weight':new_weight,
            'timestamp'         : self.timestamp,
            'user_id'         : self.user_id,
            'class_id': self.class_id
        }

class Classes(db.Model,Base):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key = True)
    class_name = db.Column(db.String(64))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    final_grade = column_property(
        select(
            func.sum(Group.grade*Group.weight)
            /func.sum(Group.weight)
            )
        .where(Group.user_id==user_id)
        .where(id==Group.class_id)
        .scalar_subquery()
    )

    #class_grade = column_property(func.sum(Group.grade * Group.weight) / func.sum(Group.weight))
    # where user_id=Group.user_id and id=Group.class_id and group_type=main

    @hybrid_property
    def total(self):
        return self.id+self.user_id

    # @hybrid_property
    # def class_grade(self):
    #     return sum
    
    # @class_grade.expression
    # def class_grade(cls):
    #     return (
    #         select( (func.sum(Group.grade)*func.sum(Group.weight)) /func.sum(Group.weight) )
    #         .where(
    #             and_(
    #             table.c.id == 'id',
    #             table.c.name == 'name')
    #         )
    #         .label("class_grade")
    #     )

    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       final_grade_trunc = self.final_grade
       if self.final_grade is not None:
            final_grade_trunc = round(final_grade_trunc,2)
        
       return {
           'class_id'         : self.id,
           'class_name' : self.class_name,
           'timestamp'         : self.timestamp,
           'user_id'         : self.user_id,
           'grade': final_grade_trunc
       }
    
    @property
    def names_only(self):
       """Return object data in easily serializable format"""
       return {
           'class_name' : self.class_name
       }

    def __repr__(self):
        return '<Task {}>'.format(self.class_name)
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