import os
import django
import random
from datetime import datetime, timedelta

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assembleally.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Profile, ServiceListing, ProjectListing, Review, Message

# Delete all non-admin users and related data
print("Cleaning previous data...")
User.objects.exclude(username='admin').delete()

# Create sample users
print("Creating users...")
assembler1 = User.objects.create_user('john_assembler', 'john@example.com', 'password123')
assembler1.first_name = 'John'
assembler1.last_name = 'Smith'
assembler1.save()

assembler2 = User.objects.create_user('sarah_assembly', 'sarah@example.com', 'password123')
assembler2.first_name = 'Sarah'
assembler2.last_name = 'Johnson'
assembler2.save()

customer1 = User.objects.create_user('michael_customer', 'michael@example.com', 'password123')
customer1.first_name = 'Michael'
customer1.last_name = 'Brown'
customer1.save()

customer2 = User.objects.create_user('lisa_user', 'lisa@example.com', 'password123')
customer2.first_name = 'Lisa'
customer2.last_name = 'Davis'
customer2.save()

# Create profiles
print("Creating profiles...")
Profile.objects.create(
    user=assembler1,
    bio="IKEA specialist with 5+ years of experience. I can assemble any IKEA furniture quickly and efficiently.",
    location="New York, NY",
    phone="555-123-4567",
    is_assembler=True,
    average_rating=4.8
)

Profile.objects.create(
    user=assembler2,
    bio="Furniture assembly professional specialized in complex pieces. I take pride in attention to detail.",
    location="Boston, MA",
    phone="555-987-6543",
    is_assembler=True,
    average_rating=4.7
)

Profile.objects.create(
    user=customer1,
    bio="Looking for help with furniture assembly for my new apartment.",
    location="Chicago, IL",
    phone="555-456-7890",
    is_assembler=False
)

Profile.objects.create(
    user=customer2,
    bio="Moving to a new home and need furniture assembly services.",
    location="Miami, FL",
    phone="555-789-0123",
    is_assembler=False
)

# Create service listings
print("Creating service listings...")
service1 = ServiceListing.objects.create(
    provider=assembler1,
    title="IKEA Furniture Assembly Specialist",
    description="I specialize in assembling all types of IKEA furniture, from simple bookcases to complex wardrobes and beds. Fast, reliable service with attention to detail.",
    hourly_rate=35.00,
    experience_years=5,
    is_available=True
)

service2 = ServiceListing.objects.create(
    provider=assembler1,
    title="Office Furniture Setup",
    description="Professional assembly of office desks, chairs, filing cabinets, and cubicles. Perfect for small businesses or home offices.",
    hourly_rate=40.00,
    experience_years=3,
    is_available=True
)

service3 = ServiceListing.objects.create(
    provider=assembler2,
    title="Complex Furniture Assembly Pro",
    description="Specialized in complex furniture pieces that require precision. I can handle the most challenging assembly projects with ease.",
    hourly_rate=45.00,
    experience_years=7,
    is_available=True
)

service4 = ServiceListing.objects.create(
    provider=assembler2,
    title="Same-Day Furniture Assembly",
    description="Need your furniture assembled quickly? I offer same-day assembly services for most items when booked before noon.",
    hourly_rate=50.00,
    experience_years=7,
    is_available=True
)

# Create project listings
print("Creating project listings...")
project1 = ProjectListing.objects.create(
    creator=customer1,
    title="Wardrobe Assembly Needed",
    description="I have a large IKEA PAX wardrobe with sliding doors that needs assembly. All materials are available, and I need it completed this weekend.",
    furniture_type="Wardrobe",
    location="Chicago, IL",
    budget=150.00,
    status="open"
)

project2 = ProjectListing.objects.create(
    creator=customer1,
    title="Dining Table and Chairs",
    description="Need assembly of a dining table and 6 chairs from IKEA. The table is a MÖRBYLÅNGA and the chairs are HENRIKSDAL.",
    furniture_type="Dining Set",
    location="Chicago, IL",
    budget=120.00,
    status="open"
)

project3 = ProjectListing.objects.create(
    creator=customer2,
    title="Office Desk & Chair Setup",
    description="Need help setting up a standing desk and ergonomic chair. The desk is a BEKANT sit/stand and the chair is a MARKUS from IKEA.",
    furniture_type="Office Furniture",
    location="Miami, FL",
    budget=75.00,
    status="open"
)

project4 = ProjectListing.objects.create(
    creator=customer2,
    title="Bookshelf Assembly",
    description="I have 3 BILLY bookcases from IKEA that need assembly. All materials and tools are available.",
    furniture_type="Bookshelf",
    location="Miami, FL",
    budget=90.00,
    status="in_progress",
    assigned_to=assembler1
)

# Create some completed projects and reviews
completed_project = ProjectListing.objects.create(
    creator=customer1,
    title="Bed Frame Assembly",
    description="IKEA MALM bed frame that needed assembly. Was completed successfully.",
    furniture_type="Bed",
    location="Chicago, IL",
    budget=100.00,
    status="completed",
    assigned_to=assembler2
)

review1 = Review.objects.create(
    project=completed_project,
    reviewer=customer1,
    reviewee=assembler2,
    rating=5,
    comment="Sarah did an excellent job assembling my bed frame. She was punctual, professional, and completed the work efficiently. Highly recommend!"
)

# Create some messages
print("Creating messages...")
Message.objects.create(
    sender=customer1,
    receiver=assembler1,
    content="Hi John, I'm interested in your furniture assembly service. Are you available this weekend to help with my wardrobe?",
    is_read=True
)

Message.objects.create(
    sender=assembler1,
    receiver=customer1,
    content="Hello Michael, yes I'm available on Saturday afternoon. Would that work for you?",
    is_read=True
)

Message.objects.create(
    sender=customer1,
    receiver=assembler1,
    content="Saturday afternoon works perfectly. I'm located in Chicago, IL. Can you give me an estimate for how long it might take?",
    is_read=False
)

Message.objects.create(
    sender=customer2,
    receiver=assembler2,
    content="Hi Sarah, I saw your profile and was wondering if you could help with my office furniture assembly?",
    is_read=True
)

Message.objects.create(
    sender=assembler2,
    receiver=customer2,
    content="Hello Lisa, I'd be happy to help with your office furniture. Can you provide more details about what needs to be assembled?",
    is_read=False
)

print("Database seeded successfully!")