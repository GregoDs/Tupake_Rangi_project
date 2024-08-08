from app import create_app, db
from models import User, Category, Paint, Order, OrderItem

app = create_app()

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # Create sample users
    admin = User(username='admin', email='admin@example.com', password='admin123', role='admin')
    user1 = User(username='user1', email='user1@example.com', password='password1', role='user')
    user2 = User(username='user2', email='user2@example.com', password='password2', role='user')

    # Add users to the session
    db.session.add(admin)
    db.session.add(user1)
    db.session.add(user2)

    # Commit users to get their IDs
    db.session.commit()

    # Create sample categories
    interior = Category(description='Interior Paints for walls and ceilings.')
    exterior = Category(description='Exterior Paints for outdoor surfaces.')
    metal = Category(description='Paints specifically for metal surfaces.')

    # Add categories to the session
    db.session.add(interior)
    db.session.add(exterior)
    db.session.add(metal)

    # Commit categories to get their IDs
    db.session.commit()

    # Create sample paints with sizes
    paint1 = Paint(
        name='Interior Wall Paint',
        color='White',
        price=29.99,
        size='4 Ltr',
        availability=True,
        image_url='https://dt-paintpros.myshopify.com/cdn/shop/files/shop-8_5737f0c0-38ac-440b-90f5-e5b0d705bed5.jpg?v=1689165608&width=360',
        category_id=interior.id
    )

    paint2 = Paint(
        name='Exterior Paint',
        color='Blue',
        price=35.99,
        size='5 Ltr',
        availability=True,
        image_url='https://dt-paintpros.myshopify.com/cdn/shop/files/shop-8_5737f0c0-38ac-440b-90f5-e5b0d705bed5.jpg?v=1689165608&width=360',
        category_id=exterior.id
    )

    paint3 = Paint(
        name='Metal Paint',
        color='Red',
        price=45.99,
        size='1 Ltr',
        availability=True,
        image_url='https://dt-paintpros.myshopify.com/cdn/shop/files/shop-8_5737f0c0-38ac-440b-90f5-e5b0d705bed5.jpg?v=1689165608&width=360',
        category_id=metal.id
    )

    # Add paints to the session
    db.session.add(paint1)
    db.session.add(paint2)
    db.session.add(paint3)

    # Commit paints to get their IDs
    db.session.commit()

    # Create sample orders
    order1 = Order(user_id=user1.id)
    order2 = Order(user_id=user2.id, complete=True)

    # Add orders to the session
    db.session.add(order1)
    db.session.add(order2)

    # Commit orders to get their IDs
    db.session.commit()

    # Create sample order items
    order_item1 = OrderItem(order_id=order1.id, paint_id=paint1.id, quantity=2)
    order_item2 = OrderItem(order_id=order1.id, paint_id=paint2.id, quantity=1)
    order_item3 = OrderItem(order_id=order2.id, paint_id=paint3.id, quantity=3)

    # Add order items to the session
    db.session.add(order_item1)
    db.session.add(order_item2)
    db.session.add(order_item3)

    # Commit all changes
    db.session.commit()

print("Database seeded with sample data!")