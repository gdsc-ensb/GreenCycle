# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from accounts.models import UserProfile
from accounts import serializers as accounts_serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('picture',)


class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'userprofile')


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ('image',)


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    images = PostImageSerializer(many=True)
    comments = CommentSerializer(many=True)

    class Meta:
        model = Post
        fields = ('id', 'user', 'caption', 'created_at',
                  'likes', 'images', 'comments')


class SubMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubMaterials
        fields = ['name', 'value']


class MaterialSerializer(serializers.ModelSerializer):
    sub_materials = SubMaterialSerializer(many=True)

    class Meta:
        model = Materials
        fields = '__all__'


class DeliveryOrderPicturesSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryOrderPictures
        fields = '__all__'


class DeliveryOrderSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    pictures = DeliveryOrderPicturesSerializer(many=True)
    material = MaterialSerializer()
    sub_material = SubMaterialSerializer()
    company_companyorder = serializers.SerializerMethodField(required=False)

    class Meta:
        model = DeliveryOrder
        fields = '__all__'

    def get_company_companyorder(self, obj):
        try:
            if obj.companyorder:
                return CompanyOrderForUserSerializer(obj.companyorder).data
            return None
        except:
            return None


class CompanyOrderSerializer(serializers.ModelSerializer):
    order = DeliveryOrderSerializer(required=False)

    class Meta:
        model = CompanyOrder
        fields = '__all__'


class CompanyOrderForUserSerializer(serializers.ModelSerializer):
    company = accounts_serializers.CompanySerializer()

    class Meta:
        model = CompanyOrder
        fields = '__all__'
