from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('create_user/', views.CreateUserView.as_view(), name='create_user'),
    path('create_company/', views.CreateCompanyView.as_view(), name='create_company'),
    path('create_profile/', views.CreateUserProfileView.as_view(),
         name='create_profile'),
    path('login/', views.signin, name='api_token_auth'),
    path('logout/', views.signout, name='logout'),
]
