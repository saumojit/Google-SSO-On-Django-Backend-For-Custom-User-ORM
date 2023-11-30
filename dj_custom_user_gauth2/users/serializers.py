from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken , AccessToken

from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id' , 'email' , 'firstname' , 'lastname' , 'is_staff' , 'sso_enabled' , 'createdAt']

class CustomUserSerializerWithToken(CustomUserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser
        fields=[ 'email' , 'token' ,  'firstname' , 'lastname' ]

    def get_token(self , obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

