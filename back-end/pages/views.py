from django.shortcuts import redirect, render,  get_object_or_404
from django.utils import timezone
from django.contrib.sessions.models import Session
from django.contrib.auth import logout, login
from django.contrib.auth.models import User
from django import http
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.db.models import F
import random
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.conf import settings
import requests
from datetime import datetime, timedelta
from accounts.models import LoginActivity, UserProfile, ResetPasswordOTP, Company
from accounts.serializers import UserDataSerializer, CompanySerializer
from .serializers import PostSerializer, MaterialSerializer, DeliveryOrderSerializer, CompanyOrderSerializer, CommentSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from . import models


def get_wilaya_from_coordinates(latitude, longitude):
    # Make a reverse geocoding request to the chosen service
    url = f'https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key=putApiKey'
    response = requests.get(url)
    data = response.json()

    # Parse the response and extract the Wilaya or relevant location information
    if data['status'] == 'OK':
        results = data['results']
        if results:
            # Assuming the Wilaya is present in the first result
            for component in results[0]['address_components']:
                # Assuming 'Wilaya' is in the name
                if 'wilaya' in component['long_name'].lower():
                    return component['long_name']
    return None


def index(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'pages/index.html')


def signup_page(request):
    return render(request, 'pages/signup.html')


def signup_company(request):
    return render(request, 'pages/signup-company.html')


def signin_page(request):
    return render(request, 'pages/signin.html')


def signup_details_page(request):
    return render(request, 'pages/signup-details.html')


def profile_page(request):
    if request.user.is_authenticated:
        try:
            if request.user.userprofile:
                return render(request, 'pages/profile.html')
        except:
            try:
                if request.user.company:
                    return render(request, 'pages/profile.html')
            except:
                return redirect('index')
    return redirect('index')


def reset_password(request):
    return render(request, 'pages/reset_password.html')


def confirm_mail(request):
    user_id = None
    if request.method == 'POST':
        if 'user_id' in request.POST:
            user_id = request.POST['user_id']
        return render(request, 'pages/confirm_mail.html', {'user_id': user_id})
    return redirect('index')


def edit_profile(request):
    can_pass = True
    if request.user.is_authenticated:
        try:
            request.user.userprofile
        except:
            try:
                request.user.company
            except:
                can_pass = False
        if can_pass:
            if LoginActivity.objects.filter(user=request.user).exists():
                login_activities = LoginActivity.objects.filter(
                    user=request.user)
                activities = []
                # coordinates = []
                # machines = []
                for activity in login_activities:
                    machine_type = activity.machine_type
                    login_time = activity.login_time
                    # machines.append(machine_type)
                    lng_lat = activity.position
                    if lng_lat is not None:
                        try:
                            lng, lat = lng_lat.split(":")
                            # wilaya = get_wilaya_from_coordinates(lng, lat)
                        except:
                            pass
                        wilaya = None
                        # coordinates.append(wilaya)
                    else:
                        wilaya = None
                        # coordinates.append(None)
                    activities.append(
                        {'place': wilaya, 'machine': machine_type, 'login_time': login_time})

                return render(request, 'pages/edit_profile.html', {'activities': activities})
            return render(request, 'pages/edit_profile.html')
    return redirect('index')


def change_password(request):
    if request.user.is_authenticated:
        if request.user.userprofile:
            return render(request, 'pages/change_password.html')
    return redirect('index')


def home(request):
    if request.user.is_authenticated:
        try:
            if request.user.userprofile:
                return render(request, 'pages/home.html')
        except:
            try:
                if request.user.company:
                    return render(request, 'pages/home.html')
            except:
                pass
    return redirect('index')


def call_delivery_page(request):
    if request.user.is_authenticated:
        if request.user.userprofile:
            return render(request, 'pages/call_delivery.html')
    return redirect('index')


def select_company_page(request, delivery_order_id):
    if request.user.is_authenticated:
        if request.user.userprofile:
            delivery_order = get_object_or_404(
                models.DeliveryOrder, pk=delivery_order_id, user=request.user)
            try:
                if delivery_order.companyorder is not None:
                    return redirect('profile')
            except:
                return render(request, 'pages/select_company.html', {'delivery_order': delivery_order})
    return redirect('index')


def manage_orders(request, company_order_id):
    if request.user.is_authenticated:
        if request.user.company:
            company_order = get_object_or_404(
                models.CompanyOrder, pk=company_order_id, company=request.user.company)
            if company_order.is_accepted is None:
                return render(request, 'pages/service.html', {'company_order': company_order})
    return redirect('index')


# functionalities

