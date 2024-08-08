from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description
        }


class Paint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    availability = db.Column(db.Boolean, default=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship('Category', backref=db.backref('paints', lazy=True))
    image_url = db.Column(db.String(255), nullable=True)  # Add this line

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'size': self.size,
            'color': self.color,
            'availability': self.availability,
            'category_id': self.category_id,
            'image_url': self.image_url  # Add this line if you want to include image_url in the dictionary representation
        }
    

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    complete = db.Column(db.Boolean, default=False)  # Add this line

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'complete': self.complete  # Include this line if you want to include complete in the dictionary representation
        }
    
    
class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    order = db.relationship('Order', backref=db.backref('items', lazy=True))
    paint_id = db.Column(db.Integer, db.ForeignKey('paint.id'), nullable=False)
    paint = db.relationship('Paint', backref=db.backref('order_items', lazy=True))
    quantity = db.Column(db.Integer, nullable=False)
