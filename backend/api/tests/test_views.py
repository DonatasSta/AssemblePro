import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from decimal import Decimal
from api.models import Profile, ServiceListing, ProjectListing, Message, Review

@pytest.mark.django_db
class TestServiceListingAPI:
    def setup_method(self):
        # Set up test client
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='strongpassword'
        )
        
        # Create assembler profile
        Profile.objects.create(
            user=self.user,
            is_assembler=True,
            location='London'
        )
        
        # Create a service listing
        self.service = ServiceListing.objects.create(
            provider=self.user,
            title='Furniture Assembly Service',
            description='Professional assembly of all IKEA furniture',
            hourly_rate=Decimal('25.50'),
            experience_years=5,
            is_available=True
        )

    def test_get_service_listings(self):
        # Get all service listings
        url = reverse('servicelisting-list')
        response = self.client.get(url)
        
        # Check that the request was successful
        assert response.status_code == status.HTTP_200_OK
        # Check that the response contains the service listing
        assert len(response.data) >= 1
        
        # Check that the first service has expected data
        service_data = next(item for item in response.data if item['id'] == self.service.id)
        assert service_data['title'] == 'Furniture Assembly Service'
        assert service_data['hourly_rate'] == '25.50'
        assert service_data['provider_name'] == 'testuser'

    def test_create_service_listing_authenticated(self):
        # Log in the user
        self.client.force_authenticate(user=self.user)
        
        # Create a new service listing
        url = reverse('servicelisting-list')
        data = {
            'title': 'New Assembly Service',
            'description': 'Specialized in wardrobe assembly',
            'hourly_rate': '30.00',
            'experience_years': 3,
            'is_available': True
        }
        
        response = self.client.post(url, data)
        
        # Check that the service was created
        assert response.status_code == status.HTTP_201_CREATED
        assert ServiceListing.objects.count() == 2
        
        # Check the service data
        new_service = ServiceListing.objects.get(title='New Assembly Service')
        assert new_service.provider == self.user
        assert new_service.hourly_rate == Decimal('30.00')
        assert new_service.experience_years == 3

    def test_create_service_listing_unauthenticated(self):
        # Try to create a new service listing without authentication
        url = reverse('servicelisting-list')
        data = {
            'title': 'Unauthorized Service',
            'description': 'Should not be created',
            'hourly_rate': '20.00',
            'experience_years': 1,
            'is_available': True
        }
        
        response = self.client.post(url, data)
        
        # Check that the service was not created
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert ServiceListing.objects.count() == 1

@pytest.mark.django_db
class TestProjectListingAPI:
    def setup_method(self):
        # Set up test client
        self.client = APIClient()
        
        # Create test users
        self.customer = User.objects.create_user(
            username='customer',
            email='customer@example.com',
            password='strongpassword'
        )
        
        self.assembler = User.objects.create_user(
            username='assembler',
            email='assembler@example.com',
            password='strongpassword'
        )
        
        # Create profiles
        Profile.objects.create(user=self.customer, is_assembler=False)
        Profile.objects.create(user=self.assembler, is_assembler=True)
        
        # Create a project listing
        self.project = ProjectListing.objects.create(
            creator=self.customer,
            title='Wardrobe Assembly Help',
            description='Need help with a large wardrobe',
            furniture_type='Wardrobe',
            location='Manchester',
            budget=Decimal('100.00'),
            status='open'
        )

    def test_get_project_listings(self):
        # Get all project listings
        url = reverse('projectlisting-list')
        response = self.client.get(url)
        
        # Check that the request was successful
        assert response.status_code == status.HTTP_200_OK
        # Check that the response contains the project listing
        assert len(response.data) >= 1
        
        # Check that the first project has expected data
        project_data = next(item for item in response.data if item['id'] == self.project.id)
        assert project_data['title'] == 'Wardrobe Assembly Help'
        assert project_data['budget'] == '100.00'
        assert project_data['creator_name'] == 'customer'
        assert project_data['status'] == 'open'

    def test_assign_project(self):
        # Log in the assembler
        self.client.force_authenticate(user=self.assembler)
        
        # Assign the project to the assembler
        url = reverse('projectlisting-assign', kwargs={'pk': self.project.id})
        response = self.client.post(url)
        
        # Check that the assignment was successful
        assert response.status_code == status.HTTP_200_OK
        
        # Refresh the project from the database
        self.project.refresh_from_db()
        assert self.project.assigned_to == self.assembler
        assert self.project.status == 'in_progress'
        
        # Check the response data
        assert response.data['assigned_to'] == self.assembler.id
        assert response.data['status'] == 'in_progress'

@pytest.mark.django_db
class TestReviewAPI:
    def setup_method(self):
        # Set up test client
        self.client = APIClient()
        
        # Create test users
        self.customer = User.objects.create_user(
            username='customer',
            email='customer@example.com',
            password='strongpassword'
        )
        
        self.assembler = User.objects.create_user(
            username='assembler',
            email='assembler@example.com',
            password='strongpassword'
        )
        
        # Create profiles
        Profile.objects.create(user=self.customer, is_assembler=False)
        self.assembler_profile = Profile.objects.create(user=self.assembler, is_assembler=True)
        
        # Create a completed project
        self.project = ProjectListing.objects.create(
            creator=self.customer,
            title='Table Assembly',
            description='Help with dining table',
            furniture_type='Table',
            location='Birmingham',
            budget=Decimal('75.00'),
            status='completed',
            assigned_to=self.assembler
        )

    def test_create_review(self):
        # Log in the customer
        self.client.force_authenticate(user=self.customer)
        
        # Create a review
        url = reverse('review-list')
        data = {
            'project': self.project.id,
            'reviewee': self.assembler.id,
            'rating': 5,
            'comment': 'Excellent work, very professional!'
        }
        
        response = self.client.post(url, data)
        
        # Check that the review was created
        assert response.status_code == status.HTTP_201_CREATED
        assert Review.objects.count() == 1
        
        # Check the review data
        review = Review.objects.first()
        assert review.project == self.project
        assert review.reviewer == self.customer
        assert review.reviewee == self.assembler
        assert review.rating == 5
        assert review.comment == 'Excellent work, very professional!'
        
        # Check that the assembler's average rating was updated
        self.assembler_profile.refresh_from_db()
        assert self.assembler_profile.average_rating == 5.0