def update_password(request):
    message = ""
    code = -1
    newPassword = None
    if request.method == 'POST':
        if 'newPassword' in request.POST:
            newPassword = request.POST['newPassword']

    if request.user.is_authenticated:
        if newPassword is not None:
            user = request.user
            user.set_password(newPassword)
            user.save()
            if user is not None:
                login(request, user)

    return JsonResponse({'message': message, 'code': code})


class GetProfileData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserDataSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


def update_user_data(request):
    firstName = None
    lastName = None
    phone = None
    address = None
    birthdate = None
    profilePicture = None
    bio = None
    message = ""
    code = -1
    res_status = status.HTTP_200_OK

    if request.method == "POST" and 'updateDataBtn' in request.POST:
        if 'firstName' in request.POST:
            if request.POST['firstName'] != "undefined":
                firstName = request.POST['firstName']
        if 'lastName' in request.POST:
            if request.POST['lastName'] != "undefined":
                lastName = request.POST['lastName']
        if 'phone' in request.POST:
            if request.POST['phone'] != "undefined":
                phone = request.POST['phone']
        if 'address' in request.POST:
            if request.POST['address'] != "undefined":
                address = request.POST['address']
        if 'birthdate' in request.POST:
            if request.POST['birthdate'] != "undefined":
                birthdate = request.POST['birthdate']
        if 'bio' in request.POST:
            bio = request.POST['bio']
        if 'profilePicture' in request.FILES:
            profilePicture = request.FILES['profilePicture']

    if any([firstName, lastName, phone, address, birthdate, profilePicture]):
        if request.user.is_authenticated:
            user = request.user
            if hasattr(user, 'userprofile'):
                profile = user.userprofile
            else:
                profile = UserProfile.objects.create(user=user)
            if firstName is not None:
                user.first_name = firstName
            if lastName is not None:
                user.last_name = lastName
            if phone is not None:
                profile.phone_number = phone
            if address is not None:
                profile.address = address
            if birthdate is not None:
                profile.birth_date = birthdate
            if bio is not None:
                profile.bio = bio
            if profilePicture is not None:
                profile.picture.save(
                    profilePicture.name, profilePicture, save=True)
            user.save()
            profile.save()
            message = "User data updated successfully"
            code = 1
        else:
            message = "Please login to perform this action."
            res_status = status.HTTP_401_UNAUTHORIZED
    else:
        message = "Please fill out all fields."
        res_status = status.HTTP_406_NOT_ACCEPTABLE

    return JsonResponse({'message': message, 'code': code}, status=res_status)


def logout_all(request):
    message = ""
    code = -1
    if request.method == 'POST':
        if request.user.is_authenticated:
            if request.user.userprofile:
                loginActivities = LoginActivity.objects.filter(
                    user=request.user)
                sessions = Session.objects.all()
                if loginActivities.exists():
                    # delete  all login activities of the current logged in user
                    for activity in loginActivities:
                        activity.delete()
                for session in sessions:
                    try:
                        if request.user.id == int(session.get_decoded().get('_auth_user_id')):
                            session.delete()
                    except:
                        pass
                message = "logged out from all devices"
                code = 0
    return JsonResponse({'message': message, 'code': code})


def desactivate_account(request):
    message = ""
    code = -1
    if request.method == 'POST':
        if request.user.is_authenticated:
            request.user.is_active = False
            request.user.save()
            message = "Account deactivated successfully"
            code = 0
    return JsonResponse({'message': message, 'code': code})


def delete_account(request):
    message = ""
    code = -1
    if request.method == 'POST':
        if request.user.is_authenticated:
            request.user.delete()
            message = "Account deleted successfully"
            code = 0
    return JsonResponse({'message': message, 'code': code})


def generate_otp():
    # Generate a random 4-digit OTP
    return ''.join([str(random.randint(0, 9)) for _ in range(4)])


def send_otp_email(email, otp):
    subject = 'Password Reset OTP'
    message = f'Your OTP for password reset is:\n {otp}'
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [email])


# OTP expiration time
OTP_EXPIRATION_MINUTES = 5


def is_otp_expired(timestamp):
    return datetime.now() > timestamp


