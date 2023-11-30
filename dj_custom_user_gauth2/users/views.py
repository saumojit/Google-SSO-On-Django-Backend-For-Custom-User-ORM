# from django.contrib.auth.models import User
# from django.shortcuts import render
import requests
import traceback 
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser
from .serializers import CustomUserSerializerWithToken

# for username-password authentication only
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs ):
        attrs=dict(attrs)
        data = super().validate(attrs) # it generates access and refresh token 
        serializer = CustomUserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer


# # # this will regiester the user with user-password credentials
@api_view(['POST'])
def addUser(request):
    data= request.data
    try:
        user=CustomUser.objects.create_user_v2(
            email=data['email'],
            password=data['password'] ,
            sso_enabled=False ,
            sso_type='',
            firstname = data['firstname'] ,
            lastname = data['lastname'] ,
        )
        serializer = CustomUserSerializerWithToken(user , many=False)
        return Response(serializer.data)
        # return Response(f"user : {user} is added to db")
    except Exception as e :
        traceback.print_exc()
        message = {'detail': 'User With This Email Already Exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


# # # this will regiester & login the user with google sso
@api_view(['POST'])
def authenticate_with_google(request):
    endpoint = "https://www.googleapis.com/oauth2/v1/userinfo"
    try:
        google_access_token=request.data['google_access_token']["access_token"]
        params = {"access_token": google_access_token }
        data = requests.get(endpoint, params=params, headers={'Content-type': 'application/json'}).json()
        email=data['email']
        firstname=data['name'].split(' ')[0]
        lastname=' '.join(data['name'].split(' ')[1:])
        userifExists= CustomUser.objects.filter(email=email)
        if(not userifExists):
            user=CustomUser.objects.create_user_v2(
                data['email'],
                password='' , 
                sso_enabled=True , 
                sso_type='Google' , 
                firstname=firstname ,
                lastname=lastname , 
            )
            return Response(f"User : {user} has been added to the db")
        else:
            user=userifExists[0]
        serializer = CustomUserSerializerWithToken(user , many=False)
        return Response(serializer.data)
    except Exception as e :
        traceback.print_exc()
        message = {'detail': 'Error Occured While Logging with Google SSO'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


