from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ServiceListing, ProjectListing, Message, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 
                  'location', 'phone', 'is_assembler', 'average_rating', 'date_joined']
        read_only_fields = ['id', 'average_rating', 'date_joined']
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class ServiceListingSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_rating = serializers.FloatField(source='provider.profile.average_rating', read_only=True)
    
    class Meta:
        model = ServiceListing
        fields = ['id', 'provider', 'provider_name', 'provider_rating', 'title', 'description', 
                  'hourly_rate', 'experience_years', 'is_available', 'created_at', 'updated_at']
        read_only_fields = ['id', 'provider', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        validated_data['provider'] = self.context['request'].user
        return super().create(validated_data)

class ProjectListingSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True, allow_null=True)
    
    class Meta:
        model = ProjectListing
        fields = ['id', 'creator', 'creator_name', 'title', 'description', 'furniture_type', 
                  'location', 'budget', 'status', 'assigned_to', 'assigned_to_name', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 
                  'content', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']
        
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.username', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'project', 'project_title', 'reviewer', 'reviewer_name', 
                  'reviewee', 'reviewee_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'reviewer', 'created_at']
        
    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    is_assembler = serializers.BooleanField(required=False, default=False)
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'is_assembler', 'bio', 'location', 'phone']
        
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        profile_data = {
            'is_assembler': validated_data.pop('is_assembler', False),
            'bio': validated_data.pop('bio', ''),
            'location': validated_data.pop('location', ''),
            'phone': validated_data.pop('phone', '')
        }
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        Profile.objects.create(user=user, **profile_data)
        return user
