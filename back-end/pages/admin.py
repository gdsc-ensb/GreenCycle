from django.contrib import admin
from . import models

admin.site.register(models.Post)
admin.site.register(models.PostImage)
admin.site.register(models.Comment)
admin.site.register(models.Materials)
admin.site.register(models.SubMaterials)
admin.site.register(models.DeliveryOrder)
admin.site.register(models.DeliveryOrderPictures)
admin.site.register(models.CompanyOrder)
