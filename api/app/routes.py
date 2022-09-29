from flask import request, abort, session
from flask.json import jsonify 
from app import calc_app, db
from app import bcrypt
from app.models import User


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
