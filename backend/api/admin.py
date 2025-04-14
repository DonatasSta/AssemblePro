from django.contrib import admin
from .models import Profile, ServiceListing, ProjectListing, Message, Review

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_assembler', 'average_rating', 'location', 'date_joined')
    list_filter = ('is_assembler',)
    search_fields = ('user__username', 'user__email', 'location')

@admin.register(ServiceListing)
class ServiceListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider', 'hourly_rate', 'experience_years', 'is_available', 'created_at')
    list_filter = ('is_available', 'experience_years')
    search_fields = ('title', 'description', 'provider__username')

@admin.register(ProjectListing)
class ProjectListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'furniture_type', 'budget', 'status', 'created_at')
    list_filter = ('status', 'furniture_type')
    search_fields = ('title', 'description', 'creator__username', 'location')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('sender__username', 'receiver__username', 'content')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('project', 'reviewer', 'reviewee', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('reviewer__username', 'reviewee__username', 'comment')
