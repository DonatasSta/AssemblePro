import pytest
from django.contrib.auth.models import User
from decimal import Decimal
from api.models import Profile, ServiceListing, ProjectListing, Review
from api.serializers import (
    ProfileSerializer, ServiceListingSerializer, 
    ProjectListingSerializer, ReviewSerializer,
    RegisterSerializer
)

@pytest.mark.django_db
class TestProfileSerializer:
    def test_profile_serialization(self):
        # Create a user with profile
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='strongpassword',
            first_name='Test',
            last_name='User'
        )
        
        profile = Profile.objects.create(
            user=user,
            bio='Test bio',
            location='London',
            phone='+44 1234 567890',
            is_assembler=True
        )
        
        # Serialize the profile
        serializer = ProfileSerializer(profile)
        data = serializer.data
        
        # Check serialized data
        assert data['username'] == 'testuser'
        assert data['email'] == 'test@example.com'
        assert data['first_name'] == 'Test'
        assert data['last_name'] == 'User'
        assert data['bio'] == 'Test bio'
        assert data['location'] == 'London'
        assert data['phone'] == '+44 1234 567890'
        assert data['is_assembler'] is True
        assert data['average_rating'] == 0.0

    def test_profile_update(self):
        # Create a user with profile
        user = User.objects.create_user(
            username='updateuser',
            email='update@example.com',
            password='strongpassword',
            first_name='Update',
            last_name='User'
        )
        
        profile = Profile.objects.create(
            user=user,
            bio='Original bio',
            location='London',
            is_assembler=False
        )
        
        # Update data
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'bio': 'Updated bio',
            'location': 'Manchester',
            'phone': '+44 9876 543210',
            'is_assembler': True
        }
        
        # Update the profile through the serializer
        serializer = ProfileSerializer(profile, data=update_data, partial=True)
        assert serializer.is_valid()
        updated_profile = serializer.save()
        
        # Check the updated profile
        assert updated_profile.bio == 'Updated bio'
        assert updated_profile.location == 'Manchester'
        assert updated_profile.phone == '+44 9876 543210'
        assert updated_profile.is_assembler is True
        
        # Check that the user was also updated
        user.refresh_from_db()
        assert user.first_name == 'Updated'
        assert user.last_name == 'Name'

@pytest.mark.django_db
class TestServiceListingSerializer:
    def test_service_listing_serialization(self):
        # Create a user with profile
        user = User.objects.create_user(
            username='serviceuser',
            email='service@example.com',
            password='strongpassword'
        )
        
        profile = Profile.objects.create(
            user=user,
            is_assembler=True,
            average_rating=4.5
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
        
        # Serialize the service
        serializer = ServiceListingSerializer(service)
        data = serializer.data
        
        # Check serialized data
        assert data['provider'] == user.id
        assert data['provider_name'] == 'serviceuser'
        assert data['provider_rating'] == 4.5
        assert data['title'] == 'Furniture Assembly Service'
        assert data['description'] == 'Professional assembly of all IKEA furniture'
        assert data['hourly_rate'] == '25.50'
        assert data['experience_years'] == 5
        assert data['is_available'] is True

@pytest.mark.django_db
class TestProjectListingSerializer:
    def test_project_listing_serialization(self):
        # Create users
        creator = User.objects.create_user(
            username='creator',
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
            status='in_progress',
            assigned_to=assembler
        )
        
        # Serialize the project
        serializer = ProjectListingSerializer(project)
        data = serializer.data
        
        # Check serialized data
        assert data['creator'] == creator.id
        assert data['creator_name'] == 'creator'
        assert data['title'] == 'Wardrobe Assembly Needed'
        assert data['description'] == 'Need help assembling a large IKEA wardrobe'
        assert data['furniture_type'] == 'Wardrobe'
        assert data['location'] == 'Manchester'
        assert data['budget'] == '100.00'
        assert data['status'] == 'in_progress'
        assert data['assigned_to'] == assembler.id
        assert data['assigned_to_name'] == 'assembler'

@pytest.mark.django_db
class TestReviewSerializer:
    def test_review_serialization(self):
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
        Profile.objects.create(user=assembler, is_assembler=True)
        
        # Create a project
        project = ProjectListing.objects.create(
            creator=customer,
            title='Chair Assembly',
            description='Assemble dining chairs',
            furniture_type='Chair',
            location='Edinburgh',
            budget=Decimal('60.00'),
            status='completed',
            assigned_to=assembler
        )
        
        # Create a review
        review = Review.objects.create(
            project=project,
            reviewer=customer,
            reviewee=assembler,
            rating=4,
            comment='Great work, very professional.'
        )
        
        # Serialize the review
        serializer = ReviewSerializer(review)
        data = serializer.data
        
        # Check serialized data
        assert data['project'] == project.id
        assert data['project_title'] == 'Chair Assembly'
        assert data['reviewer'] == customer.id
        assert data['reviewer_name'] == 'customer'
        assert data['reviewee'] == assembler.id
        assert data['reviewee_name'] == 'assembler'
        assert data['rating'] == 4
        assert data['comment'] == 'Great work, very professional.'

@pytest.mark.django_db
class TestRegisterSerializer:
    def test_valid_registration(self):
        # Valid registration data
        registration_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'Password123!',
            'password_confirm': 'Password123!',
            'first_name': 'New',
            'last_name': 'User',
            'is_assembler': True,
            'bio': 'Professional furniture assembler',
            'location': 'Birmingham',
            'phone': '+44 7890 123456'
        }
        
        # Test serializer validation
        serializer = RegisterSerializer(data=registration_data)
        assert serializer.is_valid()
        
        # Test user creation
        user = serializer.save()
        
        # Check user data
        assert user.username == 'newuser'
        assert user.email == 'newuser@example.com'
        assert user.first_name == 'New'
        assert user.last_name == 'User'
        assert user.check_password('Password123!')
        
        # Check profile data
        profile = Profile.objects.get(user=user)
        assert profile.is_assembler is True
        assert profile.bio == 'Professional furniture assembler'
        assert profile.location == 'Birmingham'
        assert profile.phone == '+44 7890 123456'
        
    def test_password_mismatch(self):
        # Invalid registration data with password mismatch
        registration_data = {
            'username': 'invaliduser',
            'email': 'invalid@example.com',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword!',
            'first_name': 'Invalid',
            'last_name': 'User'
        }
        
        # Test serializer validation
        serializer = RegisterSerializer(data=registration_data)
        assert not serializer.is_valid()
        assert 'password_confirm' in serializer.errors