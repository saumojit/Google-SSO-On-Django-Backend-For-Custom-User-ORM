from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view() , name='token-obtain-pair' ),  # keep token auth url on top 
    path('adduser/' , views.addUser , name='add-user') ,
    path('login/sso/' , views.authenticate_with_google , name='login-sso') ,
]