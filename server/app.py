from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


# Initialize SQLAlchemy and Migrate outside the create_app function
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'
    app.config['SECRET_KEY'] = 'your_secret_key'

    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)

     # Enable CORS for all routes
    CORS(app, supports_credentials=True)

    # Import models here to ensure they are registered with the correct db instance
    from models import User, Category, Paint, Order, OrderItem

    # Define your routes
    @app.route('/')
    def index():
        return "Welcome to the Paint Shop!"

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        new_user = User(username=data['username'], email=data['email'], password=data['password'], role='user')
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email'], password=data['password']).first()
        if user:
           session['user_id'] = user.id
           session['role'] = user.role  # Store role in session
           return jsonify({"message": "Logged in successfully", "role": user.role}), 200
        return jsonify({"message": "Invalid credentials"}), 401


    @app.route('/users', methods=['GET'])
    def get_users():
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    @app.route('/users/<int:user_id>', methods=['GET'])
    def get_user(user_id):
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict())
        return jsonify({"message": "User not found"}), 404

    @app.route('/users/<int:user_id>', methods=['PUT'])
    def update_user(user_id):
        data = request.get_json()
        user = User.query.get(user_id)
        if user:
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.password = data.get('password', user.password)
            db.session.commit()
            return jsonify({"message": "User updated successfully"})
        return jsonify({"message": "User not found"}), 404

    @app.route('/users/<int:user_id>', methods=['DELETE'])
    def delete_user(user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"message": "User deleted successfully"})
        return jsonify({"message": "User not found"}), 404

    @app.route('/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.all()
        return jsonify([cat.to_dict() for cat in categories])

    @app.route('/paints', methods=['GET'])
    def get_paints():
        paints = Paint.query.all()
        return jsonify([paint.to_dict() for paint in paints])

    @app.route('/paints', methods=['POST'])
    def add_paint():
        data = request.get_json()
        new_paint = Paint(
            name=data['name'],
            price=data['price'],
            size=data['size'],
            color=data['color'],
            availability=data['availability'],
            category_id=data['category_id'],
            image_url=data.get('image_url')  # Handle image_url field
        )
        db.session.add(new_paint)
        db.session.commit()
        return jsonify({"message": "Paint added successfully"}), 201
    
    @app.route('/paints/<int:paint_id>', methods=['PUT'])
    def update_paint(paint_id):
        data = request.get_json()
        paint = Paint.query.get(paint_id)
        if paint:
           paint.name = data.get('name', paint.name)
           paint.price = data.get('price', paint.price)
           paint.size = data.get('size', paint.size)
           paint.color = data.get('color', paint.color)
           paint.availability = data.get('availability', paint.availability)
           paint.category_id = data.get('category_id', paint.category_id)
           paint.image_url = data.get('image_url', paint.image_url)
           db.session.commit()
           return jsonify({"message": "Paint updated successfully"})
        return jsonify({"message": "Paint not found"}), 404


    @app.route('/paints/<int:paint_id>', methods=['DELETE'])
    def delete_paint(paint_id):
        paint = Paint.query.get(paint_id)
        if paint:
           db.session.delete(paint)
           db.session.commit()
           return jsonify({"message": "Paint deleted successfully"})
        return jsonify({"message": "Paint not found"}), 404



    @app.route('/orders', methods=['POST'])
    def create_order():
        data = request.get_json()
        order = Order(user_id=session.get('user_id'))
        db.session.add(order)
        db.session.commit()
        for item in data['items']:
            order_item = OrderItem(
                order_id=order.id,
                paint_id=item['paint_id'],
                quantity=item['quantity']
            )
            db.session.add(order_item)
        db.session.commit()
        return jsonify({"message": "Order placed successfully"}), 201

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Ensure the database and tables are created
    app.run(debug=True)
