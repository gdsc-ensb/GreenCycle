from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Company


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    # def create(self, validated_data):
    #     # Access user from context
    #     user = self.context.get('view').request.user
    #     validated_data['user'] = user
    #     return super().create(validated_data)


class CompanySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'


class UserDataSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['address', 'bio', 'birth_date',
                  'phone_number', 'picture', 'user']
