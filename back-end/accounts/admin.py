from django.contrib import admin
from . import models

admin.site.register(models.UserProfile)
admin.site.register(models.LoginActivity)
admin.site.register(models.ResetPasswordOTP)
admin.site.register(models.Company)
