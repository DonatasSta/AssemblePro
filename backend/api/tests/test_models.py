import pytest
from django.contrib.auth.models import User
from decimal import Decimal
from api.models import Profile, ServiceListing, ProjectListing, Message, Review

@pytest.mark.django_db
class TestProfile:
    def test_profile_creation(self):
        # Create a user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='strongpassword'
        )
        
        # Create a profile (should be created automatically via signal, but we'll create it explicitly for testing)
        profile = Profile.objects.create(
            user=user,
            bio='Test bio',
            location='London',
            phone='+44 1234 567890',
            is_assembler=True
        )
        
        # Assert profile was created correctly
        assert Profile.objects.count() == 1
        assert profile.user == user
        assert profile.bio == 'Test bio'
        assert profile.location == 'London'
        assert profile.phone == '+44 1234 567890'
        assert profile.is_assembler is True
        assert profile.average_rating == 0.0  # Default rating
        assert profile.__str__() == "testuser's profile"

@pytest.mark.django_db
class TestServiceListing:
    def test_service_listing_creation(self):
        # Create a user
        user = User.objects.create_user(
            username='serviceuser',
            email='service@example.com',
            password='strongpassword'
        )
        
        # Create a service listing
        service = ServiceListing.objects.create(
            provider=user,
            title='Furniture Assembly Service',
            description='Professional assembly of all IKEA furniture',
            hourly_rate=Decimal('25.50'),
            experience_years=5,
            is_available=True
        )
        
        # Assert service was created correctly
        assert ServiceListing.objects.count() == 1
        assert service.provider == user
        assert service.title == 'Furniture Assembly Service'
        assert service.description == 'Professional assembly of all IKEA furniture'
        assert service.hourly_rate == Decimal('25.50')
        assert service.experience_years == 5
        assert service.is_available is True
        assert service.__str__() == "Furniture Assembly Service by serviceuser"

@pytest.mark.django_db
class TestProjectListing:
    def test_project_listing_creation(self):
        # Create users
        creator = User.objects.create_user(
            username='projectcreator',
            email='creator@example.com',
            password='strongpassword'
        )
        
        assembler = User.objects.create_user(
            username='assembler',
            email='assembler@example.com',
            password='strongpassword'
        )
        
        # Create a project listing
        project = ProjectListing.objects.create(
            creator=creator,
            title='Wardrobe Assembly Needed',
            description='Need help assembling a large IKEA wardrobe',
            furniture_type='Wardrobe',
            location='Manchester',
            budget=Decimal('100.00'),
            status='open',
            assigned_to=None
        )
        
        # Assert project was created correctly
        assert ProjectListing.objects.count() == 1
        assert project.creator == creator
        assert project.title == 'Wardrobe Assembly Needed'
        assert project.description == 'Need help assembling a large IKEA wardrobe'
        assert project.furniture_type == 'Wardrobe'
        assert project.location == 'Manchester'
        assert project.budget == Decimal('100.00')
        assert project.status == 'open'
        assert project.assigned_to is None
        assert project.__str__() == "Wardrobe Assembly Needed by projectcreator"
        
        # Test status update and assignment
        project.status = 'in_progress'
        project.assigned_to = assembler
        project.save()
        
        project.refresh_from_db()
        assert project.status == 'in_progress'
        assert project.assigned_to == assembler

@pytest.mark.django_db
class TestMessage:
    def test_message_creation(self):
        # Create users
        sender = User.objects.create_user(
            username='sender',
            email='sender@example.com',
            password='strongpassword'
        )
        
        receiver = User.objects.create_user(
            username='receiver',
            email='receiver@example.com',
            password='strongpassword'
        )
        
        # Create a message
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            content='Are you available to assemble my furniture next Tuesday?',
            is_read=False
        )
        
        # Assert message was created correctly
        assert Message.objects.count() == 1
        assert message.sender == sender
        assert message.receiver == receiver
        assert message.content == 'Are you available to assemble my furniture next Tuesday?'
        assert message.is_read is False
        assert message.__str__() == "Message from sender to receiver"
        
        # Test marking message as read
        message.is_read = True
        message.save()
        
        message.refresh_from_db()
        assert message.is_read is True

@pytest.mark.django_db
class TestReview:
    def test_review_creation_and_rating_update(self):
        # Create users
        customer = User.objects.create_user(
            username='customer',
            email='customer@example.com',
            password='strongpassword'
        )
        
        assembler = User.objects.create_user(
            username='assembler',
            email='assembler@example.com',
            password='strongpassword'
        )
        
        # Create profiles
        Profile.objects.create(user=customer)
        assembler_profile = Profile.objects.create(user=assembler)
        
        # Create a project
        project = ProjectListing.objects.create(
            creator=customer,
            title='Table Assembly Needed',
            description='Need help assembling a dining table',
            furniture_type='Table',
            location='Birmingham',
            budget=Decimal('75.00'),
            status='completed',
            assigned_to=assembler
        )
        
        # Create a review
        review = Review.objects.create(
            project=project,
            reviewer=customer,
            reviewee=assembler,
            rating=4,
            comment='Great work, arrived on time and did a perfect job.'
        )
        
        # Assert review was created correctly
        assert Review.objects.count() == 1
        assert review.project == project
        assert review.reviewer == customer
        assert review.reviewee == assembler
        assert review.rating == 4
        assert review.comment == 'Great work, arrived on time and did a perfect job.'
        assert review.__str__() == "Review by customer for assembler"
        
        # Verify that the assembler's average rating was updated
        assembler_profile.refresh_from_db()
        assert assembler_profile.average_rating == 4.0
        
        # Add another review to test average calculation
        project2 = ProjectListing.objects.create(
            creator=customer,
            title='Shelf Installation',
            description='Install wall shelves',
            furniture_type='Shelf',
            location='Edinburgh',
            budget=Decimal('50.00'),
            status='completed',
            assigned_to=assembler
        )
        
        Review.objects.create(
            project=project2,
            reviewer=customer,
            reviewee=assembler,
            rating=5,
            comment='Excellent service, highly recommended!'
        )
        
        # Verify average rating is updated correctly
        assembler_profile.refresh_from_db()
        assert assembler_profile.average_rating == 4.5  # Average of 4 and 5