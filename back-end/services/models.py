from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models


class MaterialType(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class MaterialSubType(models.Model):
    name = models.CharField(max_length=255)
    material_type = models.ForeignKey(MaterialType, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.material_type.name} - {self.name}'


class Service(models.Model):
    individual = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='individual_services')
    company = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='company_services')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Service between {self.individual.username} and {self.company.username}'


class ServiceDetails(models.Model):
    service = models.OneToOneField(
        Service, on_delete=models.CASCADE, related_name='details')
    material_type = models.ForeignKey(MaterialType, on_delete=models.CASCADE)
    material_subtype = models.ForeignKey(
        MaterialSubType, on_delete=models.CASCADE)
    weight = models.FloatField(blank=True, null=True)
    location = gis_models.PointField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Details for service between {self.service.individual.username} and {self.service.company.username}'


class TempServiceDetails(models.Model):
    individual = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='individual_temp_services')
    material_type = models.ForeignKey(MaterialType, on_delete=models.CASCADE)
    material_subtype = models.ForeignKey(
        MaterialSubType, on_delete=models.CASCADE)
    weight = models.FloatField(blank=True, null=True)
    location = gis_models.PointField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Temp Service from {self.individual.username}'
