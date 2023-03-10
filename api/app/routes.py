from flask import request, abort, session
from flask.json import jsonify 
from app import calc_app, db
from app import bcrypt
from app.models import User, Classes, Group
import sys


@calc_app.route('/register', methods=['POST'])
def register():
    email = request.json.get("email", None)
    username = request.json.get("username",None)
    password = request.json.get('password', None)

    user_exists = User.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({"error": "Unauthorized"}),409
    
    new_user = User(email=email,username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id


    return jsonify({
        "id": new_user.id,
        "email": new_user.email 
    })

@calc_app.route('/@me')
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        "id": user.id,
        "email": user.email 
    })

@calc_app.route('/correct-user',methods=['GET'])
def correctUser():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    
    return jsonify({
        "uid":user_id
    })


@calc_app.route('/get-all-users')
def get_all_users():
    users = User.query.all()

    return jsonify(json_list=[i.serialize for i in users])
    
@calc_app.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get('password', None)

    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"error":"Unauthorized"}),401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email 
    })

@calc_app.route('/logout', methods=["POST"])
def logout():
    session.pop("user_id")
    return "200"
    

@calc_app.route('/add-class', methods=["POST"])
def addClass():
    class_name = request.json.get("currClass")
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401
    
    class_and_user_exists = Classes.query.filter_by(user_id=user_id,class_name=class_name).first()
    
    if class_and_user_exists is not None:
        return jsonify({"error": "Unauthorized"}),409

    if class_name=="" or class_name is None:
        return jsonify({"error":"Unauthorized"}),400

    new_class = Classes(class_name=class_name, user_id=user_id) 

    db.session.add(new_class)
    db.session.commit()

    i_d = getClass(user_id,class_name)

    if not i_d:
        return jsonify({"error":"Unauthorized"}),400

    class_id = i_d

    return jsonify({
        "user_id": user_id,
        "class_name": class_name,
        "class_id":class_id.id
    })

@calc_app.route('/get-classes',methods=['GET'])
def getClasses():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    classes_name = Classes.query.filter_by(user_id=user_id).all()

    return jsonify(json_list=[i.serialize for i in classes_name])

@calc_app.route('/get-class-names',methods=['GET'])
def getClassNames():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    classes_name = Classes.query.filter_by(user_id=user_id).all()

    return jsonify(json_list=[i.names_only for i in classes_name])

@calc_app.route('/remove-class', methods=["POST"])
def removeClass():
    class_name = request.json.get("id")
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401
    
    class_and_user_exists = Classes.query.filter_by(user_id=user_id,class_name=class_name).first()
    
    if class_and_user_exists is None:
        return jsonify({"error": "Unauthorized"}),409

    db.session.delete(class_and_user_exists)
    db.session.commit()

    return jsonify({
        "id": user_id,
        "class_name": class_name,
    })

@calc_app.route('/get-class-id')
def getCurrClassId():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

def getClass(user_id,class_name):
    return Classes.query.filter_by(user_id=user_id,class_name=class_name).first()

def getClassName(user_id,class_id):
    return Classes.query.filter_by(user_id=user_id,id=class_id).first()


@calc_app.route('/add-main-group', methods=['POST'])
def addNewMain():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    main_group_name = request.json.get('main_group_name')
    class_id = request.json.get('main_class_id')
    weight = request.json.get('main_group_weight')
    grade = request.json.get('main_group_grade')

    if main_group_name=="" or main_group_name is None:
        return jsonify({"error":main_group_name}),406

    if class_id=="" or class_id is None:
        return jsonify({"error":class_id}),402

    class_name = getClassName(user_id,class_id)

    

    group_type = 'main'
    
    group_exists = Group.query.filter_by(user_id=user_id,name=main_group_name,class_id=class_id,group_type=group_type,class_name=class_name.class_name).first()

    if group_exists is not None:
        return jsonify({"error": "Unauthorized"}),409

    new_group = Group(grade=grade,class_name=class_name.class_name,name=main_group_name,group_type=group_type,weight=weight,class_id=class_id,user_id=user_id)
    
    db.session.add(new_group)
    db.session.commit()

    # return jsonify({
    #     "id": user_id,
    #     "group_name": main_name,
    #     "class_name": class_name
    # })
    return jsonify(new_group.serialize)

@calc_app.route('/get-all-main-groups',methods=['GET'])
def getAllMainGroups():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    classes_name = Group.query.filter_by(user_id=user_id).all()
    print(classes_name)
    return jsonify(json_list=[i.serialize for i in classes_name])

@calc_app.route('/get-main-group',methods=['POST'])
def getMainGroup():
    user_id = session.get("user_id")
    class_id = request.json.get('class_id',None)

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    classes_name = Group.query.filter_by(user_id=user_id,class_id=class_id).all()
    print(classes_name)
    return jsonify(json_list=[i.serialize for i in classes_name])

@calc_app.route('/delete-main-group',methods=['POST'])
def removeSingleMainGroup():
    main_group_name = request.json.get("name")
    #class_name = request.json.get("class_name")
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401
    
    maingroup_and_user_exists = Group.query.filter_by(user_id=user_id,name=main_group_name).first()
    
    if maingroup_and_user_exists is None:
        return jsonify({"error": "Unauthorized"}),409

    db.session.delete(maingroup_and_user_exists)
    db.session.commit()

    return jsonify({
        "id": user_id,
        "main_group_name": main_group_name
    })

@calc_app.route('/delete-all-main-groups',methods=['POST'])
def removeAllMainGroupsForClass():
    #main_group_name = request.json.get("name")
    #class_name = request.json.get("class_name")
    user_id = session.get("user_id")
    class_name = request.json.get("class_name")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401
    
    class_groups = Group.query.filter_by(user_id=user_id,class_name=class_name).all()
    
    if class_groups is None:
        return jsonify({"error": "Unauthorized"}),409

    for i in class_groups:
        db.session.delete(i)
        db.session.commit()

    return jsonify({
        "id": user_id,
        "class_name": class_name
    })

@calc_app.route('/get-final-grade',methods=['POST'])
def calculateFinalGrade():
    user_id = request.json.get("user_id")
    class_id = request.json.get("class_id")

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401

    class_exists = Classes.query.filter_by(user_id=user_id,id=class_id).all()

    if class_exists is None:
        return jsonify({"error": "Unauthorized"}),409

    return jsonify(json_list=[i.serialize for i in class_exists])

