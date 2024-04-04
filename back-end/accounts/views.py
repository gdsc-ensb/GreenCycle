import random
import string
from django.shortcuts import redirect
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import UserProfile, Company, LoginActivity
from .serializers import UserSerializer, UserProfileSerializer, CompanySerializer
from datetime import timezone


class CreateUserView(APIView):
    def generate_random_username(self):
        return f'{self.request.data["first_name"]}.{self.request.data["last_name"]}{"".join(random.choices(string.digits, k=3))}'

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with this email already exists.")

    def post(self, request, *args, **kwargs):
        user_data = request.data
        if 'username' not in user_data:
            _mutable = user_data._mutable

            # set to mutable
            user_data._mutable = True
            # сhange the values you want
            user_data['username'] = self.generate_random_username()
            while User.objects.filter(username=user_data['username']).exists():
                user_data['username'] = self.generate_random_username()
            # set mutable flag back
            user_data._mutable = _mutable
        if 'password' in user_data:  # Check if password is provided
            _mutable = user_data._mutable
            # set to mutable
            user_data._mutable = True
            user_data['is_active'] = True
            user_data['password'] = make_password(
                user_data['password'])  # Hash the password
            # set mutable flag back
            user_data._mutable = _mutable
        self.validate_email(user_data['email'])
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            return Response(
                {'user': user_serializer.data},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateCompanyView(APIView):
    def generate_random_username(self):
        return f'{self.request.data["name"]}{"".join(random.choices(string.digits, k=2))}'

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with this email already exists.")

    def post(self, request, *args, **kwargs):
        user_data = request.data
        if 'username' not in user_data:
            _mutable = user_data._mutable

            # set to mutable
            user_data._mutable = True
            # сhange the values you want
            user_data['username'] = self.generate_random_username()
            while User.objects.filter(username=user_data['username']).exists():
                user_data['username'] = self.generate_random_username()
            # set mutable flag back
            user_data._mutable = _mutable
        if 'password' in user_data:  # Check if password is provided
            _mutable = user_data._mutable
            # set to mutable
            user_data._mutable = True
            user_data['is_active'] = True
            user_data['first_name'] = user_data['name']
            user_data['password'] = make_password(
                user_data['password'])  # Hash the password
            # set mutable flag back
            user_data._mutable = _mutable
        self.validate_email(user_data['email'])
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            data = request.data.copy()
            if "phone_number" in data and data["phone_number"].startswith("0"):
                data["phone_number"] = "+213" + data["phone_number"]
            data['user_id'] = user.id
            data['user'] = user
            try:
                company_instance = Company.objects.create(
                    user=user, name=data['name'], phone_number=data['phone_number'], address=data['address'])
                company_serializer = CompanySerializer(company_instance)
                return Response(
                    {'user': user_serializer.data},
                    status=status.HTTP_201_CREATED
                )
            except:
                user.delete()
                return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()  # Create a copy to avoid modifying original data
        data['user'] = str(request.user.pk)
        # check if phone number is started with 0 so replace it by +213
        if "phone_number" in data and data["phone_number"].startswith("0"):
            data["phone_number"] = "+213" + data["phone_number"]
        serializer = UserProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def signin(request, user=None):
    username = None
    password = None
    user_position = None
    agent = None
    if request.method == 'POST':
        if 'username' in request.POST:
            username = request.POST['username']
        if 'password' in request.POST:
            password = request.POST['password']
        if 'user_position' in request.POST:
            user_position = request.POST['user_position']
        if 'agent' in request.POST:
            agent = request.POST['agent']
    if user is None:
        if username and password:
            user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        login_activity = LoginActivity.objects.create(
            user=user,
            position=user_position,
            machine_type=agent
        )
        login_activity.save()
        content = {
            'message': 'Login successful',
            'user': str(user),
            'status': status.HTTP_200_OK
        }
        return JsonResponse(content)
    else:
        content = {'error': "Invalid user",
                   'status': status.HTTP_401_UNAUTHORIZED}
        return JsonResponse(content)


def signout(request):
    logout(request)
    return redirect('index')
