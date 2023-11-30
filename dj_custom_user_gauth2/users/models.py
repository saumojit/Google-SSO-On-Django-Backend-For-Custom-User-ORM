import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractBaseUser

from .managers import CustomUserManager

class CustomUser(AbstractBaseUser   , PermissionsMixin):
    email=models.EmailField(_("email address") , unique=True )
    firstname=models.CharField(max_length=100)
    lastname=models.CharField(max_length=100)
    is_staff=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)
    sso_enabled=models.BooleanField(default=False)
    sso_type=models.CharField(max_length=10)
    createdAt=models.DateTimeField(auto_now_add=True)
    # username=models.CharField(max_length=40, unique=True)
    # password=models.CharField(max_length=100)
    # id=models.UUIDField(primary_key=True,editable=False , default=uuid.uuid4)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["sso_enabled"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email


