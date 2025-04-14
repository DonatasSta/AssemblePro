from rest_framework import viewsets, generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Profile, ServiceListing, ProjectListing, Message, Review
from .serializers import (
    UserSerializer, ProfileSerializer, ServiceListingSerializer, 
    ProjectListingSerializer, MessageSerializer, ReviewSerializer,
    RegisterSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Profile.objects.all()
        is_assembler = self.request.query_params.get('is_assembler')
        
        if is_assembler:
            queryset = queryset.filter(is_assembler=is_assembler.lower() == 'true')
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class ServiceListingViewSet(viewsets.ModelViewSet):
    queryset = ServiceListing.objects.all().order_by('-created_at')
    serializer_class = ServiceListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['hourly_rate', 'experience_years', 'is_available']
    search_fields = ['title', 'description']
    ordering_fields = ['hourly_rate', 'experience_years', 'created_at']
    
    @action(detail=False, methods=['get'])
    def my_services(self, request):
        services = ServiceListing.objects.filter(provider=request.user).order_by('-created_at')
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)

class ProjectListingViewSet(viewsets.ModelViewSet):
    queryset = ProjectListing.objects.all().order_by('-created_at')
    serializer_class = ProjectListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['furniture_type', 'status', 'budget']
    search_fields = ['title', 'description', 'location', 'furniture_type']
    ordering_fields = ['budget', 'created_at']
    
    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        projects = ProjectListing.objects.filter(creator=request.user).order_by('-created_at')
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def assigned_to_me(self, request):
        projects = ProjectListing.objects.filter(assigned_to=request.user).order_by('-created_at')
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def assign(self, request, pk=None):
        project = self.get_object()
        
        if project.status != 'open':
            return Response(
                {"detail": "This project is not open for assignment."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Only the project creator can assign someone
        if project.creator != request.user:
            return Response(
                {"detail": "Only the project creator can assign assemblers."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        assigned_to_id = request.data.get('assigned_to')
        if not assigned_to_id:
            return Response(
                {"detail": "You must provide an assembler's user ID."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            assigned_to = User.objects.get(id=assigned_to_id)
            # Check if this user is an assembler
            if not hasattr(assigned_to, 'profile') or not assigned_to.profile.is_assembler:
                return Response(
                    {"detail": "This user is not registered as an assembler."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            project.assigned_to = assigned_to
            project.status = 'in_progress'
            project.save()
            
            serializer = self.get_serializer(project)
            return Response(serializer.data)
            
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        project = self.get_object()
        new_status = request.data.get('status')
        
        # Validate the status value
        if new_status not in dict(ProjectListing.STATUS_CHOICES).keys():
            return Response(
                {"detail": "Invalid status value."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Only the creator can update to 'completed' or 'cancelled'
        if new_status in ['completed', 'cancelled'] and project.creator != request.user:
            return Response(
                {"detail": "Only the project creator can mark a project as completed or cancelled."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        project.status = new_status
        project.save()
        
        serializer = self.get_serializer(project)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-created_at')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def conversations(self, request):
        user = request.user
        sent_messages = Message.objects.filter(sender=user).values_list('receiver', flat=True).distinct()
        received_messages = Message.objects.filter(receiver=user).values_list('sender', flat=True).distinct()
        
        # Combined unique users that this user has conversations with
        conversation_users_ids = set(list(sent_messages) + list(received_messages))
        conversation_users = User.objects.filter(id__in=conversation_users_ids)
        
        result = []
        for other_user in conversation_users:
            # Get the latest message in this conversation
            latest_message = Message.objects.filter(
                (Q(sender=user) & Q(receiver=other_user)) | 
                (Q(sender=other_user) & Q(receiver=user))
            ).order_by('-created_at').first()
            
            # Count unread messages from this user
            unread_count = Message.objects.filter(
                sender=other_user, 
                receiver=user, 
                is_read=False
            ).count()
            
            result.append({
                'user': UserSerializer(other_user).data,
                'latest_message': MessageSerializer(latest_message).data if latest_message else None,
                'unread_count': unread_count
            })
            
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def with_user(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {"detail": "You must provide a user_id parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            other_user = User.objects.get(id=user_id)
            messages = Message.objects.filter(
                (Q(sender=request.user) & Q(receiver=other_user)) | 
                (Q(sender=other_user) & Q(receiver=request.user))
            ).order_by('created_at')
            
            # Mark messages as read
            unread_messages = messages.filter(receiver=request.user, is_read=False)
            for msg in unread_messages:
                msg.is_read = True
                msg.save()
                
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
            
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def for_user(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {"detail": "You must provide a user_id parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            user = User.objects.get(id=user_id)
            reviews = Review.objects.filter(reviewee=user).order_by('-created_at')
            serializer = self.get_serializer(reviews, many=True)
            return Response(serializer.data)
            
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def create(self, request, *args, **kwargs):
        # Check if the project exists and is completed
        project_id = request.data.get('project')
        try:
            project = ProjectListing.objects.get(id=project_id)
            if project.status != 'completed':
                return Response(
                    {"detail": "You can only review completed projects."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Only project creator or the assigned assembler can leave reviews
            if request.user != project.creator and request.user != project.assigned_to:
                return Response(
                    {"detail": "Only the project creator or the assigned assembler can leave reviews."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            # The reviewer cannot review themselves
            reviewee_id = request.data.get('reviewee')
            if int(reviewee_id) == request.user.id:
                return Response(
                    {"detail": "You cannot review yourself."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Make sure the reviewee is either the project creator or assigned assembler
            reviewee = User.objects.get(id=reviewee_id)
            if reviewee != project.creator and reviewee != project.assigned_to:
                return Response(
                    {"detail": "The reviewee must be involved in this project."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Check if a review already exists
            if Review.objects.filter(project=project, reviewer=request.user).exists():
                return Response(
                    {"detail": "You have already reviewed this project."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except ProjectListing.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Reviewee not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
