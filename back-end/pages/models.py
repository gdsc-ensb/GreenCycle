from django.db import models
from django.contrib.auth.models import User
from accounts.models import Company


def upload_to(instance, filename):
    now = instance.post.created_at
    return f'post_images/{now.year}{now.month:02d}/{filename}'


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    caption = models.TextField(blank=True, null=True)
    likes = models.ManyToManyField(
        User, related_name='liked_posts', blank=True)

    def __str__(self):
        return f'{self.user.username} - {self.created_at}'


class PostImage(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=upload_to)

    def __str__(self):
        return f'{self.post.user.username} - {self.post.created_at} - Image'


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.created_at} - Comment'

    class Meta:
        ordering = ['-created_at']


class Materials(models.Model):
    name = models.CharField(max_length=256, null=True, blank=True)
    value = models.CharField(max_length=256, unique=True)


class SubMaterials(models.Model):
    material = models.ForeignKey(
        Materials, on_delete=models.CASCADE, related_name='sub_materials')
    name = models.CharField(max_length=256, null=True, blank=True)
    value = models.CharField(max_length=256, unique=True)


class DeliveryOrder(models.Model):
    CREATED = 'c'
    STARTED = 's'
    ACCEPTED = 'a'
    REJECTED = 'r'
    DONE = 'd'

    STATUS_CHOICES = [
        (CREATED, 'Created'),
        (STARTED, 'Started'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
        (DONE, 'Done'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    material = models.ForeignKey(
        Materials, on_delete=models.CASCADE, related_name='delivery_orders')
    sub_material = models.ForeignKey(
        SubMaterials, on_delete=models.CASCADE, related_name='delivery_orders')
    weight = models.FloatField(default=0)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=5, verbose_name='Latitude'
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=5, verbose_name='Longitude'
    )
    notes = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=CREATED)
    modified = models.DateTimeField(auto_now=True)


class DeliveryOrderPictures(models.Model):
    delivery_order = models.ForeignKey(
        DeliveryOrder, on_delete=models.CASCADE, related_name='pictures')
    picture = models.ImageField(
        upload_to='delivery_orders/images/', default="")


class CompanyOrder(models.Model):
    LOCATION = 'l'
    MATERIAL = 'm'
    OTHER = 'o'

    PROBLEM_CHOICES = [
        (LOCATION, 'Location Problem'),
        (MATERIAL, 'Material Problem'),
        (OTHER, 'Other Problem'),
    ]
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name='orders')
    order = models.OneToOneField(
        DeliveryOrder, on_delete=models.CASCADE, related_name='companyorder')
    is_accepted = models.BooleanField(null=True, blank=True)
    holding_time = models.DateTimeField(null=True, blank=True)
    Problem = models.CharField(
        max_length=1, choices=PROBLEM_CHOICES, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    modified = models.DateTimeField(auto_now=True)
