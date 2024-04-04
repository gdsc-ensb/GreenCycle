from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import User
from datetime import datetime
import os


def get_profile_picture_path(instance, filename):
    today = datetime.today()
    year_month = today.strftime('%Y-%m')
    return os.path.join('profile_pictures', year_month, filename)


class LoginActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    position = models.CharField(max_length=256, null=True, blank=True)
    machine_type = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return str(self.user) + " login data"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = PhoneNumberField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    address = models.CharField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    picture = models.ImageField(
        upload_to=get_profile_picture_path, null=True, blank=True)

    def __str__(self):
        return self.user.username


class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(blank=True, null=True)
    phone_number = PhoneNumberField(blank=True, null=True)
    address = models.CharField(blank=True, null=True)

    def __str__(self):
        return self.user.username


class ResetPasswordOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.IntegerField()
    expiration_time = models.DateTimeField()