def send_otp(request):
    """
    Send OTP to given email in request body or raise a validation error.
    """
    email = None
    user = None
    if request.method == 'POST':
        if 'email' in request.POST:
            email = request.POST['email']
        if email is not None and User.objects.filter(email=email).exists():
            user = User.objects.filter(email=email).first()
        if user:
            otp = generate_otp()
            # Set expiration time
            otp_expiry = datetime.now() + timedelta(minutes=OTP_EXPIRATION_MINUTES)
            send_otp_email(email, otp)
            # Store the OTP and its expiration time in the database
            otp_instance = ResetPasswordOTP.objects.create(
                user=user, otp=otp, expiration_time=otp_expiry
            )
            otp_instance.save()
            return JsonResponse({'message': 'OTP sent successfully', 'status': status.HTTP_200_OK, 'user_id': user.id})
        else:
            return JsonResponse({'message': "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'message': "Method not allowed"},
                            status=status.HTTP_405_METHOD_NOT_ALLOWED)


def verify_otp(request):
    """
    Verify an OTP provided by the  user against the one stored in the database. If they match, go to reset password page.
    """
    otp = None
    user_otp = None
    userID = None

    if request.method == 'POST':
        if 'user_otp' in request.POST:
            user_otp = request.POST['user_otp']
        if 'userID' in request.POST:
            userID = request.POST['userID']
        if user_otp is not None and userID is not None:
            if User.objects.filter(id=userID).exists():
                user = User.objects.get(id=userID)
                if ResetPasswordOTP.objects.filter(
                    user=user,
                    expiration_time__gt=datetime.now()
                ).exists():
                    otp_instance = ResetPasswordOTP.objects.filter(
                        user=user,
                        expiration_time__gt=datetime.now()
                    ).last()
                    otp = otp_instance.otp
        if otp is not None:
            if int(otp) == int(user_otp):
                login(request, user)
                return JsonResponse({'message': 'OTP verified', 'valid': True}, status=status.HTTP_202_ACCEPTED)
            else:
                return JsonResponse({'message': "OTP doesn't match"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return JsonResponse({'message': "There's no valid OTP for this user"}, status=status.HTTP_404_NOT_FOUND)

    else:
        return JsonResponse({'message': "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def share_post(request):
    caption = None
    pictures = None
    if request.method == "POST":
        if 'caption' in request.POST:
            caption = request.POST["caption"]
        if 'pictures' in request.FILES:
            pictures = request.FILES.getlist('pictures')
    if caption is not None:
        if request.user.is_authenticated:
            user = request.user
            post = models.Post(
                user=user,
                caption=caption
            )
            post.save()
            if pictures is not None:
                for picture in pictures:
                    post_image = models.PostImage(post=post, image=picture)
                    post_image.save()
            return JsonResponse({'message': "post shared"}, status=status.HTTP_201_CREATED)
    return JsonResponse({'message': "data is not enogh"}, status=status.HTTP_400_BAD_REQUEST)


class GetPosts(ListAPIView):
    serializer_class = PostSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        limit = 20

        # Fetch fewer than 20 posts
        return models.Post.objects.all().order_by('-created_at')[:limit]


@require_POST
def toggle_like(request, post_id):
    post = get_object_or_404(models.Post, id=post_id)
    user = request.user

    if user.is_authenticated:
        if user in post.likes.all():
            post.likes.remove(user)
            return JsonResponse({'liked': False})
        else:
            post.likes.add(user)
            return JsonResponse({'liked': True})
    else:
        return JsonResponse({'error': 'User is not authenticated.'}, status=401)


@require_POST
def send_comment(request, post_id):
    post = get_object_or_404(models.Post, id=post_id)
    user = request.user
    content = None

    if 'content' in request.POST:
        content = request.POST['content']
    if user.is_authenticated:
        if content is not None and post is not None:
            comment = models.Comment(user=user, post=post, content=content)
            comment.save()
            posts_comments = models.Comment.objects.filter(post=post)
            comment_serializer = CommentSerializer(posts_comments, many=True)
            return JsonResponse(comment_serializer.data, safe=False)
        return JsonResponse({'error': 'Comment is not provided.'}, status=400)
    else:
        return JsonResponse({'error': 'User is not authenticated.'}, status=401)


@require_POST
def repost(request, post_id):
    post = get_object_or_404(models.Post, id=post_id)
    user = request.user
    if user.is_authenticated:
        # create a new Post with the same data as the original one but with the user field set to the current user
        new_post = post
        new_post.pk = None
        new_post.user = user
        new_post.save()

        post = get_object_or_404(models.Post, id=post_id)
        post_images = models.PostImage.objects.filter(post=post).all()
        for original_image in post_images:
            new_image = original_image
            new_image.pk = None
            new_image.post = new_post
            new_image.save()
        return JsonResponse({'message': 'Reposted'})
    else:
        return JsonResponse({'error': 'User is not authenticated.'}, status=401)


class GetMaterials(ListAPIView):
    serializer_class = MaterialSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = models.Materials.objects.all()


class CreateDeliveryOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        material = None
        sub_material = None
        weight = None
        latitude = None
        longitude = None
        pictures = None
        notes = None
        if "material" in data and "sub_material" in data and 'weight' in data \
                and 'latitude' in data and 'longitude' in data and 'notes' in data:
            try:
                material = models.Materials.objects.get(
                    value=data["material"])
                sub_material = models.SubMaterials.objects.get(
                    material=material, value=data['sub_material'])
                weight = float(data['weight'])
                latitude = float(data['latitude'])
                longitude = float(data['longitude'])
                notes = data['notes']
                # Checking if the user has uploaded a picture or not
                if 'pictures' in request.FILES:
                    pictures = request.FILES.getlist('pictures')
            except ObjectDoesNotExist as e:
                return Response("The specified material or sub material does not exist.", status=status.HTTP_404_NOT_FOUND)

        if material is not None and sub_material is not None and weight is not None and latitude is not None and longitude is not None and notes is not None:
            delivery_order = models.DeliveryOrder(
                user=self.request.user, material=material, sub_material=sub_material, weight=weight, latitude=latitude, longitude=longitude, notes=notes)
            delivery_order.save()
            if pictures is not None:
                for picture in pictures:
                    delivery_order_picture = models.DeliveryOrderPictures(
                        delivery_order=delivery_order, picture=picture)
                    delivery_order_picture.save()
            return Response(DeliveryOrderSerializer(delivery_order).data, status=status.HTTP_201_CREATED)
        raise ValidationError("Missing some parameters")


class GetCompaniesListView(ListAPIView):
    serializer_class = CompanySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Company.objects.all()


class CallCompany(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        company = None
        delivery_order = None
        if "company" in data and "order_id" in data:
            try:
                company = Company.objects.get(
                    pk=data["company"])
                delivery_order = models.DeliveryOrder.objects.get(
                    pk=data['order_id'])
            except ObjectDoesNotExist as e:
                return Response("The specified order or company does not exist.", status=status.HTTP_404_NOT_FOUND)
            except:
                return Response("Unknown error", status=status.HTTP_400_BAD_REQUEST)

        if company is not None and delivery_order is not None:
            models.CompanyOrder.objects.get_or_create(
                company=company, order=delivery_order)
            company_order = models.CompanyOrder.objects.get(
                company=company, order=delivery_order)
            delivery_order.status = 's'
            delivery_order.save()
            # change serializer
            return Response(CompanyOrderSerializer(company_order).data, status=status.HTTP_201_CREATED)
        raise ValidationError("Missing some parameters")


class GetServices(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        services = models.CompanyOrder.objects.filter(
            company_id=self.request.user.company.id)
        return Response(CompanyOrderSerializer(services, many=True).data, status=status.HTTP_200_OK)


class GetCompanyOrder(RetrieveAPIView):
    queryset = models.CompanyOrder.objects.all()
    serializer_class = CompanyOrderSerializer
    permission_classes = [IsAuthenticated]


class AcceptRefuseOrder(APIView):
    permission_classes = [IsAuthenticated]

    action = None
    order_id = None
    order = None
    problem = None
    datetime = None

    def post(self, request):
        if 'order' in request.data:
            self.order_id = int(request.data['order'])
            try:
                self.order = models.CompanyOrder.objects.get(pk=self.order_id)
            except ObjectDoesNotExist:
                return Response("The specified order does not exist.", status=status.HTTP_404_NOT_FOUND)
            if 'problem' in request.data:
                self.problem = request.data['problem']
                self.action = 'refuse'
            elif 'datetime' in request.data:
                try:
                    self.datetime = datetime.strptime(
                        request.data['datetime'], '%Y-%m-%dT%H:%M')
                    self.action = 'accept'
                except ValueError as e:
                    raise ValidationError('Incorrect data time format')
            else:
                raise ValidationError('Problem or DateTime must be defined')
            if self.action == 'accept':
                self.order.is_accepted = True
                self.order.holding_time = self.datetime
                self.order.order.status = 'a'
            elif self.action == 'refuse':
                self.order.is_accepted = False
                if self.problem == '1':
                    self.order.Problem = 'l'
                elif self.problem == '2':
                    self.order.Problem = 'm'
                else:
                    self.order.Problem = 'o'
                self.order.order.status = 'r'
            else:
                raise NotImplementedError()
            if 'description' in request.data:
                self.order.note = request.data['description']
            self.order.save()
            serializer = CompanyOrderSerializer(instance=self.order)
            return Response(serializer.data)
        else:
            raise ValidationError('Parameter "order" missing')


class getUserHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = models.DeliveryOrder.objects.filter(
            user=self.request.user).order_by('-modified')
        return Response(DeliveryOrderSerializer(orders, many=True).data, status=status.HTTP_200_OK)
