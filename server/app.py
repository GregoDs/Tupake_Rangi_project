from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import stripe
import paypalrestsdk


# Initialize SQLAlchemy and Migrate outside the create_app function
db = SQLAlchemy()
migrate = Migrate()


stripe.api_key = 'sk_test_51NhQVmGSMQUybJjfdMIwI0bgWR85hnC4RWIzozgB5VG8t32eDuf8zq829MZVdvq5SnkMC8YyEWDGSsgZGYpo7Zch003blsXJDR'

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'
    app.config['SECRET_KEY'] = 'your_secret_key'
    
    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for all routes
    CORS(app, supports_credentials=True)


     # Configure PayPal SDK
    paypalrestsdk.configure({
        "mode": "sandbox",  # Change to "live" for production
        "client_id": "Ab-cjijvL3H4mWqn_Vt4g1JN_vwrWUbwTupqHkDvjcNI7gVUk8b92D6o4QqmQUJomxj-NDvdhXBDWV0L",
        "client_secret": "EG73GEAEwH6YhILDac-7crjPPgZOmUM3lPBOclycFkXsbo6nBrzbmIMRGoAe-IM4RghWpXY8IL0mJBNd"
    })

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

    @app.route('/logout', methods=['POST'])
    def logout():
        session.pop('user_id', None)
        session.pop('role', None)
        session.pop('cart', None)  # Clear cart from session on logout
        return jsonify({"message": "Logged out successfully"}), 200

    @app.route('/user', methods=['GET'])
    def get_user_info():
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                return jsonify(user.to_dict())
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

    @app.route('/cart', methods=['GET'])
    def get_cart_items():
        if 'cart' in session:
            cart_items = session['cart']
            for item in cart_items:
                paint = Paint.query.get(item['paint_id'])
                if paint:
                    item.update({
                        'name': paint.name,
                        'price': paint.price,
                        'size': paint.size,
                        'color': paint.color,
                        'image_url': paint.image_url
                    })
            return jsonify(cart_items)
        return jsonify([])

    @app.route('/cart', methods=['POST'])
    def add_to_cart():
        data = request.get_json()
        if 'paint_id' not in data or 'quantity' not in data:
            return jsonify({"error": "Missing paint_id or quantity"}), 400
    
        if 'cart' not in session:
            session['cart'] = []

        cart = session['cart']
        paint_id = data['paint_id']
        quantity = data.get('quantity', 1)

        # Fetch the paint details from the database
        paint = Paint.query.get(paint_id)
        if not paint:
            return jsonify({"error": "Paint not found"}), 404

        item = {
            'paint_id': paint.id,
            'name': paint.name,
            'price': paint.price,
            'size': paint.size,
            'color': paint.color,
            'image_url': paint.image_url,
            'quantity': quantity
        }

        # Check if the item is already in the cart
        for cart_item in cart:
            if cart_item['paint_id'] == paint_id:
                cart_item['quantity'] += quantity
                break
        else:
            cart.append(item)

        session.modified = True
        return jsonify({"message": "Item added to cart"}), 200

    @app.route('/cart/update', methods=['POST'])
    def update_cart():
        data = request.get_json()
        if 'paint_id' not in data or 'quantity' not in data:
            return jsonify({"error": "Missing paint_id or quantity"}), 400

        paint_id = data['paint_id']
        quantity = data['quantity']

        if 'cart' not in session:
            session['cart'] = []

        cart = session['cart']

        # Find the item and update its quantity
        for cart_item in cart:
            if cart_item['paint_id'] == paint_id:
                cart_item['quantity'] += quantity
                if cart_item['quantity'] <= 0:
                    cart.remove(cart_item)  # Remove item if quantity is 0 or less
                break
        else:
            if quantity > 0:
                paint = Paint.query.get(paint_id)
                if paint:
                    cart.append({
                        'paint_id': paint_id,
                        'name': paint.name,
                        'price': paint.price,
                        'size': paint.size,
                        'color': paint.color,
                        'image_url': paint.image_url,
                        'quantity': quantity
                    })

        session.modified = True
        return jsonify({"message": "Cart updated"}), 200

    @app.route('/cart', methods=['DELETE'])
    def remove_from_cart():
        data = request.get_json()
        if 'paint_id' in data:
            paint_id = data['paint_id']
            if 'cart' in session:
                cart = session['cart']
                session['cart'] = [item for item in cart if item['paint_id'] != paint_id]
                session.modified = True
            return jsonify({"message": "Item removed from cart"}), 200
        return jsonify({"error": "Invalid request"}), 400

    @app.route('/cart/count', methods=['GET'])
    def get_cart_count():
        if 'cart' in session:
            return jsonify({'count': len(session['cart'])}), 200
        return jsonify({'count': 0}), 200

    @app.route('/orders', methods=['POST'])
    def create_order():
        data = request.get_json()
        order = Order(user_id=session.get('user_id'))
        db.session.add(order)
        db.session.commit()
        for item in session.get('cart', []):
            order_item = OrderItem(
                order_id=order.id,
                paint_id=item['paint_id'],
                quantity=item['quantity']
            )
            db.session.add(order_item)
        db.session.commit()
        session.pop('cart', None)  # Clear the cart after order
        return jsonify({"message": "Order placed successfully"}), 201
    


    # Stripe Checkout Session route
    @app.route('/create-checkout-session', methods=['POST'])
    def create_checkout_session():
        try:
            data = request.json
            print("Received data:", data)
            line_items = data['line_items']  # Extract the line_items from the request data

            session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/cancel',
        )
            return jsonify({'id': session.id})
        except Exception as e:
            return jsonify({'error': str(e)}), 403
    

    @app.route('/create-paypal-payment', methods=['POST'])
    def create_paypal_payment():
        try:
            data = request.get_json()
            total_amount = data['total_amount']
            return_url = "http://localhost:3000/success"
            cancel_url = "http://localhost:3000/cancel"

            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": return_url,
                    "cancel_url": cancel_url
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Paint",
                            "sku": "item",
                            "price": total_amount,
                            "currency": "KES",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "total": total_amount,
                        "currency": "USD"
                    },
                    "description": "Paint Purchase"
                }]
            })

            if payment.create():
                approval_url = next(link.href for link in payment.links if link.rel == "approval_url")
                return jsonify({"approval_url": approval_url}), 200
            else:
                return jsonify({"error": payment.error}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/execute-paypal-payment', methods=['POST'])
    def execute_paypal_payment():
        try:
            data = request.get_json()
            payment_id = data['payment_id']
            payer_id = data['payer_id']

            payment = paypalrestsdk.Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                # Payment executed successfully, handle order creation here
                return jsonify({"message": "Payment executed successfully"}), 200
            else:
                return jsonify({"error": payment.error}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app




    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Ensure the database and tables are created
    app.run(debug=True)
