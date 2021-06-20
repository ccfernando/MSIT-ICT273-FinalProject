from flask import jsonify
from flask_restplus import Resource, Api
from random import randrange
import random
from website import db, app
from .routes import blueprint

api = Api(blueprint, doc='/documentation')
app.register_blueprint(blueprint)


class PersonModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gender = db.Column(db.String(200), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    wearingMask = db.Column(db.Integer, nullable=False)
    wearingFaceShield = db.Column(db.Integer, nullable=False)
    temp = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return self.id

    def to_json(self):
        return {
            'id': self.id,
            'Gender': self.gender,
            'Age': self.age,
            'WearingMask': self.wearingMask,
            'WearingFaceShield': self.wearingFaceShield,
            'Temperature': self.temp
        }


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    score = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"{self.id, self.name, self.score}"

    def to_json2(self):
        return {
            'id': self.id,
            'name': self.name,
            'score': self.score
        }


db.create_all()


class Generate_Random(Resource):
    def post(self, ranNum):
        for person_id in range(ranNum + 1):
            # check if random data already exist, if yes, generate new random data
            result = PersonModel.query.filter_by(id=person_id).first()
            if result:
                db.session.query(PersonModel).delete()

            Random_Data = {
                'gender': random.choice(['M', 'F']),
                'age': randrange(90),
                'wearingmask': randrange(2),
                'wearingfaceshield': randrange(2),
                'temp': float(random.randrange(3600, 3830)) / 100
            }

            person = PersonModel(gender=Random_Data['gender'], age=Random_Data['age'],
                                 wearingMask=Random_Data['wearingmask'],
                                 wearingFaceShield=Random_Data['wearingfaceshield'],
                                 temp=Random_Data['temp'])

            db.session.add(person)
            db.session.commit()

        message = {'status': '200', 'message': 'Random Persons Successfully Generated'}
        return jsonify(message)


class User_Reg(Resource):
    def post(self, nickname):
        user = UserModel(name=nickname, score=0)

        db.session.add(user)
        db.session.commit()

        message = {'status': '200', 'message': 'User Successfully Added'}
        return jsonify(message)


class get_last_user(Resource):
    def get(self):
        result = UserModel.query.order_by(UserModel.id.desc()).first()
        return jsonify(result.to_json2())


class check_ans(Resource):
    def get(self, person_id, answer):
        Random_Data = PersonModel.query.filter_by(id=person_id).first()

        if Random_Data.temp > 37.2:
            ans = "Capture"

        elif Random_Data.wearingMask == 0 or Random_Data.wearingFaceShield == 0 or Random_Data.age < 18 or Random_Data.age > 65:
            ans = "Deny"

        else:
            ans = "Allow"

        if ans == answer:
            message = {'status': '200', 'result': 'correct'}

        else:
            message = {'status': '200', 'result': 'wrong'}

        return jsonify(message)


class get_all_person(Resource):
    def get(self):
        result = PersonModel.query.order_by(PersonModel.id.asc()).all()
        if result:
            return jsonify([e.to_json() for e in result])
        else:
            message = {'Error': 'Bad Request', 'message': 'No scores found'}
            return jsonify(message)


class del_user(Resource):
    def delete(self, user_id):
        result = UserModel.query.filter_by(id=user_id).delete()
        if result:
            db.session.commit()
            message = {'user_id': user_id, 'status': 'deleted'}

        else:
            message = {'error': 'Bad Request', 'message': 'User ID does not exist'}
        return jsonify(message)


class del_person(Resource):
    def delete(self, person_id):
        result = PersonModel.query.filter_by(id=person_id).delete()
        if result:
            db.session.commit()
            message = {'personID': person_id, 'status': 'deleted'}
        else:
            message = {'error': 'Bad Request', 'message': 'Person ID does not exist'}
        return jsonify(message)


class update_score(Resource):
    def put(self, user_id, user_score):
        result = UserModel.query.filter_by(id=user_id).first()
        if result:
            result.score = user_score
            db.session.commit()
            message = {'userID': user_id, 'status': 'Score Updated'}
        else:
            message = {'error': 'Bad Request', 'message': 'User ID does not exist'}
        return jsonify(message)


class leaderboard(Resource):
    def get(self):
        result = UserModel.query.order_by(UserModel.score.desc()).limit(5).all()

        if result:
            return jsonify([e.to_json2() for e in result])
        else:
            message = {'error': 'Bad Request', 'message': 'No scores found'}
            return jsonify(message)


api.add_resource(Generate_Random, "/initialize/<int:ranNum>")
api.add_resource(User_Reg, "/register/<string:nickname>")
api.add_resource(get_all_person, "/getallperson/")
api.add_resource(del_person, "/delete/person/<int:person_id>")
api.add_resource(check_ans, "/check/person/<int:person_id>/<string:answer>")
api.add_resource(del_user, "/delete/user/<int:user_id>")
api.add_resource(update_score, "/updatescore/<int:user_id>/<int:user_score>")
api.add_resource(leaderboard, "/leaderboard/")
api.add_resource(get_last_user, "/getlastuser/")
